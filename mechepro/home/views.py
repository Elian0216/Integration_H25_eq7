import json

from django.db.models.functions import datetime

from .analyseFinanciere.alpha_vantage import *
from .analyseFinanciere.graphique import generer_graphique

from django.shortcuts import render, redirect

from django.contrib.auth.hashers import make_password
from .models import Utilisateur
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.utils.dateparse import parse_date

from django.contrib.auth.models import User
import datetime

from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, get_token
import json

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
            return JsonResponse({
                "message": "Connexion réussie",
                "username": nom_utilisateur
            })
            # login(request, utilisateur)
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
            nom_utilisateur = request.POST.get('nom_utilisateur')
            mot_de_passe = request.POST.get('mot_de_passe')
            adresse_courriel = request.POST.get('adresse_courriel')
            prenom = request.POST.get('prenom')
            nom = request.POST.get('nom')
            numero_telephone = request.POST.get('numero_telephone')
            date_de_naissance = request.POST.get('date_de_naissance')

            # Hachage du mot de passe
            #mot_de_passe_hashed = make_password(mot_de_passe)

            # Conversion de la date si fournie
            date_de_naissance = parse_date(date_de_naissance) if date_de_naissance else None

            print("TESTTTTTT")
            # Vérification de l'existence de l'utilisateur
            if Utilisateur.check(nom_utilisateur=nom_utilisateur):
                messages.error(request, "Un utilisateur avec ce nom d'utilisateur existe déjà.")
                print("user existe")
                return render(request, "inscription.html", {
                    "utilisateur_existe": True
                })

            else:
                print("creation")
                # Création de l'utilisateur
                usr= User.objects.create_user(username=nom_utilisateur,password=mot_de_passe, email=adresse_courriel, first_name=prenom, last_name=nom, date_joined=datetime.date.today())
                liste=[] #liste de favoris, initialement vide

                #Notre modele
                utilisateur = Utilisateur(
                    utilisateur = usr,  #chaque modele a un objet utilisateur du syteme django,afin d'utilisier l'authentification)
                    numero_telephone=numero_telephone,
                    date_de_naissance=date_de_naissance,
                    favoris=json.dumps(liste)
                )
                utilisateur.save()
                messages.success(request, "Utilisateur enregistré avec succès.")
                return redirect('connect')
        except Exception as e:

            messages.error(request, f"Erreur lors de l'inscription : {e}")

    return render(request, 'inscription.html')


def afficher_graphique(request):
    return generer_graphique(request)


@csrf_exempt
def test_api(request):
    data = {"message": "Test successful!"}
    return JsonResponse(data)


@ensure_csrf_cookie
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"detail": "Cookie set successfully"})


@ensure_csrf_cookie
def is_auth(request):
    if (request.user.is_authenticated):
        print("User is auth !")
        return JsonResponse({"message": "User is auth !"})
    else:
        print("User is not auth :(")
        return JsonResponse({"message": "User is not auth :("})