from django.http.response import HttpResponse
from django.shortcuts import render
from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
import cv2
import numpy as np
from keras.models import load_model
from django.views.decorators.csrf import csrf_exempt
import json

from math import sqrt

img_model = load_model("static/model_95_21.h5")

class reduceStrokeData:

    def distance(self,a, b):
        return  sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)


    def point_line_distance(self,point, start, end):
        if (start == end):
            return self.distance(point, start)
        else:
            n = abs(
                (end[0] - start[0]) * (start[1] - point[1]) -
                (start[0] - point[0]) * (end[1] - start[1])
            )
            d = sqrt(
                (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2
            )
            return n / d


    def rdp(self,points, epsilon):
        """Reduces a series of points to a simplified version that loses detail, but
        maintains the general shape of the series.
        """
        dmax = 0.0
        index = 0
        for i in range(1, len(points) - 1):
            d = self.point_line_distance(points[i], points[0], points[-1])
            if d > dmax:
                index = i
                dmax = d

        if dmax >= epsilon:
            results = self.rdp(points[:index+1], epsilon)[:-1] + self.rdp(points[index:], epsilon)
        else:
            results = [points[0], points[-1]]

        return results

class resultAnalysis:
    def simplyStrokes(self,raw_strokes):
        all_strokes = []
        output_strokes = []
        reduce = reduceStrokeData()

        for k in range(len(raw_strokes)):

            simpleStrokes = []
            tempx = raw_strokes[k][0]
            tempy = raw_strokes[k][1]

            for i in range(len(tempx)):
                simpleStrokes.append((tempx[i],tempy[i]))
                
            all_strokes.append(simpleStrokes)

        for single_stroke in all_strokes:
            temp = reduce.rdp(single_stroke,2.0) 
            output_strokes.append(temp)

        return output_strokes

    def getOuput(self,img_data):

        process = ImageProcessing()

        img_data = json.loads(img_data)
        if(img_data == []):
            return("None")
        simplified_stroke = self.simplyStrokes(img_data)
        image = process.draw_image(simplified_stroke)
        image = process.crop_image(image)
        image.save("static/croped.jpg")
        image = cv2.resize(np.array(image),(28,28),cv2.INTER_AREA)
        test = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
        temp = Image.fromarray(test)
        test = test.astype("float32")/255.0
        test = test.reshape(28,28,1)
        test = np.expand_dims(test,axis=0)
        
        message = process.predictModel(test)

        temp.save("static/Generated_image.jpg")
        return message


class ImageProcessing:

    def __init__(self):
        self.base_path = Path(__file__).resolve().parent.parent

    def crop_image(self,img):
        width,height = img.size
        pixel = img.load()
        rows =[]
        cols =[]

        for i in range(width):
            for j in range(height):
                if(pixel[i,j][2]>0):
                    rows.append(j)
                    cols.append(i)

        row_min = np.array(rows).min()
        row_max = np.array(rows).max()
        col_min = np.array(cols).min()
        col_max = np.array(cols).max()

        border = (col_min,row_min,width-col_max,height-row_max)
        
        newImage = ImageOps.crop(img,border)
        return newImage

    def draw_image(self,stroke):
        img = Image.new("RGB",(812,550))
        draw = ImageDraw.Draw(img)
        for i in range(len(stroke)):
            draw.line(stroke[i],fill="white",width = 16)
        
        img.save(str(self.base_path)+"\\static\Original.jpg")

        return img

    def predictModel(self,test):
        global img_model
        f = open("static/Quick draw set link.txt","r")
        classes = f.readlines()
        prediction = img_model.predict(test)
        index = np.argmax(prediction)
        message = classes[index][1:-9]
        return message

def index(request):
    return render(request,"home.html")

@csrf_exempt
def quickDraw(request):
    result = resultAnalysis()

    if (request.is_ajax()):
        img_data = request.POST.get("stroke")
        k = result.getOuput(img_data)
        return HttpResponse(k)

    else:
        return render(request,"home.html")