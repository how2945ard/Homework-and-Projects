#-*- coding: utf-8 -*-
#-*- coding: cp950 -*-

import socket
import struct

def upload_file(filename,mode):
  # 開啟檔案
  file_object = open(filename, mode)
  return file_object

def encrypt_RSA(public_key_loc, message):
  # 加密
  from Crypto.PublicKey import RSA
  from Crypto.Cipher import PKCS1_OAEP
  key = open(public_key_loc, "r").read()
  rsakey = RSA.importKey(key)
  rsakey = PKCS1_OAEP.new(rsakey)
  encrypted = rsakey.encrypt(message)
  print "encrypted :"
  print encrypted
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
  digest.update(data)
  sign = signer.sign(digest)
  print "signed :"
  print b64encode(sign)
  return b64encode(sign)

def verify_sign(public_key_loc, signature, data):
  # 驗證簽名
  from Crypto.PublicKey import RSA
  from Crypto.Signature import PKCS1_v1_5
  from Crypto.Hash import SHA256
  from base64 import b64decode
  pub_key = open(public_key_loc, "r").read()
  rsakey = RSA.importKey(pub_key)
  signer = PKCS1_v1_5.new(rsakey)
  digest = SHA256.new()
  digest.update(b64decode(data))
  if signer.verify(digest, b64decode(signature)):
      print "Verified"
      return True
  return False


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


s = socket.socket()
host = socket.gethostname()
port = 6000
s.bind((host, port))

s.listen(5)
while True:
  c, addr = s.accept()
  print 'Got connection from', addr
  recv_message = recv(c)
  if recv_message == "REQUEST SERVER":
    print "asked for server public key"
    raw_input("Press Enter to continue...")
    public_key = upload_file('server_public.key','r')
    key = public_key.read()
    signed_key = sign_data('authority_private.key',key)
    send(c,signed_key)
    send(c,key)
    c.close()
  elif recv_message == "REQUEST CLIENT":
    print "asked for client public key"
    raw_input("Press Enter to continue...")
    public_key = upload_file('client_public.key','r')
    key = public_key.read()
    signed_key = sign_data('authority_private.key',key)
    send(c,signed_key)
    send(c,key)
    c.close()
