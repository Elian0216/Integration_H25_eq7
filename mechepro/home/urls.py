from django.urls import path
from . import views

# URL Configuration for the home app
urlpatterns = [
    path('user/', views.see_user, name='user'),
    path('', views.see_home, name='home'),
    
    path('about/', views.see_a_propos, name='about'),
    path('connect/', views.see_connexion, name='connect'),
    
    path('graphique/', views.get_graphique, name='graphique'),

    # APIs
    path('test/', views.test_api, name='test_api'),
    path('csrf/', views.get_csrf_token, name='get_csrf_token'),

    path('connexion/', views.connexion, name='connexion'),
    path('inscription/', views.inscrire_utilisateur, name='inscription'),

    path('is-auth/', views.is_auth, name='is_auth'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('obtenirFavoris/', views.obtenir_favoris, name='obtenir_favoris'),
    path('ajouterFavori/', views.ajouter_favoris, name='ajouter_favoris'),
    path('supprimerFavori/', views.enlever_favoris, name='enlever_favoris'),
    path('estFavori/', views.est_favori, name='est_favori'),
    
    path('changerMotDePasse/', views.changer_mot_de_passe, name='changer_mot_de_passe'),
    path('donneesUtilisateur/', views.get_utilisateur, name='donnees_utilisateur'),
]
