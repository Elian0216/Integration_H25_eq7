from django.urls import path
from . import views

# URL Configuration for the home app
urlpatterns = [
    path('user/', views.see_user, name='user'),
    path('', views.see_home, name='home')
]
