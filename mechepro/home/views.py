from django.views.decorators.csrf import ensure_csrf_cookie
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
from .analyseFinanciere.yahooFinance import get_donnees_stock

# TODO: Question database pourquoi pas tout utilisateur django par defaut

# Create your views here.


@ensure_csrf_cookie
def connexion(request):
    if request.method == 'POST':
        print("--- " + str(request.POST))
        nom_utilisateur = request.POST['nom_utilisateur']
        mot_de_passe = request.POST['mot_de_passe']
        utilisateur = authenticate(
            request, username=nom_utilisateur, password=mot_de_passe)

        if utilisateur is not None:
            print("Connexion réussie!")
            login(request, utilisateur)
            return JsonResponse({
                "message": "Connexion réussie",
                "username": nom_utilisateur,
                "bool": True
            })
            # return redirect('/')
            # return render(request, 'home.html')
        else:
            print("Échec de la connexion.")
            return JsonResponse({
                "message": "Échec de la connexion",
                "bool": False
            })
            # return render(request,"connexion.html",{
            #         "log_in_faux" : True
            #     })
        # return render(request, 'home.html')
    else:
        print("Pas de post")
        return JsonResponse({"message": "Mauvais type d'appel", "bool": False})


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
        "log_in_faux": False
    })


def inscrire_utilisateur(request):
    if request.method != "POST":
        return
    # Conversion de la date si fournie
    # print("Date de naissance avant conversion : ", date_de_naissance)
    # date_de_naissance = parse_date(date_de_naissance) if date_de_naissance else None
    # print("Date de naissance apres conversion : ", date_de_naissance)
    try:
        nom_utilisateur = request.POST['nom_utilisateur']
        mot_de_passe = request.POST['mot_de_passe']
        adresse_courriel = request.POST['adresse_courriel']
        prenom = request.POST['prenom']
        nom = request.POST['nom']
        numero_telephone = request.POST['numero_telephone']
        date_de_naissance = request.POST['date_naissance']

        # Vérification de l'existence de l'utilisateur
        if Utilisateur.check(nom_utilisateur=nom_utilisateur):
            messages.error(
                request, "Un utilisateur avec ce nom d'utilisateur existe déjà.")
            print("L'utilisateur existe")
            return JsonResponse({
                "message": "Un utilisateur avec ce nom d'utilisateur existe déjà.",
                "bool": False
            })

        if User.objects.filter(username=nom_utilisateur):
            messages.error(
                request, "Un utilisateur Django avec ce nom d'utilisateur existe déjà.")
            print("L'utilisateur Django existe")

            return JsonResponse({
                "message": "Un utilisateur Django avec ce nom d'utilisateur existe déjà.",
                "bool": False
            })
         # creation
        usr = User.objects.create_user(
            username=nom_utilisateur,
            password=mot_de_passe,
            email=adresse_courriel,
            first_name=prenom,
            last_name=nom,
            date_joined=timezone.now()
        )

    except Exception as e:
        messages.error(
            request, f"Erreur lors de la création de l'utilisateur Django : {e}")
        return JsonResponse({
            "message": "Erreur lors de la création de l'utilisateur Django",
            "bool": False
        })

    try:
        # Notre modele
        utilisateur = Utilisateur(
            # chaque modele a un objet utilisateur du syteme django, pour l'authentification
            utilisateur=usr,
            numero_telephone=numero_telephone,
            date_de_naissance=date_de_naissance,
            favoris=json.dumps([])
        )
        utilisateur.save()
        messages.success(request, "Utilisateur enregistré avec succès.")
        return JsonResponse({
            "message": "Utilisateur enregistré avec succès.",
            "username": nom_utilisateur,
            "bool": True
        })
    except Exception as e:
        usr.delete()
        messages.error(request, f"Erreur lors de l'inscription : {e}")
    return JsonResponse({
        "message": "Erreur lors de l'inscription",
        "bool": False
    })


def get_graphique(request):
    # return generer_graphique(request)
    # Test avec AAPL
    ticker = request.POST.get("symbol", "AAPL")
    timeframe = request.POST.get("timeframe", "5y")
    interval = request.POST.get("interval", "1d")
    print(ticker)
    stock_data = get_donnees_stock(ticker, timeframe, interval)
    if stock_data['Close'] == []:
        return JsonResponse({"graph_json": None, "bool": False})

    return JsonResponse({"graph_json": generer_graphique(stock_data=stock_data, ticker=ticker), "bool": True})


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
        username = request.user.username
        print("L'utilisateur est auth")
        return JsonResponse({"message": f"L'utilisateur ({username}) est auth", "bool": True})
    else:
        print("L'utilisatateur n'est pas auth")
        return JsonResponse({"message": "L'utilisatateur n'est pas auth", "bool": False})


@ensure_csrf_cookie
@login_required
def deconnexion(request):
    try:
        logout(request)
        return JsonResponse({"message": "Deconnexion reussie"})
    except Exception as e:
        return JsonResponse({"message": "Une erreur s'est produite lors de la deconnexion"})


