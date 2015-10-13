import sys
import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread(sys.argv[1])

brightest_line = 680
center = (650,680)
width = 250
radious = width / 2

line_img = img[brightest_line][center[1]-radious:center[1]+radious]

blue_array = []
green_array = []
red_array = []

for pixel in line_img:
  blue_array.append(pixel[0])
  green_array.append(pixel[1])
  red_array.append(pixel[2])

cv2.circle(img, center, width/2, (255, 0, 0), 2)

blue = sum(blue_array)/len(blue_array)
green = sum(green_array)/len(green_array)
red = sum(red_array)/len(red_array)

color = ''
if blue >= green and blue >= red:
  color = 'blue'
elif green >= blue and green >= red:
  color = 'green'
elif red >= green and red >= blue:
  color = 'red'


cv2.putText(img,color,(100,300), cv2.FONT_HERSHEY_SIMPLEX, 10,(255,255,255), 1, cv2.CV_AA)

cv2.imwrite( "./img.png", img );
