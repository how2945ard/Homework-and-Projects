#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <sys/socket.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

#define ERR_EXIT(a) { perror(a); exit(1); }

typedef enum { false, true } bool;

typedef struct {
    char hostname[512];  // server's hostname
    unsigned short port;  // port to listen
    int listen_fd;  // fd to wait for a new connection
} server;

typedef struct {
  int id;
  int amount;
  int price;
} Item;

typedef struct {
  char host[512];  // client's host
  int conn_fd;  // fd to talk with client
  char buf[512];  // data sent by/to client
  size_t buf_len;  // bytes used by buf
  // you don't need to change this.
  int item;
  int wait_for_write;  // used by handle_read to know if the header is read or not.
} request;

server svr;  // server
request* requestP = NULL;  // point to a list of requests
int maxfd;  // size of open file descriptor table, size of request list

const char* accept_read_header = "ACCEPT_FROM_READ";
const char* accept_write_header = "ACCEPT_FROM_WRITE";

// Forwards
Item find_item(Item* item_list, int id);
void set_nonblock(int socket);

static void init_server(unsigned short port);
// initailize a server, exit for error

static void init_request(request* reqP);
// initailize a request instance

static void free_request(request* reqP);
// free resources used by a request instance

static int handle_read(request* reqP);
// return 0: socket ended, request done.
// return 1: success, message (without header) got this time is in reqP->buf with reqP->buf_len bytes. read more until got <= 0.
// It's guaranteed that the header would be correctly set after the first read.
// error code:
// -1: client connection error

