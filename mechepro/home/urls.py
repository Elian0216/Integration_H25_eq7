from django.urls import path
from . import views
from .views import connexion

# URL Configuration for the home app
urlpatterns = [
    path('user/', views.see_user, name='user'),
    path('', views.see_home, name='home'),
    path('inscription/', views.see_inscription, name='inscription'),
    path('about/', views.see_a_propos, name='about'),
    path('connect/', views.see_connexion, name='connect'),
    path('connexion/', connexion, name='connexion'),
    path('creerinscription/', views.inscrire_utilisateur, name='inscrire_utilisateur'),
    path('graphique/', views.afficher_graphique, name='graphique'),
]
