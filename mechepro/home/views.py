from django.shortcuts import render
from django.http import HttpResponse
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
        adress_courriel = request.POST.get('adress_courriel')
        prenom = request.POST.get('prenom')
        nom = request.POST.get('nom')
        numero_telephone = request.POST.get('numero_telephone')
        date_de_naissance = request.POST.get('date_de_naissance')

        Utilisateur.objects.create(
            nom_utilisateur=nom_utilisateur,
            mot_de_passe=mot_de_passe,
            adress_courriel=adress_courriel,
            prenom=prenom,
            nom=nom,
            numero_telephone=numero_telephone,
            date_de_naissance=date_de_naissance
        )

    return render(request, 'home.html')  # Ensure this is properly aligned
