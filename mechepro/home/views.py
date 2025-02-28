from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def see_user(request):
    return render(request, 'user_page.html', {'name': 'Valère Bardon'})


def see_home(request):
    return render(request, 'home.html')


def see_inscription(request):
    return render(request, 'inscription.html')


def see_a_propos(resquest):
    return render(resquest, 'a_propos.html')

def see_connexion(request):
    return render(request, 'connexion.html')