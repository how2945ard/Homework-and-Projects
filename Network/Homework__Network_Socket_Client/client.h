#include <stdlib.h>
#include <stdio.h>
#include <string.h>    //strlen
#include <sys/socket.h>
#include <unistd.h>    //write
#include <arpa/inet.h> //inet_addr
#include <sys/socket.h>
#include <stdbool.h>

#include <errno.h>
#include <resolv.h>
#include <netdb.h>
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/types.h>


struct User{
    char* name;
    char* ip;
    char* port;
};

struct ThreadData{
    int* new_socket;
    struct sockaddr_in target;
    SSL* ssl;
};

struct ServerThreadData{
    struct User current_user;
    int* socket_num;
    bool* connected;
};

struct receiverThreadData{
    char* user_name;
    int* socket_num;
    SSL* ssl;
};

struct ClientThreadData{
    struct User current_user;
    struct User* user_data;
    int userNum;
    struct sockaddr_in target;
    int socket;
    char* userName;
};



void ShowCerts(SSL* ssl){
    X509 *cert;
    char *line;
    cert = SSL_get_peer_certificate(ssl);
    if ( cert != NULL ){
        printf("Server certificates:\n");
        line = X509_NAME_oneline(X509_get_subject_name(cert), 0, 0);
        printf("Subject: %s\n", line);
        free(line);
        line = X509_NAME_oneline(X509_get_issuer_name(cert), 0, 0);
        printf("Issuer: %s\n", line);
        free(line);
        X509_free(cert);
    }
    else{
        printf("No certificates.\n");
    }
}

void LoadCertificates(SSL_CTX* ctx, char* CertFile, char* KeyFile){
    if ( SSL_CTX_use_certificate_file(ctx, CertFile, SSL_FILETYPE_PEM) <= 0 ){
        ERR_print_errors_fp(stderr);
        abort();
    }
    if ( SSL_CTX_use_PrivateKey_file(ctx, KeyFile, SSL_FILETYPE_PEM) <= 0 ){
        ERR_print_errors_fp(stderr);
        abort();
    }
    if ( !SSL_CTX_check_private_key(ctx) ){
        fprintf(stderr, "Private key does not match the public certificate\n");
        abort();
    }
}

SSL_CTX* InitServerCTX(void){
    SSL_METHOD *method;
    SSL_CTX *ctx;

    OpenSSL_add_all_algorithms();
    SSL_load_error_strings();
    method = SSLv3_server_method();
    ctx = SSL_CTX_new(method);
    if ( ctx == NULL ){
        ERR_print_errors_fp(stderr);
        abort();
    }
    return ctx;
}


SSL_CTX* InitCTX(void){
    SSL_METHOD *method;
    SSL_CTX *ctx;

    OpenSSL_add_all_algorithms();
    SSL_load_error_strings();
    method = SSLv3_client_method();
    ctx = SSL_CTX_new(method);
    if ( ctx == NULL ){
        ERR_print_errors_fp(stderr);
        abort();
    }
    return ctx;
}

