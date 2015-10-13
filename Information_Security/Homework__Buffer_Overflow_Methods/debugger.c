#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char **argv) {
    char name[64];
    int fd;
    if (argc != 4) {
        fprintf(stderr, "usage: %s pid address value\n", argv[1]);
        return 1;
    }
    sprintf(name, "/proc/%.10s/mem", argv[1]);
    if ((fd = open(name, O_WRONLY)) < 0) {
        fprintf(stderr, "Can't access pid %s", argv[1]);
        perror(":");
        return 1;
    }
    lseek(fd, strtol(argv[2], 0, 0), SEEK_SET);
    if (write(fd, argv[3], strlen(argv[3])) < 0){
      perror("write");
    }
    return 0;
}