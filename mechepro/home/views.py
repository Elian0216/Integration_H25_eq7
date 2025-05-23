from django.views.decorators.csrf import ensure_csrf_cookie
import json

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import Utilisateur
from django.utils import timezone
from django.contrib import messages

from django.shortcuts import render
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, get_token

import json

from .analyseFinanciere.alpha_vantage import *
from .analyseFinanciere.graphique import generer_graphique
from .analyseFinanciere.yahooFinance import get_donnees_stock


@ensure_csrf_cookie
def connexion(request):
    """
    Gère la connexion des utilisateurs.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si la connexion a réussi ou échoué.
    """
    if request.method == 'POST':
        nom_utilisateur = request.POST['nom_utilisateur']
        mot_de_passe = request.POST['mot_de_passe']
        utilisateur = authenticate(
            request, username=nom_utilisateur, password=mot_de_passe)

        if utilisateur is not None:
            login(request, utilisateur)
            return JsonResponse({
                "message": "Connexion réussie",
                "username": nom_utilisateur,
                "bool": True
            })
        else:
            return JsonResponse({
                "message": "Échec de la connexion",
                "bool": False
            })
    else:
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
    """
    Inscrit un nouvel utilisateur.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si l'inscription a réussi ou échoué.
    """
    if request.method != "POST":
        return
    try:
        nom_utilisateur = request.POST['nom_utilisateur']
        mot_de_passe = request.POST['mot_de_passe']
        adresse_courriel = request.POST['adresse_courriel']
        prenom = request.POST['prenom']
        nom = request.POST['nom']
        numero_telephone = request.POST['numero_telephone']
        date_de_naissance = request.POST['date_naissance']

        # Vérification de l'existence de l'utilisateur
        if Utilisateur.check(nom_utilisateur=nom_utilisateur) or User.objects.filter(username=nom_utilisateur):
            messages.error(
                request, "Un utilisateur avec ce nom d'utilisateur existe déjà.")
            return JsonResponse({
                "message": "Un utilisateur avec ce nom d'utilisateur existe déjà.",
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
    """
    Génère un graphique boursier.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Les données JSON pour le graphique.
    """
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
    """
    Teste l'API.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message de succès.
    """
    data = {"message": "Test réussi !"}
    return JsonResponse(data)


@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Récupère le token CSRF.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Le token CSRF.
    """
    token = get_token(request)
    return JsonResponse({"detail": "CSRF token a été généré !"})


@ensure_csrf_cookie
def is_auth(request):
    """
    Vérifie si l'utilisateur est authentifié.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si l'utilisateur est authentifié.
    """
    if request.user.is_authenticated:
        username = request.user.username
        return JsonResponse({"message": f"L'utilisateur ({username}) est auth", "bool": True})
    else:
        return JsonResponse({"message": "L'utilisatateur n'est pas auth", "bool": False})


@ensure_csrf_cookie
@login_required
def deconnexion(request):
    """
    Déconnecte l'utilisateur.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si la déconnexion a réussi.
    """
    try:
        logout(request)
        return JsonResponse({"message": "Deconnexion reussie"})
    except Exception as e:
        return JsonResponse({"message": "Une erreur s'est produite lors de la deconnexion"})


@ensure_csrf_cookie
@login_required
def obtenir_favoris(request):
    """
    Obtient les favoris de l'utilisateur.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: La liste des tickers favoris.
    """
    try:
        utilisateur = Utilisateur.objects.get(utilisateur=request.user)
        # Supposons que 'favoris' est un champ List ou JSONField
        tickers = utilisateur.obtenir_favoris()  # ex: ['AAPL', 'GOOG']
        return JsonResponse({"tickersFavoris": tickers}, status=200)
    except Exception as e:
        return JsonResponse({
            "message": f"Erreur lors de l'obtention des favoris: {str(e)}"
        }, status=500)


@ensure_csrf_cookie
@login_required
def ajouter_favoris(request):
    """
    Ajoute un ticker aux favoris de l'utilisateur.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si l'ajout a réussi.
    """
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
            return JsonResponse({
                "message": f"Erreur lors de l'ajout des favoris: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({"message": "Mauvais type d'appel"}, status=400)


@ensure_csrf_cookie
@login_required
def enlever_favoris(request):
    """
    Enlève un ticker des favoris de l'utilisateur.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si la suppression a réussi.
    """
    if request.method == 'POST':
        try:
            ticker = request.POST.get('ticker')
            utilisateur = Utilisateur.objects.get(utilisateur=request.user)

            # Vérifier si le ticker est dans les favoris
            if utilisateur.est_favoris(ticker):
                # Enlever le ticker des favoris
                utilisateur.enlever_favoris(ticker)
                utilisateur.save()
                return JsonResponse({"message": "Ticker enlevé des favoris"}, status=200)
            else:
                return JsonResponse({"message": "Ticker non trouvé dans les favoris"}, status=400)
        except Exception as e:
            return JsonResponse({
                "message": f"Erreur lors de l'enlèvement des favoris: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({"message": "Mauvais type d'appel"}, status=400)


@ensure_csrf_cookie
@login_required
def est_favori(request):
    """
    Vérifie si un ticker est dans les favoris de l'utilisateur.

    Args:
        request (HttpRequest): L'objet requête HTTP.

    Returns:
        JsonResponse: Un message indiquant si le ticker est favori.
    """
    if request.method == 'POST':
        try:
            ticker = request.POST.get('ticker')
            utilisateur = Utilisateur.objects.get(utilisateur=request.user)

            # Vérifier si le ticker est dans les favoris
            if utilisateur.est_favoris(ticker):
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
