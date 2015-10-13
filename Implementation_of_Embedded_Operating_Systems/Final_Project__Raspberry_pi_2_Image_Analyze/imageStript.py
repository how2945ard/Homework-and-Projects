import sys
import cv2
import numpy as np
from matplotlib import pyplot as plt
low = 40
max = 60
img = cv2.imread(sys.argv[1],cv2.CV_LOAD_IMAGE_GRAYSCALE)


dataImg = []
run = 0
partial = 4
time = 0
data_start = 0
# data_end = len(img[0])
# data_start = len(img[0])*3/4
data_end = len(img[0])
middle = len(img[0])*1/2
text_leng = len(img[0])*1/4


img = cv2.equalizeHist(img)
clahe = cv2.createCLAHE(clipLimit=15.0, tileGridSize=(8,8))
img = clahe.apply(img)

ret,img = cv2.threshold(img,low,max,cv2.THRESH_BINARY)

for array in img:
  dataImg.append(sum(array[data_start:data_end])/len(array[data_start:data_end]))
dataImg_index = 0
line_start = 0
line_end = 0
low = sum(dataImg)/len(dataImg)
for element in dataImg:
  if run == 0 and element < low:
    # cv2.putText(img,"________________", (middle,dataImg_index), cv2.FONT_HERSHEY_SIMPLEX, 2, 255)
    line_start = dataImg_index
  if element < low:
    run += 1
  elif run != 0:
    time += 1
    cv2.putText(img,"height: %d, #%d" % (run,time), (middle-text_leng,dataImg_index), cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255), 1, cv2.CV_AA)
    # cv2.putText(img,"________________", (middle,dataImg_index), cv2.FONT_HERSHEY_SIMPLEX, 2, 255)
    line_end = dataImg_index
    cv2.rectangle(img,(data_start,line_start),(data_end,line_end),(255,0,0),1)
    run = 0
  dataImg_index += 1

# cv2.imshow("drawing", img)
# cv2.waitKey()
cv2.imwrite( "./img.png", img );
print(time)