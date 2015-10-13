all: install run

run:
	cat cert.pem
	cat key.pem
	./server
install: server.c server.h
	gcc -w server.c  -lpthread -o server -lssl -lcrypto
clean:
	rm server