@ensure_csrf_cookie
@login_required
def obtenir_favoris(request):
    try:
        utilisateur = Utilisateur.objects.get(utilisateur=request.user)
        # Supposons que 'favoris' est un champ List ou JSONField
        tickers = utilisateur.obtenir_favoris()  # ex: ['AAPL', 'GOOG']
        # tickers=utilisateur.obtenir_favoris()
        return JsonResponse({"tickersFavoris": tickers}, status=200)
    except Exception as e:
        print(f"Erreur lors de l'obtention des favoris: {str(e)}")
        return JsonResponse({
            "message": f"Erreur lors de l'obtention des favoris: {str(e)}"
        }, status=500)


@ensure_csrf_cookie
@login_required
def ajouter_favoris(request):
    if request.method == 'POST':
        try:
            ticker = request.POST.get('ticker')
            utilisateur = Utilisateur.objects.get(utilisateur=request.user)
            # Vérifier si le ticker est déjà dans les favoris
            # Ajouter le ticker aux favoris
            utilisateur.ajouter_favoris(ticker)
            utilisateur.save()

            return JsonResponse({"message": "Ticker ajouté aux favoris"}, status=200)
        except Exception as e:
            print(f"Erreur lors de l'ajout des favoris: {str(e)}")
            return JsonResponse({
                "message": f"Erreur lors de l'ajout des favoris: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({"message": "Mauvais type d'appel"}, status=400)


@ensure_csrf_cookie
@login_required
def enlever_favoris(request):
    if request.method == 'POST':
        try:
            ticker = request.POST.get('ticker')
            utilisateur = Utilisateur.objects.get(utilisateur=request.user)

            # Vérifier si le ticker est dans les favoris
            if ticker not in utilisateur.favoris:
                return JsonResponse({"message": "Ticker non trouvé dans les favoris"}, status=400)

            # Enlever le ticker des favoris
            utilisateur.enlever_favoris(ticker)
            utilisateur.save()

            return JsonResponse({"message": "Ticker enlevé des favoris"}, status=200)
        except Exception as e:
            print(f"Erreur lors de l'enlèvement des favoris: {str(e)}")
            return JsonResponse({
                "message": f"Erreur lors de l'enlèvement des favoris: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({"message": "Mauvais type d'appel"}, status=400)


@ensure_csrf_cookie
@login_required
def est_favori(request):
    if request.method == 'POST':
        try:
            ticker = request.POST.get('ticker')
            utilisateur = Utilisateur.objects.get(utilisateur=request.user)

            # Vérifier si le ticker est dans les favoris
            if ticker in utilisateur.favoris:
                return JsonResponse({"message": "Ticker trouvé dans les favoris", "bool": True}, status=200)
            else:
                return JsonResponse({"message": "Ticker non trouvé dans les favoris", "bool": False}, status=400)
        except Exception as e:
            print(f"Erreur lors de la vérification des favoris: {str(e)}")
            return JsonResponse({
                "message": f"Erreur lors de la vérification des favoris: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({"message": "Mauvais type d'appel"}, status=400)


@ensure_csrf_cookie
@login_required
def get_utilisateur(request):
    """
    Renvoie :
    {
      "success": true,
      "utilisateur": {
        "nom_utilisateur": "...",
        "prenom": "...",
        "nom": "...",
        "adresse_courriel": "...",
        "numero_telephone": "...",
        "date_de_naissance": "YYYY-MM-DD"
      }
    }
    """
    try:
        profil = Utilisateur.objects.get(utilisateur=request.user)
        user_data = {
            "nom_utilisateur":   request.user.username,
            "prenom":            request.user.first_name,
            "nom":               request.user.last_name,
            "adresse_courriel":  request.user.email,
            "numero_telephone":  profil.numero_telephone,
            "date_de_naissance": profil.date_de_naissance.isoformat(),
        }
        return JsonResponse({"success": True, "utilisateur": user_data}, status=200)
    except Utilisateur.DoesNotExist:
        return JsonResponse(
            {"success": False, "message": "Profil utilisateur introuvable."},
            status=404
        )
    except Exception as e:
        return JsonResponse(
            {"success": False, "message": str(e)},
            status=500
        )


@ensure_csrf_cookie
@login_required
def changer_mot_de_passe(request):
    """
    Attend un POST avec:
      ancien_mot_de_passe
      mot_de_passe
    Renvoie :
      {"success": True, "message": "..."}  ou
      {"success": False, "message": "..."}
    """
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Mauvais type d'appel"}, status=400)

    ancien = request.POST.get("ancien_mot_de_passe", "")
    nouveau = request.POST.get("mot_de_passe", "")

    try:
        profil = Utilisateur.objects.get(utilisateur=request.user)
        # validation de l'ancien mot de passe
        if not profil.valider_mot_de_passe(ancien):
            return JsonResponse({"success": False, "message": "Ancien mot de passe incorrect"}, status=400)

        # mise à jour du mot de passe dans l'objet User Django
        user = request.user
        user.set_password(nouveau)
        user.save()

        # Re-authentification de l'utilisateur
        user = authenticate(request, username=user.username, password=nouveau)
        if user:
            login(request, user)
        else:
            return JsonResponse({"success": False, "message": "Erreur de ré-authentification"}, status=500)

        return JsonResponse({"success": True, "message": "Mot de passe mis à jour avec succès."}, status=200)
    except Utilisateur.DoesNotExist:
        return JsonResponse({"success": False, "message": "Profil utilisateur introuvable."}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
