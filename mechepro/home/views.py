import json

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import Utilisateur
from django.db.models.functions import datetime
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.contrib import messages

from django.shortcuts import render, redirect
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, get_token

import json

from .analyseFinanciere.alpha_vantage import *
from .analyseFinanciere.graphique import generer_graphique

# TODO: Question database pourquoi pas tout utilisateur django par defaut

# Create your views here.
@ensure_csrf_cookie
def connexion(request):
    if request.method == 'POST':
        print("--- " + str(request.POST))
        nom_utilisateur = request.POST['nom_utilisateur']
        mot_de_passe = request.POST['mot_de_passe']
        utilisateur = authenticate(request, username=nom_utilisateur, password=mot_de_passe)

        if utilisateur is not None:
            print("Connexion réussie!")
            login(request, utilisateur)
            return JsonResponse({
                "message": "Connexion réussie",
                "username": nom_utilisateur
            })
            # return redirect('/')
            # return render(request, 'home.html')
        else:
            print("Échec de la connexion.")
            return JsonResponse({
                "message": "Échec de la connexion"
            })
            # return render(request,"connexion.html",{
            #         "log_in_faux" : True
            #     })
        #return render(request, 'home.html')
    else:
        print("Pas de post")
        return JsonResponse({"message": "Mauvais type d'appel"})


def see_user(request):
    return render(request, 'user_page.html', {'name': 'Valère Bardon'})


def see_home(request):  
    return render(request, 'home.html')


def see_inscription(request):
    return render(request, 'inscription.html')


def see_a_propos(resquest):
    return render(resquest, 'a_propos.html')

def see_connexion(request):
    return render(request, 'connexion.html', {
        "log_in_faux" : False
    })



def inscrire_utilisateur(request):
    if request.method == "POST":
        try:
            nom_utilisateur = request.POST['nom_utilisateur']
            mot_de_passe = request.POST['mot_de_passe']
            adresse_courriel = request.POST['adresse_courriel']
            prenom = request.POST['prenom']
            nom = request.POST['nom']
            numero_telephone = request.POST['numero_telephone']
            date_de_naissance = request.POST['date_naissance']

            # Hachage du mot de passe
            #mot_de_passe_hashed = make_password(mot_de_passe)

            # Conversion de la date si fournie
            # print("Date de naissance avant conversion : ", date_de_naissance)
            # date_de_naissance = parse_date(date_de_naissance) if date_de_naissance else None
            # print("Date de naissance apres conversion : ", date_de_naissance)

            # Vérification de l'existence de l'utilisateur
            if Utilisateur.check(nom_utilisateur=nom_utilisateur):
                messages.error(request, "Un utilisateur avec ce nom d'utilisateur existe déjà.")
                print("L'utilisateur existe")
                return JsonResponse({
                    "message": "Un utilisateur avec ce nom d'utilisateur existe déjà."
                })
                # return render(request, "inscription.html", {
                #     "utilisateur_existe": True
                # })

            else:
                print("Création de l'utilisateur")
                # Création de l'utilisateur
                try: 
                    usr = User.objects.create_user(username=nom_utilisateur,password=mot_de_passe, email=adresse_courriel, first_name=prenom, last_name=nom, date_joined=timezone.now())
                except Exception as e:
                    messages.error(request, f"Erreur lors de la création de l'utilisateur Django : {e}")
                    print(f"Erreur lors de la création de l'utilisateur Django : {e}")
                    return JsonResponse({
                        "message": "Erreur lors de la création de l'utilisateur Django"
                    })
                
                liste=[] # liste de favoris, initialement vide

                # Notre modele
                utilisateur = Utilisateur(
                    utilisateur = usr,  # chaque modele a un objet utilisateur du syteme django, afin d'utilisier l'authentification)
                    numero_telephone=numero_telephone,
                    date_de_naissance=date_de_naissance,
                    favoris=liste
                )
                utilisateur.save()
                messages.success(request, "Utilisateur enregistré avec succès.")
                return JsonResponse({
                    "message": "Utilisateur enregistré avec succès.",
                    "username": nom_utilisateur
                })
                # return redirect('connect')
        except Exception as e:
            messages.error(request, f"Erreur lors de l'inscription : {e}")
            print(f"Erreur lors de l'inscription : {e}")
            return JsonResponse({
                "message": "Erreur lors de l'inscription"
            })

    # return render(request, 'inscription.html')


def afficher_graphique(request):
    return generer_graphique(request)


@csrf_exempt
def test_api(request):
    data = {"message": "Test réussi !"}
    return JsonResponse(data)


@ensure_csrf_cookie
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"detail": "CSRF token a été généré !"})


@ensure_csrf_cookie
def is_auth(request):
    if (request.user.is_authenticated):
        print("L'utilisateur est auth")
        return JsonResponse({"message": "L'utilisateur est auth"})   
    else:
        print("L'utilisatateur n'est pas auth")
        return JsonResponse({"message": "L'utilisatateur n'est pas auth"})
    
@ensure_csrf_cookie
@login_required
def deconnexion(request):
    try:
        logout(request)
        return JsonResponse({"message": "Deconnexion reussie"})
    except Exception as e:
        return JsonResponse({"message": "Une erreur s'est produite lors de la deconnexion"})