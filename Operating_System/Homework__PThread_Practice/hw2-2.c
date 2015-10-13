#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

int fib; /* this data is shared by the thread(s) */
int* ptr;
void *fibonacci(void *argv){
   char** ch;
   int in;
   ch = (char**)argv; //type casting
   in = atoi(ch[1]); //type casting
   ptr = malloc(in * sizeof(int)); //DMA
   int i=0;
   for(i;i<in;i++){
      if(i==0){
         ptr[i]=0; //init fib[0]
      }
      else if(i==1){
         ptr[i]=1; //init fib[1]
      }
      else{
         ptr[i]=ptr[i-1]+ptr[i-2]; //computing fib[i]
      }
   }
}

 /* the thread */

int main(int argc, char *argv[])
{
   int num = atoi(argv[1]);
   pthread_t tid;       /* the thread identifier */
   pthread_attr_t attr; /* set of attributes for the thread */
   /* get the default attributes */
   pthread_attr_init(&attr);

   /* create the thread */
   pthread_create(&tid,&attr,fibonacci,(void *)argv);
   pthread_join(tid,NULL);
   /* now wait for the thread to exit */
   int i =0;
   for(i;i<num;i++){
      printf("%d ",ptr[i]);
   }//printing out result
   printf("\n");
   free(ptr);//free DMA space
}