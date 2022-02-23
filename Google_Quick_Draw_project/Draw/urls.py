from django.contrib import admin
from django.urls import path
from QuickDraw import views

urlpatterns = [
    path("",views.index,name="Home"),
    path("guess",views.quickDraw,name="submitted")
]
