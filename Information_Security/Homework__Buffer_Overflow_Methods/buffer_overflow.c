#include <stdio.h>
#include <stdlib.h>
#include <string.h>
void f2(char* buf,char* input){
  strcpy(&buf[8],&input[0]);
  strcpy(&buf[-4],&input[0]);
}
void f1(char* input)
{
  int i;
  char buf[8];
  int j;
  i = 0xaaaaaaaa;
  j = 0xaaaaaaaa;
  printf("i:%0.8x\n", &i);
  printf("j:%0.8x\n", &j);
  printf("i:%0.8x\n", i);
  printf("j:%0.8x\n", j);
  printf("===================\n");  
  f2(buf,input);
  printf("i:%0.8x\n", i);
  printf("j:%0.8x\n", j);
}
int main(int argc, char *argv[]){
  f1(argv[1]);
  return 0;
};
