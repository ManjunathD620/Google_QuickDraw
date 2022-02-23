# Google_QuickDraw
 Google Quick Draw implementation in python by using Django framework 
 
 # Flow:
 
* User is instructed to draw a sketch(one from 20 categories).
* User draw's the sketch on website which is sent to server.
* The strokes are converted to image in server.
* The image is fed to model which gives prediction.
* Prediction is sent back to website.
* If the user succeeds in drawing the image then he is given the next image.
* Above steps are executed in a interval of 3 seconds.

# Dataset
The dataset used for training my model could be found at [Quick Draw dataset] https://console.cloud.google.com/storage/browser/quickdraw_dataset/sketchrnn. Here I only picked up 20 files for 20 categories

 # Categories:
 
| | | | |
| :--- | :---: | :---: | :--: |
The Eiffel Tower | Airplane  | Apple  | Axe  
Backpack  | Banana  | Bench  | Bicycle  
Birthday Cake  | Book  | Bucket  | Calendar  
Lollipop  | Camera  | Candle  | Car  
Clock  | Donut  | Eye  | Face  

# Model architecture!
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