int main(int argc, char** argv) {
    int i, ret;

    struct sockaddr_in cliaddr;  // used by accept()
    int clilen;

    int conn_fd;  // fd for a new connection with client
    int file_fd;  // fd for file that we open for reading
    char buf[512];
    int socket_fd = 1000;
    int socket_count = 0;
    int buf_len;
    fd_set readfds, writefds, exceptfds;
    struct timeval tv;
    tv.tv_sec  = 10;
    // tv.tv_usec = 5 * 1000 * 1000;

    // Parse args.
    if (argc != 2) {
        fprintf(stderr, "usage: %s [port]\n", argv[0]);
        exit(1);
    }

    // Initialize server
    init_server((unsigned short) atoi(argv[1]));

    // Get file descripter table size and initize request table
    maxfd = getdtablesize();
    requestP = (request*) malloc(sizeof(request) * maxfd);
    if (requestP == NULL) {
        ERR_EXIT("out of memory allocating all requests");
    }
    for (i = 0; i < maxfd; i++) {
        init_request(&requestP[i]);
    }

    requestP[svr.listen_fd].conn_fd = svr.listen_fd;
    strcpy(requestP[svr.listen_fd].host, svr.hostname);

    // Loop for handling connections
    fprintf(stderr, "\nstarting on %.80s, port %d, fd %d, maxconn %d...\n", svr.hostname, svr.port, svr.listen_fd, maxfd);
    while (1) {
      // TODO: Add IO multiplexing
      conn_fd = accept(svr.listen_fd, (struct sockaddr*)&cliaddr, (socklen_t*)&clilen);
      if (conn_fd < 0) {
          if (errno == EINTR || errno == EAGAIN) continue;  // try again
          if (errno == ENFILE) {
              (void) fprintf(stderr, "out of file descriptor table ... (maxconn %d)\n", maxfd);
              continue;
          }
          ERR_EXIT("accept")
      }
      printf("getting fd %d\n", conn_fd);
      int current_socket = socket_fd - socket_count;
      printf("setting new fd %d\n", current_socket);
      dup2(conn_fd, current_socket);
      close(conn_fd);
      printf("closing fd %d\n", conn_fd);
      conn_fd = current_socket;
      printf("conn_fd fd %d\n", conn_fd);
      printf("current_socket fd %d\n", current_socket);
      socket_count += 1;
      set_nonblock(conn_fd);

      FD_ZERO(&readfds);
      FD_ZERO(&writefds);

      FD_SET(conn_fd, &readfds);

      clilen = sizeof(cliaddr);

      requestP[conn_fd].conn_fd = conn_fd;
      strcpy(requestP[conn_fd].host, inet_ntoa(cliaddr.sin_addr));
      fprintf(stderr, "getting a new request... fd %d from %s\n", conn_fd, requestP[conn_fd].host);

      int sel = select(conn_fd+1, &readfds, NULL, NULL, &tv);
      if(sel < 0){
        continue;
      }
#ifdef READ_SERVER
      if(FD_ISSET(requestP[conn_fd].conn_fd, &readfds)) {
        //clear set
        printf("Socket %d ready for read\n", requestP[conn_fd].conn_fd);
        FD_CLR(requestP[conn_fd].conn_fd, &readfds);
        ret = handle_read(&requestP[conn_fd]); // parse data from client to requestP[conn_fd].buf
        if (ret < 0) {
          fprintf(stderr, "bad request from %s\n", requestP[conn_fd].host);
          continue;
        }
        FILE* rFile;
        Item item_list[20];
        rFile = fopen("./item_list","rb");
        if (rFile == NULL){
          perror ("Error opening file");
        } else {
          int index = 0;
          while(index < 20){
            Item item;
            fread(&item, sizeof(Item), 1, rFile);
            item_list[index] = item;
            printf("%d %d %d\n", item_list[index].id, item_list[index].amount, item_list[index].price);
            index += 1;
          }
        }

        sprintf(buf,"%s",requestP[conn_fd].buf);
        int find_id = atoi(buf);
        Item found_item = find_item(item_list,find_id);
        char response[512];
        sprintf(response,"item%d $%d remain: %d\n",find_id, found_item.price, found_item.amount);

        FD_SET(requestP[conn_fd].conn_fd, &writefds);
        int sel = select(requestP[conn_fd].conn_fd+1, NULL, &writefds, NULL, &tv);
        if(sel < 0){
          continue;
        }
        if(FD_ISSET(requestP[conn_fd].conn_fd, &writefds)) {
          FD_CLR(requestP[conn_fd].conn_fd, &writefds);
          //clear set
          printf("Socket %d ready for write\n", requestP[conn_fd].conn_fd);
          write(requestP[conn_fd].conn_fd, response, strlen(response));
          if (ret < 0) {
            fprintf(stderr, "bad request from %s\n", requestP[conn_fd].host);
            continue;
          }
        }   //end if ready for read
        fclose(rFile);
        close(requestP[conn_fd].conn_fd);
        free_request(&requestP[conn_fd]);
      }   //end if ready for read
#else

      if(FD_ISSET(requestP[conn_fd].conn_fd, &readfds)) {
        //clear set
        printf("Socket %d ready for read\n", requestP[conn_fd].conn_fd);
        ret = handle_read(&requestP[conn_fd]); // parse data from client to requestP[conn_fd].buf
        FD_CLR(requestP[conn_fd].conn_fd, &readfds);
        if (ret < 0) {
          fprintf(stderr, "bad request from %s\n", requestP[conn_fd].host);
          continue;
        }
      }   //end if ready for read

      Item item_list[20];
      FILE* rFile;
      rFile = fopen("./item_list","rb");
      if (rFile == NULL){
        perror ("Error opening file");
      } else {
        int index = 0;
        while(index < 20){
          Item item;
          fread(&item, sizeof(Item), 1, rFile);
          item_list[index] = item;
          printf("%d %d %d\n", item_list[index].id, item_list[index].amount, item_list[index].price);
          index += 1;
        }
      }
      fclose(rFile);

      sprintf(buf,"%s",requestP[conn_fd].buf);
      int find_id = atoi(buf);
      FILE* wFile = fopen("./item_list","rb+");
      int cursor_position = sizeof(Item) * (find_id-1);
      fseek(wFile, cursor_position, SEEK_SET);

      char response[512];
      sprintf(response,"This item is modifiable.\n");
      write(requestP[conn_fd].conn_fd, response, strlen(response));

      ret = handle_read(&requestP[conn_fd]); // parse data from client to requestP[conn_fd].buf
      if (ret < 0) {
        fprintf(stderr, "bad request from %s\n", requestP[conn_fd].host);
        continue;
      }
      char* search = " ";
      char* sell = "sell";
      char* buy = "buy";
      char* price = "price";

      sprintf(buf,"%s",requestP[conn_fd].buf);
      char* op_text = strtok(buf, search);
      int value = atoi(strtok(NULL, search));

      bool should_exit = false;
      int op_type = -1;
      if(strcmp(op_text,sell)==0){
        op_type = 0;
      } else if(strcmp(op_text,buy)==0){
        op_type = 1;
        if(value > item_list[find_id-1].amount){
          sprintf(response,"Operation failed.\n");
          should_exit = true;
          write(requestP[conn_fd].conn_fd, response, strlen(response));
        }
      } else if(strcmp(op_text,price)==0){
        op_type = 2;
        if(value < 0){
          sprintf(response,"Operation failed.\n");
          should_exit = true;
          write(requestP[conn_fd].conn_fd, response, strlen(response));
        }
      }

      if(!should_exit){
        switch(op_type) {
          case 0 : 
            item_list[find_id-1].amount += value;
            break;
          case 1 : 
            item_list[find_id-1].amount -= value;
            break;
          case 2 : 
            item_list[find_id-1].price = value;
            break;
        }

        fwrite(&item_list[find_id-1] , sizeof(Item), 1 , wFile);
      }
      fclose(wFile);
#endif
    }
    free(requestP);
    return 0;
}

