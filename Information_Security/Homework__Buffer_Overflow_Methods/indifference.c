#include <stdlib.h>
#include <string.h>
int main(int ac, char **av) {
  char VAR_1[8];
  char VAR_2[1];
  printf("&VAR_1: %p\n", &VAR_1);
  printf("&VAR_2: %p\n", &VAR_2);
  return 0;
}