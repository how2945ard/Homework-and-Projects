#include <stdio.h>

void function(int a, int b, int c)  
{


char buffer[5];
int *ret;        

    
    ret = (int *)(buffer + 24);
    (*ret) += 7; 
}

int main()
{
     int x = 0; 
     function(1, 2, 3);
     x = 1;
     printf("\n\nx = %i \n\n", x);  
     return 0;  
}
