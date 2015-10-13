all: install run

run:
	cat cert.pem
	cat key.pem
	./client $(name)
install: client.c client.h
	gcc -w client.c  -lpthread -o client -lssl -lcrypto
clean:
	rm client
