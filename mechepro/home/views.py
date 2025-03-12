from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from .models import Utilisateur
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.utils.dateparse import parse_date



# Create your views here.

def connexion(request):
    if request.method == 'POST':
        nom_utilisateur = request.POST['nom_utilisateur']
        mot_de_passe = request.POST['mot_de_passe']
        utilisateur = authenticate(request, username=nom_utilisateur, password=mot_de_passe)

        if utilisateur is not None:
            login(request, utilisateur)
            messages.success(request, "Connexion réussie!")
            return redirect('')  # Remplace par le nom de la page d'accueil

    return render(request, 'home.html')

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
        try:
            nom_utilisateur = request.POST.get('nom_utilisateur')
            mot_de_passe = request.POST.get('mot_de_passe')
            adresse_courriel = request.POST.get('adresse_courriel')
            prenom = request.POST.get('prenom')
            nom = request.POST.get('nom')
            numero_telephone = request.POST.get('numero_telephone')
            date_de_naissance = request.POST.get('date_de_naissance')

            # Hachage du mot de passe
            mot_de_passe_hashed = make_password(mot_de_passe)

            # Conversion de la date si fournie
            date_de_naissance = parse_date(date_de_naissance) if date_de_naissance else None

            print("TESTTTTTT")
            # Vérification de l'existence de l'utilisateur
            if Utilisateur.check(nom_utilisateur=nom_utilisateur):
                messages.error(request, "Un utilisateur avec ce nom d'utilisateur existe déjà.")
                print("TESTTTTTT existe")
            else:
                print("creation")
                # Création de l'utilisateur
                utilisateur = Utilisateur(
                    nom_utilisateur=nom_utilisateur,
                    mot_de_passe=mot_de_passe_hashed,
                    adresse_courriel=adresse_courriel,
                    prenom=prenom,
                    nom=nom,
                    numero_telephone=numero_telephone,
                    date_de_naissance=date_de_naissance
                )
                utilisateur.save()
                messages.success(request, "Utilisateur enregistré avec succès.")

        except Exception as e:
            messages.error(request, f"Erreur lors de l'inscription : {e}")

    return render(request, 'inscription.html')