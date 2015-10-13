#include <stdio.h>
#include <string.h>    //strlen
#include <stdlib.h>    //strlen
#include <sys/socket.h>
#include <arpa/inet.h> //inet_addr
#include <unistd.h>    //write
#include <pthread.h> //for threading , link with lpthread
#include <stdbool.h>
#include <errno.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <resolv.h>
#include <openssl/ssl.h>
#include <openssl/err.h>

struct ThreadData{
    int* new_socket;
    struct User* users;
    int* user;
    SSL* ssl;
};

struct User{
    char* name;
    char* ip;
    char* port;
    char* info;
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


void LoadCertificates(SSL_CTX* ctx, char* CertFile, char* KeyFile){
    // if (SSL_CTX_load_verify_locations(ctx, CertFile, KeyFile) != 1){
    //     ERR_print_errors_fp(stderr);
    // }
    // if (SSL_CTX_set_default_verify_paths(ctx) != 1){
    //     ERR_print_errors_fp(stderr);
    // }
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
    // SSL_CTX_set_verify(ctx, SSL_VERIFY_PEER | SSL_VERIFY_FAIL_IF_NO_PEER_CERT, NULL);
    // SSL_CTX_set_verify_depth(ctx, 4);
}

char* findUser(struct User* user_data,char* userName,int userNum){
    int i = 0;
    while(i < userNum){
        puts(user_data[i].name);
        if(strncmp(user_data[i].name,userName,sizeof(userName))==0&&sizeof(userName)==sizeof(user_data[i].name)){
            char result[2000];
            sprintf(result, "%d", i);
            return result;
        }
        i++;
    }
    char* false_string = "false";
    return false_string;
}

char* checkUser(struct User* user_data,char* userName,int userNum,char* port){
    int i = 0;
    while(i < userNum){
        puts(user_data[i].name);
        if(strncmp(user_data[i].port,port,sizeof(port))==0&&strncmp(user_data[i].name,userName,sizeof(userName))==0&&sizeof(userName)==sizeof(user_data[i].name)&&sizeof(port)==sizeof(user_data[i].port)){
            char* true_string = "true";
            return true_string;
        }
        i++;
    }
    char* false_string = "false";
    return false_string;
}


char* get_list(struct User* user_data,int num){
    char list[20000];
    strcpy(list, "");
    int i =0;
    while(i < num){
        strcat(list,user_data[i].info);
        strcat(list,"\r\n");
        i++;
    }
    return list;
}
void chop(char* string){
    int i, len;
    len = strlen(string);
    char* ptr;
    for(i = 0; i < len-1; i++){
        if( (ptr = strchr(string, '\n')) != NULL){
            *ptr = '\0';
            puts(string);
        }
    }
}
void set_user(struct User* setee, struct User* seter){
    setee->name = malloc (strlen(seter->name)*sizeof(char));
    setee->ip = malloc (strlen(seter->ip)*sizeof(char));
    setee->port = malloc (strlen(seter->port)*sizeof(char));
    setee->info = malloc (strlen(seter->info)*sizeof(char));
    strcpy(setee->name,seter->name);
    strcpy(setee->ip,seter->ip);
    strcpy(setee->port,seter->port);
    strcpy(setee->info,seter->info);
}
void set_user_by_value(struct User* setee, char* name, char* ip, char* port, char* info){
    setee->name = malloc (strlen(name)*sizeof(char));
    setee->ip = malloc (strlen(ip)*sizeof(char));
    setee->port = malloc (strlen(port)*sizeof(char));
    setee->info = malloc (strlen(info)*sizeof(char));
    strcpy(setee->name,name);
    strcpy(setee->ip,ip);
    strcpy(setee->port,port);
    strcpy(setee->info,info);
}

void add_user(struct ThreadData* data, char* name, char* ip, char* port,char* info){
    *data->user = *data->user+1;
    int num = *data->user;
    data->users = (struct User*) realloc ( data->users,(num)* sizeof(struct User));
    set_user_by_value(&data->users[num-1],name,ip,port,info);
}

void remove_user(struct ThreadData* data, int index){
    if(*data->user > 0){
        *data->user = *data->user-1;
        int num = *data->user;
        struct User* users = (struct User*) malloc(num * sizeof(struct User));
        int i = 0;
        while(i<num){
            if(i<index){
                set_user(&users[i],&data->users[i]);
            }else{
                set_user(&users[i],&data->users[i+1]);
            }
            i+=1;
        }
        free(data->users);
        data->users = users;
    }
}
void* connection_handler(void* handlerThread){
    struct ThreadData* thread = handlerThread;
    int sock = *(int*)thread->new_socket;
    int* sock_prt = (int*)thread->new_socket;
    int read_size;
    SSL* ssl = (SSL*)thread->ssl;
    struct sockaddr_in addr;
    int length = sizeof(addr);
    char CURRENTUSER[200];
    int sd, bytes;
    strcpy(CURRENTUSER, "NO_A_NAME");
    if (getpeername(sock, (struct sockaddr*) &addr,(socklen_t*) &length) < 0) {
        puts("ERROR");
        return 1;
    }
    else {
        printf("Address: %s, port: %d\n", inet_ntoa(addr.sin_addr), ntohs(addr.sin_port));
        char* message , client_message[2000];
        char* de_user = "#";
        char* de_nl = "\r\n";
        char* false_string = "false";
        char* true_string = "true";
        if ( SSL_accept(ssl) == -1 ){    
            ERR_print_errors_fp(stderr);
        }
        else{
            ShowCerts(ssl);
        }
        while( (read_size = SSL_read(ssl , client_message , 2000)) > 0 ){
            if(strncmp("REGISTER#",client_message,9)==0){
                strtok(client_message,de_user);
                char* name =  strtok(NULL,de_user);
                name =  strtok(name,de_nl);
                char ip[20];
                strcpy(ip, inet_ntoa(addr.sin_addr));
                char port[10];
                sprintf(port, "%d", ntohs(addr.sin_port));
                char info[200];
                strcpy(info, name);
                strcpy(CURRENTUSER, name);
                strcat(info, "#");
                strcat(info, ip);
                strcat(info, "#");
                strcat(info, port);
                if(strncmp(findUser(thread->users,name,*thread->user),false_string,5)==0){
                    add_user(thread,name,ip,port,info);
                    SSL_write(ssl,"100 OK\r\n" , strlen("100 OK\r\n"));
                }else{
                    SSL_write(ssl,"210 FAIL\r\n" , strlen("210 FAIL\r\n"));
                }
            }else if(strncmp("List",client_message,4)==0){
                char list[2000];
                char number[20];
                sprintf(number, "%d",*thread->user );
                strcpy(list, number);
                strcat(list, "\r\n");
                strcat(list,get_list(thread->users,*thread->user));
                SSL_write(ssl,list , strlen(list));
            }else if(strncmp("Bye",client_message,3)==0){
                SSL_write(ssl,"Bye\r\n" , strlen("Bye\r\n"));
                puts("GOODBYE");
                memset(client_message, 0, sizeof(client_message));
                break;
            }else{
                char* name = strtok(client_message,de_user);
                char* port = strtok(NULL,de_user);
                name =  strtok(name,de_nl);
                port =  strtok(port,de_nl);
                if(name!=NULL&&port!=NULL&&strncmp(checkUser(thread->users,name,*thread->user,port),true_string,4)==0){
                    char list[2000];
                    char number[10];
                    sprintf(number, "%d",*thread->user );
                    strcpy(list, number);
                    strcat(list, "\r\n");
                    strcat(list,get_list(thread->users,*thread->user));
                    SSL_write(ssl,list , strlen(list));
                }
                else{
                    SSL_write(ssl,"220 AUTH_FAIL\r\n" , strlen("220 AUTH_FAIL\r\n"));
                }
            }
            memset(client_message, 0, sizeof(client_message));
        }
    }
    if(strncmp(CURRENTUSER,"NO_A_NAME",9)!=0){
        int index =0;
        char* user_ptr = CURRENTUSER;
        char* false_string = "false";
        if(strncmp(findUser(thread->users,user_ptr,*thread->user),false_string,5)!=0){
            sscanf(findUser(thread->users,user_ptr,*thread->user), "%d", &index);
            remove_user(thread,index);
        }
    }
    sd = SSL_get_fd(ssl);      
    SSL_free(ssl);        
    close(sd);         
    free(sock_prt);
    puts("Client disconnected");
    if(read_size == -1){
        perror("recv failed");
    }
    return 0;
}
