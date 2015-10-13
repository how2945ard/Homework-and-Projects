#include "server.h"

int main(int argc , char *argv[]){
    int socket_desc;
    int new_socket;
    int socklen;
    int* new_sock;
    struct sockaddr_in server;
    struct sockaddr_in client;
    char* message;
    struct ThreadData masterThread;
    struct User* user_List = malloc(sizeof(struct User*));
    masterThread.users = user_List;
    SSL_CTX *ctx;
    SSL_library_init();
    ctx = InitServerCTX();
    LoadCertificates(ctx, "cert.pem", "key.pem");
    socket_desc = socket(AF_INET , SOCK_STREAM , 0);
    if (socket_desc == -1){
        printf("Could not create socket");
    }
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    int port = 5900;
    server.sin_port = htons( port );
    int user_num = 0;
    while( bind(socket_desc,(struct sockaddr *)&server , sizeof(server)) < 0){
        puts("Bind failed");
        sleep(10);
    }
    puts("Bind done at");
    printf("%d\n", port);
    listen(socket_desc , 3);
    puts("Waiting for incoming connections...");
    socklen = sizeof(struct sockaddr_in);
    while( (new_socket = accept(socket_desc, (struct sockaddr *)&client, (socklen_t*)&socklen)) ){
        puts("Connection accepted");
        puts("Initiating thread");
        SSL* ssl;
        ssl = SSL_new(ctx);
        SSL_set_fd(ssl, new_socket);
        pthread_t sniffer_thread;
        new_sock = malloc(1);
        *new_sock = new_socket;
        masterThread.new_socket = new_sock;
        masterThread.user = &user_num;
        masterThread.ssl = ssl;
        if( pthread_create( &sniffer_thread , NULL ,  connection_handler , &masterThread) < 0){
            perror("Could not create thread");
            return 1;
        }
        puts("Handel user with thread");
    }
    if (new_socket<0){
        perror("Failed");
        return 1;
    }
    return 0;
}

