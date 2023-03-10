# -*- coding: utf-8 -*-
"""sample working model siamese network.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1NUXiz0W1iMFFrdI2HauzCeH916LRDJYp
"""
import sys
input =sys.argv[1]
print("python output")
print("--------------")
folder_path="../uploads/user"
img_path=folder_path+"/"+input
print(img_path)
sys.stdout.flush()



# importing the zipfile module
from zipfile import ZipFile




# loading the temp.zip and creating a zip object
# with ZipFile("model_trained_on_LFW.zip", 'r') as zObject:

# 	# Extracting all the members of the zip
# 	# into a specific location.
# 	zObject.extractall(
# 		path="./extracted")

from tensorflow import keras

loaded_model = keras.models.load_model('model_trained_on_LFW')

from skimage.transform import resize

def resize_face(data):
  # Set proportional height so its half its size
  height = 62
  width = 47

  # Resize using the calculated proportional height and width
  image_resized = resize(data, (height, width),
                        anti_aliasing=True)

  # Show the original and resized image
  return image_resized

import cv2
import matplotlib.pyplot as plt

Faces = []

def return_faces(path):
  
  imagePath = path

  image = cv2.imread(imagePath)
  gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

  faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
  faces = faceCascade.detectMultiScale(
      gray,
      scaleFactor=1.3,
      minNeighbors=3,
      minSize=(20, 20)
  )

  print("[INFO] Found {0} Faces.".format(len(faces)))

  for (x, y, w, h) in faces:
      # cv2.rectangle(image, (x, y), (x + w, y + h), (255, 255, 255), 2)
      roi_color = image[y:y + h, x:x + w]
      # plt.imshow(roi_color)
      print("Resizing found faces!")
      resized_face = resize_face(roi_color)
      print("Appending faces to faces list!!")
      Faces.append(resized_face)

while Faces:
  Faces.pop()

return_faces('../data/elon_musk.jpg')
return_faces('images/4.jpeg')

len(Faces)

import numpy as np 
img_1 = Faces[0]
img_2 = Faces[1]

from skimage import color

img_1 = color.rgb2gray(img_1)

img_1.shape

img_2 = color.rgb2gray(img_2)

img_2.shape

plt.imshow(img_1)

plt.imshow(img_2)

loaded_model.predict([img_1.reshape(1, 62, 47), 
               img_2.reshape(1, 62, 47)])

