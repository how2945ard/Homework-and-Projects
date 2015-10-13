#-*- coding: utf-8 -*-
#-*- coding: cp950 -*-

from random import randint
import socket
import hashlib
import struct

def upload_file(filename,mode):
  # 開啟檔案
  file_object = open(filename, mode)
  return file_object

def is_auth(message):
  # 驗證是否為合格授權碼
  return message == "THIS IS THE AUTH CODE\n"

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

a = socket.socket()
a_host = socket.gethostname()
a_port = 6000
a.connect((a_host, a_port))
send(a,"REQUEST CLIENT")
print "ASKING FOR CLIENT INFO FROM CA"
raw_input("Press Enter to continue...")
sign = recv(a)
recv_message = recv(a)
f = open("client_public.key",'w')
f.write(recv_message)
f.close()
print "Writing: client_public.key as local file"
raw_input("Press Enter to continue...")
if verify_sign("authority_public.key",sign,recv_message,False):
  print "Verified: Public Key Authority"
  raw_input("Press Enter to continue...")
  import netifaces as ni
  def print_dict(d):
        for item in d or []:
            print '\t\t',
            for key, value in item.items():
                print '%s: %s,' % (key, value),
            print ''
  def print_ifaces_data():
    for iface_name in ni.interfaces():
        iface_data = ni.ifaddresses(iface_name)
        print 'Interface: %s' % (iface_name, )
        print '\tMAC Address'
        print_dict(iface_data.get(ni.AF_LINK))
        print '\tIPv4 Address'
        print_dict(iface_data.get(ni.AF_INET))
        print '\tIPv6 Address'
        print_dict(iface_data.get(ni.AF_INET6))
  print_ifaces_data()
  ip = ni.ifaddresses('en0')[2][0]['addr']
  print "local ip:"
  print ip
  raw_input("Press Enter to continue...")
  s = socket.socket()
  host = socket.gethostname()
  port = 5900
  s.connect((host, port))

  encrypted = encrypt_RSA("client_public.key",ip)
  send(s,encrypted)
  rand = randint(1000,9999)
  encrypted = encrypt_RSA("client_public.key",str(rand))
  send(s,encrypted)
  print "sending update server info to client"
  raw_input("Press Enter to continue...")
  recv_message = recv(s)
  decrypted = decrypt_RSA("server_private.key",recv_message)
  print "Asked to decrypt random number"
  raw_input("Press Enter to continue...")
  send(s,decrypted)
  recv_message = recv(s)
  if recv_message == "OK":
    print "challenge success"
    raw_input("Press Enter to continue...")
    message = "NEW_PATCH"
    send(s,message)
    recv_message = recv(s)
    sign = dropSpaces(getFirstOfString(recv_message,1024))
    data = getData(recv_message,1024,64)
    trail = getLastOfString(recv_message,64)
    print "Verifing: client signature"
    raw_input("Press Enter to continue...")
    if verify_sign("client_public.key",sign,data,True) and is_auth(decrypt_RSA("server_private.key",data)):
      print "Verified: vaild client"
      raw_input("Press Enter to continue...")
      message = open("patch.sh",'r').read()
      encrypted = encrypt_RSA("client_public.key",message)
      sign = sign_data("server_private.key",encrypted)
      sign = fillUpSpace(sign,1024)
      message = sign + encrypted
      message = message + hash_sha256(message)
      send(s,message)
      print "sending patch file"
      raw_input("Press Enter to continue...")
      a.close()
      s.close()
    else:
      print "Not Verified: invaild client"
      raw_input("Press Enter to continue...")
      message = "not auth"
      encrypted = encrypt_RSA("client_public.key",message)
      sign = sign_data("server_private.key",encrypted)
      sign = fillUpSpace(sign,1024)
      message = sign + encrypted
      message = message + hash_sha256(message)
      send(s,message)
      a.close()
      s.close()
  else:
    print "challenge failed"
    raw_input("Press Enter to continue...")
else:
  print "ERROR: Invaild Public Key Authority"
  raw_input("Press Enter to continue...")
  a.close()
  s.close()
print "Ending portocal"
raw_input("Press Enter to continue...")
