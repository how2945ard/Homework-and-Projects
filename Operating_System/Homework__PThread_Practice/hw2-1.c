#include <pthread.h>
#include <stdio.h>

 /* this data is shared by the thread(s) */
int average;
int maximum;
int minimum;
int num;
void *averageF(void *argv){
   int i = 1;
   int in = 0;
   char** ch;
   for(i;i < num;i++){
      ch = (char**)argv;// type casting
      in = atoi(ch[i]);// type casting
      average += in; //computing average
   }
   average /= num-1;
}
void *maximumF(void *argv){
   int i = 1;
   maximum = 0;
   int in = 0;
   char** ch;
   for(i;i < num;i++){
      ch = (char**)argv; //type casting
      in = atoi(ch[i]); //type casting
      if(in>maximum){
         maximum = in; // computing max
      }
   }
}
void *minimumF(void *argv){
   int i = 1;
   minimum = 0;
   int in = 0;
   char** ch;
   for(i;i < num;i++){
      ch = (char**)argv; //type casting
      in = atoi(ch[i]); //type casting
      if(i == 1){
         minimum = in; // init min
      }
      if(in<minimum){
         minimum = in; // computing min
      }
   }
}
 /* the thread */

int main(int argc, char *argv[])
{
   num = argc;
   pthread_t tid;       /* the thread identifier */
   pthread_attr_t attr; /* set of attributes for the thread */

   /* get the default attributes */
   pthread_attr_init(&attr);

   /* create the thread */
   pthread_create(&tid,&attr,averageF,(void *)argv); // creating thread
   pthread_join(tid,NULL);//wait for thread to end
   pthread_create(&tid,&attr,maximumF,(void *)argv); // creating thread
   pthread_join(tid,NULL);//wait for thread to end
   pthread_create(&tid,&attr,minimumF,(void *)argv); // creating thread
   pthread_join(tid,NULL);//wait for thread to end
   /* now wait for the thread to exit */
   printf("average = %d\n",average);//printing output
   printf("maximum = %d\n",maximum);//printing output
   printf("minimum = %d\n",minimum);//printing output
}