void sendMessageSSL(SSL* ssl ,char message[]){
    SSL_write(ssl, message, strlen(message));
}
char* receiveMessageSSL(SSL* ssl,char server_reply[]){
    SSL_read(ssl, server_reply, 3000);
    puts(server_reply);
    return server_reply;
}
void* senderThread(void* thread_data){
    struct receiverThreadData* thread = (struct receiverThreadData*) thread_data;
    int sock = *thread->socket_num;
    char message[2000];
    SSL* ssl =(SSL*)thread->ssl;
    char* escape = "exit;";
    while(scanf("%s", message)){
        sendMessageSSL(ssl,message);
        if(strncmp(message,escape,sizeof(escape))==0){
            break;
        }
        memset(message, 0, sizeof(message));
    }
    puts("senderThread disconnected");
    return 0;
}
void* receiverThread(void* thread_data){
    struct receiverThreadData* thread = (struct receiverThreadData*) thread_data;
    int sock = *thread->socket_num;
    char* user_name = thread->user_name;
    SSL* ssl =(SSL*)thread->ssl;
    char server_reply[2000];
    int read_size= 0;
    while( read_size= SSL_read(ssl, server_reply , 3000) > 0){
        printf("%s :", user_name );
        puts(server_reply);
        memset(server_reply, 0, sizeof(server_reply));
    }
    if(read_size == 0){
        puts("receiverThread disconnected");
        fflush(stdout);
    }
    else if(read_size == -1)
    {
        perror("recv failed");
    }
    return 0;
}
struct User* getAllUsersInfo(char server_reply[],int* userNum){
    char* de = " \r\n";
    char* token;
    char* de_user = (char*) malloc(10*sizeof(char));
    de_user = "#";
    token = strtok(server_reply,de);
    sscanf(token, "%d", userNum);
    struct User* user_data = (struct User*) malloc (*userNum * sizeof(struct User));
    char** user = (char**) malloc ( *userNum * sizeof(char*));
    int i = 0;
    while( server_reply != NULL && i < *userNum){
        server_reply = strtok(NULL,de);
        user[i] = (char*) malloc ( 200 * sizeof(char));
        strcpy(user[i], server_reply);
        i++;
    }
    i = 0;
    while (i<*userNum) {
        user_data[i].name =  strtok(user[i],de_user);
        user_data[i].ip = strtok(NULL, de_user);
        user_data[i].port = strtok(NULL, de_user);
        i++;
    }
    return user_data;
}
struct User findUser(struct User* user_data,char* userName,int userNum){
    int i = 0;
    while(i < userNum){
        if(strncmp(user_data[i].name,userName,sizeof(userName))==0&&sizeof(userName)==sizeof(user_data[i].name)){
            return user_data[i];
        }
        i++;
    }
    struct User not_found;
    not_found.name = "not_found";
    return not_found;
}

void* listener(void* handlerThread){
    struct ThreadData* thread = (struct ThreadData*) handlerThread;
    int sock = *thread->new_socket;
    int read_size;
    SSL* ssl = (SSL*)thread->ssl;
    char client_message[2000];
    char user_name[2000];
    read_size = SSL_read(ssl , user_name , 2000);
    char* escape = "exit;";
    while( (read_size = SSL_read(ssl , client_message , 2000)) > 0 ){
        if(strncmp(client_message,escape,sizeof(escape))==0){
            read_size= 0;
            puts("Client disconnecting");
            break;
        }
        printf("%s: ",user_name );
        puts(client_message);
        memset(client_message, 0, sizeof(client_message));
    }

    if(read_size == 0){
        puts("listener disconnected");
        fflush(stdout);
    }
    else if(read_size == -1){
        perror("recv failed");
    }
    return 0;
}

void* connection_handler(void* handlerThread){
    struct ThreadData* thread = (struct ThreadData*) handlerThread;
    int sock = *thread->new_socket;
    SSL* ssl = (SSL*)thread->ssl;
    char message[2000];
    char* escape = "exit;";
    while(scanf("%s", message)){
        SSL_write(ssl , message , strlen(message));
        if(strncmp(message,escape,sizeof(escape))==0){
            return 0;
        }
    }
    puts("connection_handler disconnected");
    return 0;
}



