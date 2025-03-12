from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from .models import Utilisateur

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


def inscrire_utilisateur(request):
    if request.method == "POST":
        nom_utilisateur = request.POST.get('nom_utilisateur')
        mot_de_passe = request.POST.get('mot_de_passe')
        adresse_courriel = request.POST.get('adresse_courriel')
        prenom = request.POST.get('prenom')
        nom = request.POST.get('nom')
        numero_telephone = request.POST.get('numero_telephone')
        date_de_naissance = request.POST.get('date_de_naissance')
 
        mot_de_passe_hashed = make_password(mot_de_passe)
        Utilisateur.objects.create(
            nom_utilisateur=nom_utilisateur,
            mot_de_passe=mot_de_passe_hashed,
            adresse_courriel=adresse_courriel,
            prenom=prenom,
            nom=nom,
            numero_telephone=numero_telephone,
            date_de_naissance=date_de_naissance
        )
        print(numero_telephone)
        exists = Utilisateur.objects.filter(prenom="prenom").exists()
        print(exists)
    return render(request, 'home.html')  