Item find_item(Item* item_list, int id){
  int index = 0;
  while(index < 20){
    if(item_list[index].id == id){
      return item_list[index];
    }
    index += 1;
  }
  Item item;
  return item;
}

void set_nonblock(int socket) {
    int flags;
    flags = fcntl(socket,F_GETFL,0);
    fcntl(socket, F_SETFL, flags | O_NONBLOCK);
}

// ======================================================================================================
// You don't need to know how the following codes are working
#include <fcntl.h>

static void* e_malloc(size_t size);


static void init_request(request* reqP) {
    reqP->conn_fd = -1;
    reqP->buf_len = 0;
    reqP->item = 0;
    reqP->wait_for_write = 0;
}

static void free_request(request* reqP) {
    /*if (reqP->filename != NULL) {
        free(reqP->filename);
        reqP->filename = NULL;
    }*/
    init_request(reqP);
}

// return 0: socket ended, request done.
// return 1: success, message (without header) got this time is in reqP->buf with reqP->buf_len bytes. read more until got <= 0.
// It's guaranteed that the header would be correctly set after the first read.
// error code:
// -1: client connection error
static int handle_read(request* reqP) {
    int r;
    char buf[512];
    // Read in request from client
    r = read(reqP->conn_fd, buf, sizeof(buf));
    if (r < 0) return -1;
    if (r == 0) return 0;
  char* p1 = strstr(buf, "\015\012");
  int newline_len = 2;
  // be careful that in Windows, line ends with \015\012
  if (p1 == NULL) {
    p1 = strstr(buf, "\012");
    newline_len = 1;
    if (p1 == NULL) {
      ERR_EXIT("this really should not happen...");
    }
  }
  size_t len = p1 - buf + 1;
  memmove(reqP->buf, buf, len);
  reqP->buf[len - 1] = '\0';
  reqP->buf_len = len-1;
    return 1;
}

static void init_server(unsigned short port) {
    struct sockaddr_in servaddr;
    int tmp;

    gethostname(svr.hostname, sizeof(svr.hostname));
    svr.port = port;

    svr.listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (svr.listen_fd < 0) ERR_EXIT("socket");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(port);
    tmp = 1;
    if (setsockopt(svr.listen_fd, SOL_SOCKET, SO_REUSEADDR, (void*)&tmp, sizeof(tmp)) < 0) {
        ERR_EXIT("setsockopt");
    }
    if (bind(svr.listen_fd, (struct sockaddr*)&servaddr, sizeof(servaddr)) < 0) {
        ERR_EXIT("bind");
    }
    if (listen(svr.listen_fd, 1024) < 0) {
        ERR_EXIT("listen");
    }
}

static void* e_malloc(size_t size) {
    void* ptr;

    ptr = malloc(size);
    if (ptr == NULL) ERR_EXIT("out of memory");
    return ptr;
}

