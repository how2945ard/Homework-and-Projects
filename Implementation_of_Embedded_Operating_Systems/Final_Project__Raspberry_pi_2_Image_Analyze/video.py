# import the necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import sys
import numpy as np
from matplotlib import pyplot as plt

center = (36,14)
width = 10
radious = width / 2

def color(img):

    line_img = img[center[1]][center[0]-radious:center[0]+radious]

    blue_array = []
    green_array = []
    red_array = []

    for pixel in line_img:
      blue_array.append(pixel[0])
      green_array.append(pixel[1])
      red_array.append(pixel[2])
  
    blue = sum(blue_array)/len(blue_array)
    green = sum(green_array)/len(green_array)
    red = sum(red_array)/len(red_array)

    color = ''
    if blue >= green and blue >= red:
      color = ''
    elif green >= blue and green >= red:
      color = '0'
    elif red >= green and red >= blue:
      color = '1'
      
    #cv2.circle(img, center, width/2, (255, 0, 0), 2)
    #cv2.putText(img,color,(100,300), cv2.FONT_HERSHEY_SIMPLEX, 10,(255,255,255), 1, cv2.CV_AA)
    return [color,img]
    
camera = PiCamera()
camera.resolution = (40, 30)
camera.framerate = 30
camera.shutter_speed = 900
rawCapture = PiRGBArray(camera, size=(40, 30))

f=open('output','w')

receive_array = ''
#current_writing = ''

time.sleep(0.1)
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    image = frame.array

    color_str,img = color(image)

    receive_array = receive_array + color_str
    
    if len(receive_array) == 8:
        receive = chr(int(receive_array,2))
        receive_array = ''
        #f.write(receive)
        #current_writing += receive

    sys.stdout.write(receive)
    sys.stdout.flush()
    
    elif color_str == '':
        receive_array = ''
        
    #print('start_blue: %d'%start_blue)        
    #print('start: %s'%start)
    #print('start_string: %s'%string_start)
    #print('buffer: %s'%receive_array)
    #print('current_writing: %s'%current_writing)
    #print('--------')
    
    #cv2.imshow("Frame", img)
    #cv2.waitKey(1) & 0xFF
    rawCapture.truncate(0)