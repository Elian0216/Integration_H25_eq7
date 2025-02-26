from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def calculate():
    x = 1
    y = 2
    return x


def see_user(request):
    x = calculate()
    return render(request, 'user_page.html', {'name': 'Valère Bardon'})

def see_home(request):
    return render(request, 'home.html')
