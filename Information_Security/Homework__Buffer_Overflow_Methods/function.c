#include <string.h>
#include <stdio.h>
void foo() {
    char s[4];
    int *ret;
    ret = (int *)(s + 24);
    (*ret) += 21;
}
int main(){
    foo();
    printf("\n\n\nreturned!\n\n\n");
    return 0;
}
void bar() {
    printf("\n\n\nhacked!\n\n\n");
}
