from django.urls import path
from . import views

# URL Configuration for the home app
urlpatterns = [
    path('hello/', views.say_hello),
]