void* server_thread(void* thread_data){
    struct ServerThreadData* thread = thread_data;
    int server_sock = 0;
    int c;
    struct sockaddr_in server;
    struct sockaddr_in client;
    char* message;
    int* new_sock;
    bool* connected = (bool*) malloc(sizeof(bool));
    connected = thread->connected;
    int self_port;
    sscanf(thread->current_user.port, "%d", &self_port);
    printf("%d\n", self_port);
    int new_socket;

    SSL_CTX *ctx;
    SSL_library_init();
    ctx = InitServerCTX();
    LoadCertificates(ctx, "cert.pem", "key.pem");

    server_sock = socket(AF_INET , SOCK_STREAM , 0);
    if (server_sock == -1){
        printf("Could not create socket");
    }
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(self_port+1)%65536;
    //Bind
    if( bind(server_sock,(struct sockaddr *)&server , sizeof(server)) < 0){
        puts("Bind failed");
        return 0;
    }
    puts("Bind done");
    listen(server_sock , 3);
    puts("Waiting for incoming connections...");
    c = sizeof(struct sockaddr_in);
    while((new_socket = accept(server_sock, (struct sockaddr *)&client, (socklen_t*)&c)) ){
        *connected = true;
        puts("Connection accepted");

        SSL* ssl;
        ssl = SSL_new(ctx);
        SSL_set_fd(ssl, new_socket);

        if ( SSL_accept(ssl) == -1 ){    
            ERR_print_errors_fp(stderr);
        }
        else{
            ShowCerts(ssl);
        }

        puts("Initiating thread");
        pthread_t handler_thread;
        new_sock = malloc(1);
        *new_sock = new_socket;
        thread->socket_num = &new_socket;
        struct ThreadData masterThread;
        masterThread.new_socket = new_sock;
        masterThread.ssl = ssl;
        if( pthread_create( &handler_thread , NULL ,  connection_handler , &masterThread) < 0){
            perror("Could not create thread");
            return 0;
        }
        puts("Messager set up finished");
        pthread_t listening_thread;
        if( pthread_create( &listening_thread , NULL , listener , &masterThread) < 0){
            perror("Could not create thread");
            return 0;
        }
        puts("Listener set up finished");
        pthread_join( listening_thread , NULL);
        pthread_cancel(handler_thread);
        puts("disconnected");
        break;
    }
    *connected = false;
    puts("client server DISCONNECTED");
    if (new_socket<0){
        perror("Failed");
        return 0;
    }
    return 0;
}




void* client_thread(void* thread_data){
    struct ClientThreadData* thread = thread_data;
    char message[2000];
    char* not_found = "not_found";
    struct User* user_data = thread->user_data;
    struct User current_user = thread->current_user;
    int userNum = thread->userNum;
    struct sockaddr_in target = thread->target;
    int new_socket_desc = thread->socket;
    char* name = thread->userName;
    int target_port;
    SSL_CTX *ctx;
    SSL *ssl;
    SSL_library_init();
    ctx = InitCTX();
    struct User talkingTo = findUser(user_data,name,userNum);
    if(strncmp(talkingTo.name,not_found,sizeof(*not_found))!=0){
        // target.sin_addr.s_addr = inet_addr(talkingTo.ip);
        target.sin_addr.s_addr = inet_addr("127.0.0.1");
        target.sin_family = AF_INET;
        sscanf(talkingTo.port, "%d", &target_port);
        target.sin_port = htons((target_port+1)%65536);
        printf("%s ", "Connecting to");
        printf("%d\n",(target_port+1)%65536 );
        ssl = SSL_new(ctx);
        SSL_set_fd(ssl, new_socket_desc);
        puts(talkingTo.name);
        if (connect(new_socket_desc , (struct sockaddr *)&target , sizeof(target)) < 0){
          puts("connect error");
        }
        if ( SSL_connect(ssl) == -1 ){
            ERR_print_errors_fp(stderr);
        }
        else{
            printf("Connected with %s encryption\n", SSL_get_cipher(ssl));
            ShowCerts(ssl);
        }
        puts("Connected");
        int* new_sock;
        new_sock = malloc(1);
        *new_sock = new_socket_desc;
        struct receiverThreadData data;
        data.socket_num = new_sock;
        data.user_name = talkingTo.name;
        data.ssl = ssl;
        pthread_t receiver_thread;
        if( pthread_create( &receiver_thread , NULL ,  receiverThread , &data) < 0){
            perror("could not create thread");
            return 0;
        }
        char user_name[2000];
        strcpy(user_name, current_user.name);
        sendMessageSSL(ssl,user_name);
        pthread_t sender_thread;
        if( pthread_create( &sender_thread , NULL ,  senderThread , &data) < 0){
            perror("could not create thread");
            return 0;
        }
        pthread_join( sender_thread , NULL);
        pthread_cancel(receiver_thread);
        puts("disconnected");
    }
    return 0;
}
