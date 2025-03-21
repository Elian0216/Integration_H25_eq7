from django.db import models
from django.contrib.auth.models import User

from djongo.models import CheckConstraint, Q
from djongo import models


# Create your models here.


class Utilisateur(models.Model):
    utilisateur = models.OneToOneField(User, on_delete=models.CASCADE)
    nom_utilisateur = models.CharField(max_length=10, unique=True)
    mot_de_passe = models.CharField(max_length=10)
    adresse_courriel = models.EmailField(unique=True)
    prenom = models.CharField(max_length=10)
    nom = models.CharField(max_length=10)
    numero_telephone = models.CharField(max_length=10)
    date_de_naissance = models.DateField(null=True)

    def __str__(self):
         return f"{self.nom_utilisateur}"
    



class Adresse(models.Model):
    rue = models.CharField(max_length=10)
    ville = models.CharField(max_length=10)
    code_zip = models.CharField(max_length=10)
    pays = models.CharField(max_length=10)
    utilisateur = models.OneToOneField(
        Utilisateur, on_delete=models.CASCADE, primary_key=True)
