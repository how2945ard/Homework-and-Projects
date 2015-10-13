#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
int main(int argc, char *argv[]){
  int a = 0;
  while( a == 0 ){
    printf("%p\n", &a);
    printf("%d\n", a);
    sleep(2);
  }
  printf("%s\n", "OUT!");
  return 0;
};
