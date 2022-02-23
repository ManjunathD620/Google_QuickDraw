# Google_QuickDraw
 Google Quick Draw implementation in python by using Django framework .
 
 # Requirements 
`` pip install -r requirements.txt  ``
* Use this command to install the required dependencies and packages.
# How to work with this project
* Run the requirements command .
* Create Django website by using this command - ``  django-admin startproject <project-name> ``
* Create Django app by using - `` python manage.py startapp <app-name> ``
* Run the Website by using - `` python manage.py runserver ``
* Use `views.py` (Contains important methods for handling data at the back-end ) -``Google_QuickDraw/Google_Quick_Draw_project/Draw/ ``
 # Website architecture :
 
![Screenshot 2022-02-23 140941](https://user-images.githubusercontent.com/82793670/155285566-608e117d-90a6-42a5-9146-1717dcceaf12.png)

 
* User is instructed to draw a sketch(one from 20 categories).
* User draw's the sketch on website which is sent to server.
* The strokes are converted to image in server.
* The image is fed to model which gives prediction.
* Prediction is sent back to website.
* If the user succeeds in drawing the image then he is given the next image.
* Above steps are executed in a interval of 3 seconds.

# Website Output 
* website
![Screenshot (294)](https://user-images.githubusercontent.com/82793670/155290094-5600aba4-d308-4504-bccc-8d5c59ec94d6.png)
* Demo 

https://user-images.githubusercontent.com/82793670/155290847-36b6e28c-26a6-48a2-9834-86cdd1e31c46.mp4

<br><br>




# Dataset
* The dataset used for training my model could be found at [Quick Draw dataset](https://github.com/googlecreativelab/quickdraw-dataset)
*  Here I have used [Simplified drawings files (`` .ndjson ``)](https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/simplified) to reconstruct the dataset .
* I have taken 20K images for each category .

 # Categories:
 
| | | | |
| :--- | :---: | :---: | :--: |
The Eiffel Tower | Airplane  | Apple  | Axe  
Backpack  | Banana  | Bench  | Bicycle  
Birthday Cake  | Book  | Bucket  | Calendar  
Lollipop  | Camera  | Candle  | Car  
Clock  | Donut  | Eye  | Face  

# Model architecture :
![image](https://user-images.githubusercontent.com/82793670/155283217-ddfca957-e989-4581-be0a-422ba2c81e09.png)



* We are using Sequential model to implement CNN.
* This CNN is made up of 12 layers
* First layer is the input layer which takes 28x28x1 as input.
* Then the next 6 layers are alternating Conv2d and Max-pool layers
* Conv2d produce feature maps and max-pool layers reduce the dimensions of   feature maps.
* 8th layer is a dropout layer with a value of 0.1 .
* Drop out layers drop some neurons randomly on every epoch to prevent overfit.
* 9th layer is flatten layer .which converts multi dimensional tensors to 1D array. 
* 10th and  11th layers are Dense layers with 1000 nodes each.
* 12th layer is output layer  which has 20 nodes , to predict 20 classes.

# Result analysis
| 1. The CNN achieved a accuracy of 98.38% and a val_accuracy of 95.21% the training loss was 0.0501 and the val_loss was 0.1930 over 8 epochs . <br><br> <br> 2. The model reached its peak accuracy at epoch 5 then it started to overfit due to which the training process was stopped by the early stopping mechanism. | ![Screenshot 2022-02-23 142548](https://user-images.githubusercontent.com/82793670/155287653-a08f3378-c0a3-4fa3-98f1-9868392730e4.png) |
------------- | -------------

