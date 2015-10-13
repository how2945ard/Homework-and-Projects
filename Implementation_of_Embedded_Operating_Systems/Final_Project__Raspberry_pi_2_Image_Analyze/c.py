# import cv2
# import numpy as np
# from matplotlib import pyplot as plt

# img = cv2.imread('image2.png',0)

# # fft to convert the image to freq domain 
# f = np.fft.fft2(img)

# # shift the center
# fshift = np.fft.fftshift(f)

# rows, cols = img.shape
# crow,ccol = rows/2 , cols/2

# # remove the low frequencies by masking with a rectangular window of size 60x60
# # High Pass Filter (HPF)
# fshift[crow-30:crow+30, ccol-30:ccol+30] = 0

# # shift back (we shifted the center before)
# f_ishift = np.fft.ifftshift(fshift)

# # inverse fft to get the image back 
# img_back = np.fft.ifft2(f_ishift)

# img_back = np.abs(img_back)

# plt.subplot(131),plt.imshow(img, cmap = 'gray')
# plt.title('Input Image'), plt.xticks([]), plt.yticks([])
# plt.subplot(132),plt.imshow(img_back, cmap = 'gray')
# plt.title('Image after HPF'), plt.xticks([]), plt.yticks([])
# plt.subplot(133),plt.imshow(img_back)
# plt.title('Fianl Result'), plt.xticks([]), plt.yticks([])

# plt.show()




# import the necessary packages
import numpy as np
import argparse
import glob
import cv2
 
def auto_canny(image, sigma=0.33):
  # compute the median of the single channel pixel intensities
  v = np.median(image)
 
  # apply automatic Canny edge detection using the computed median
  lower = int(max(0, (1.0 - sigma) * v))
  upper = int(min(255, (1.0 + sigma) * v))
  edged = cv2.Canny(image, lower, upper)
 
  # return the edged image
  return edged

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--images", required=True,
  help="path to input dataset of images")
args = vars(ap.parse_args())
 
# loop over the images
for imagePath in glob.glob(args["images"] + "/*.png"):
  # load the image, convert it to grayscale, and blur it slightly
  image = cv2.imread(imagePath)
  gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
  blurred = cv2.GaussianBlur(gray, (3, 3), 0)
 
  # apply Canny edge detection using a wide threshold, tight
  # threshold, and automatically determined threshold
  wide = cv2.Canny(blurred, 10, 200)
  tight = cv2.Canny(blurred, 225, 250)
  auto = auto_canny(blurred)
 
  # show the images
  cv2.imshow("Original", image)
  cv2.imshow("Edges", np.hstack([wide, tight, auto]))
  cv2.waitKey(0)