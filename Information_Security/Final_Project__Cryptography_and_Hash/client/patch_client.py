#-*- coding: utf-8 -*-
#-*- coding: cp950 -*-　

import socket
from random import randint
import struct
import hashlib
from subprocess import call


def encrypt_RSA(public_key_loc, message):
  # 加密
  from Crypto.PublicKey import RSA
  from Crypto.Cipher import PKCS1_OAEP
  key = open(public_key_loc, "r").read()
  rsakey = RSA.importKey(key)
  rsakey = PKCS1_OAEP.new(rsakey)
  encrypted = rsakey.encrypt(message)
  print "encrypted :"
  print encrypted.encode('base64')
  return encrypted.encode('base64')

def decrypt_RSA(private_key_loc, package):
  # 解密
  from Crypto.PublicKey import RSA
  from Crypto.Cipher import PKCS1_OAEP
  from base64 import b64decode
  key = open(private_key_loc, "r").read()
  rsakey = RSA.importKey(key)
  rsakey = PKCS1_OAEP.new(rsakey)
  decrypted = rsakey.decrypt(b64decode(package))
  print "decrypted :"
  print decrypted
  return decrypted

def sign_data(private_key_loc, data):
  # 簽名
  from Crypto.PublicKey import RSA
  from Crypto.Signature import PKCS1_v1_5
  from Crypto.Hash import SHA256
  from base64 import b64encode, b64decode
  key = open(private_key_loc, "r").read()
  rsakey = RSA.importKey(key)
  signer = PKCS1_v1_5.new(rsakey)
  digest = SHA256.new()
  digest.update(b64decode(data))
  sign = signer.sign(digest)
  print "signed :"
  print b64encode(sign)
  return b64encode(sign)

def verify_sign(public_key_loc, signature, data,base64):
  # 驗證簽名
  from Crypto.PublicKey import RSA
  from Crypto.Signature import PKCS1_v1_5
  from Crypto.Hash import SHA256
  from base64 import b64decode
  pub_key = open(public_key_loc, "r").read()
  rsakey = RSA.importKey(pub_key)
  signer = PKCS1_v1_5.new(rsakey)
  digest = SHA256.new()
  if base64:
    digest.update(b64decode(data))
  else:
    digest.update(data)
  if signer.verify(digest, b64decode(signature)):
      print "Verified"
      return True
  return False

def has_new_patch(message):
  # 是否有新補丁
  return message == "NEW_PATCH"

def send(sock, data):
  # 送出資料
  length = len(data)
  sock.sendall(struct.pack('!I', length))
  sock.sendall(data)

def recv(sock):
  # 接收資料
  lengthbuf = recvall(sock, 4)
  length, = struct.unpack('!I', lengthbuf)
  return recvall(sock, length)

def recvall(sock, count):
  # 用這樣的方式接收資料才不會造成問題
  buf = b''
  while count:
      newbuf = sock.recv(count)
      if not newbuf: return None
      buf += newbuf
      count -= len(newbuf)
  return buf



def fillUpSpace(message,length):
  # 把字串塞塞chr(00)，直到長度為length
  while len(message)<length:
    message = message + chr(00)
  return message

def hash_sha256(message):
  # 把字串做sha256的hash處理
  hash_object = hashlib.sha256(str.encode(message))
  hex_dig = hash_object.hexdigest()
  return(hex_dig)

def dropSpaces(message):
  # 清掉多餘的chr(00)
  return message.split(chr(00))[0]

def getFirstOfString(message,length):
  # 拿到字串的前面length個字元
  return message[:length]

def getData(message,first,last):
  # 拿到字串的從first個字元到last個字元
  return message[first:len(message)-last]

def getLastOfString(message,length):
  # 拿到字串最後length個字元
  return message[-1*length:]



s = socket.socket()
host = socket.gethostname()
port = 5900
s.bind((host, port))

s.listen(5)
while True:
  c, addr = s.accept()
  print 'Got connection from'
  print addr
  raw_input("Press Enter to continue...")
  ip = recv(c)
  recv_message = recv(c)

  a = socket.socket()
  a_host = socket.gethostname()
  a_port = 6000
  a.connect((a_host, a_port))
  send(a,"REQUEST SERVER")
  print "ASKING FOR SERVER INFO FROM CA"
  raw_input("Press Enter to continue...")
  sign = recv(a)
  recv_message = recv(a)
  f = open("server_public.key",'w')
  f.write(recv_message)
  f.close()
  print "Writing: server_public.key as local file"
  raw_input("Press Enter to continue...")
  if verify_sign("authority_public.key",sign,recv_message,False):
    print "Verified: Public Key Authority"
    raw_input("Press Enter to continue...")
    rand = randint(1000,9999)
    encrypted = encrypt_RSA("server_public.key",str(rand))
    print "Verifing: asking server to decrypt encrypted random number"
    raw_input("Press Enter to continue...")
    send(c,encrypted)
    recv_message = recv(c)
    if recv_message == str(rand):
      send(c,"OK")
      print "Verified: server decrypt random number success"
      raw_input("Press Enter to continue...")
      recv_message = recv(c)
      print "Is there a new patch?"
      if has_new_patch(recv_message):
        print "YES"
        message = open("auth.key",'r').read()
        print "THIS IS AUTH KEY:"
        print message
        raw_input("Press Enter to continue...")
        encrypted = encrypt_RSA("server_public.key",message)
        sign = sign_data("client_private.key",encrypted)
        sign = fillUpSpace(sign,1024)
        message = sign + encrypted
        message = message + hash_sha256(message)
        send(c,message)
        recv_message = recv(c)
        sign = dropSpaces(getFirstOfString(recv_message,1024))
        data = getData(recv_message,1024,64)
        trail = getLastOfString(recv_message,64)
        if verify_sign("server_public.key",sign,data,True):
          decrypted = decrypt_RSA("client_private.key",data)
          if decrypted != "not auth":
            f = open("patch.sh","w")
            f.write(decrypted)
            f.close()
            call(["sh","patch.sh"])
          else:
            print "THIS DEVISE IS NOT AUTHED"
            raw_input("Press Enter to continue...")
        c.close()
        a.close()
      else:
        print "NO Patch"
        raw_input("Press Enter to continue...")
        c.close()
        a.close()
  else:
    print "ERROR: Invaild Public Key Authority"
    raw_input("Press Enter to continue...")
    c.close()
    a.close()
print "Ending portocal"
raw_input("Press Enter to continue...")
