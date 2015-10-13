#include "client.h"

int main(int argc , char *argv[]){
    int socket_desc;
    struct sockaddr_in server;
    char server_reply[2000];
    char userName[200];
    char registerMessage[200];
    char loginMessage[200];
    char loginCode[200];
    char message[200];
    if(argv[1]){
      strcpy(userName, argv[1]);
    }else{
      strcpy(userName, "No_User_Name");
    }
    strcpy(loginMessage, "Login as ");
    strcpy(message, "");
    strcpy(loginCode, "");
    strcpy(registerMessage, "REGISTER#");
    strcat(registerMessage,userName);
    pthread_t listening_thread;
    struct ClientThreadData client_data;
    SSL_CTX *ctx;
    SSL *ssl;
    SSL_library_init();
    ctx = InitCTX();
    LoadCertificates(ctx, "cert.pem", "key.pem");
    socket_desc = socket(AF_INET , SOCK_STREAM , 0);
    if (socket_desc == -1){
        printf("Could not create socket");
    }

    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    //"140.112.107.39"
    server.sin_family = AF_INET;
    server.sin_port = htons( 5900 );


    ssl = SSL_new(ctx);
    SSL_set_fd(ssl, socket_desc);
    if (connect(socket_desc , (struct sockaddr *)&server , sizeof(server)) < 0){
        puts("connect error");
        return 1;
    }
    if ( SSL_connect(ssl) == -1 ){
        ERR_print_errors_fp(stderr);
    }
    else{
        printf("Connected with %s encryption\n", SSL_get_cipher(ssl));
        ShowCerts(ssl);
    }
    puts("Connected");
    sendMessageSSL(ssl,registerMessage);

    char* received = (char*) malloc(2000*sizeof(char));
    received = receiveMessageSSL(ssl,server_reply);
    if(strncmp("210 FAIL",received,3)==0){
      puts("REGISTER FAIL\n");
    }
    else if(strncmp("100 OK\n",received,3)==0){
      sendMessageSSL(ssl,"List\n");
      received = receiveMessageSSL(ssl,server_reply);
      puts(received);
      char* storeRecerve = (char*) malloc(2000*sizeof(char));
      storeRecerve = received;
      int userNum=0;
      char str[15];
      struct User* user_data;
      user_data = getAllUsersInfo(received,&userNum);
      sprintf(str, "%d", userNum);
      puts("Numbers of Current Users:");
      puts(str);
      puts("\nLogin in process");
      struct User current_user = findUser(user_data,userName,userNum);
      char* not_found = (char*) malloc(2000*sizeof(char));
      not_found = "not_found";
      if(strncmp(current_user.name,not_found,9)!=0){
        strcat(loginCode, current_user.name);
        strcat(loginCode, "#");
        strcat(loginCode, current_user.port);
        strcat(loginCode, "\r\n");
        strcat(loginMessage,current_user.name);
        sendMessageSSL(ssl,loginCode);
        received = receiveMessageSSL(ssl,server_reply);
        struct ServerThreadData server_data;
        bool* connected = (bool *)malloc(sizeof(bool));
        *connected = false;
        server_data.current_user = current_user;
        server_data.connected = connected;
        if(pthread_create( &listening_thread , NULL ,  server_thread , &server_data) < 0){
            perror("Could not create thread");
            return 1;
        }
        puts("Server thread created");
        struct sockaddr_in target;
        int new_socket_desc;
        new_socket_desc = socket(AF_INET , SOCK_STREAM , 0);
        if (new_socket_desc == -1){
            printf("Could not create socket");
        }
        while(*connected||scanf("%s", message)){
          if(strncmp("CONNECT#",message,7)==0){
            char* de_user = (char*) malloc(2000*sizeof(char));
            de_user = "#";
            char* temp = (char*) malloc(2000*sizeof(char));
            temp = strtok(message,de_user);
            char* name = (char*) malloc(2000*sizeof(char));
            name = strtok(NULL,de_user);
            client_data.current_user = current_user;
            client_data.userName = name;
            client_data.user_data = user_data;
            client_data.userNum = userNum;
            client_data.target = target;
            client_data.socket = new_socket_desc;
            puts("Client thread created");
            client_thread(&client_data);
          }
          else if(strncmp("exit;",message,4)==0){
            sendMessageSSL(ssl,"Bye\n");
            puts("DISCONNECT");
            break;
          }
          else{
            pthread_join( listening_thread , NULL);
          }
        }
      }
    }
    SSL_free(ssl);
    close(socket_desc);
    SSL_CTX_free(ctx);
    return 0;
  }
