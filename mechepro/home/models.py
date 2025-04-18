from django.db import models
from django.contrib.auth.models import User

from djongo.models import CheckConstraint, Q
from djongo import models
import json

# Create your models here.


class Utilisateur(models.Model):
    utilisateur = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    numero_telephone = models.CharField(max_length=10)
    date_de_naissance = models.DateField(null=True)
    favoris=models.JSONField(null=True) # un string encodé en JSON
    # Pour convertir json.dumps(liste). Pour désérializer, uilisier json.loads(obj)

    def ajouter_favoris(self, ticker):
        liste_favoris = json.loads(self.favoris) #convertis le JSON en liste avec laquelle nous pouvons travailler
        liste_favoris.append(ticker)
        self.favoris = json.dumps(liste_favoris)

    def enlever_favoris(self, ticker):
        liste_favoris = json.loads(self.favoris)
        liste_favoris.remove(ticker)
        self.favoris = json.dumps(liste_favoris)

    def est_favoris(self, ticker):
        liste_favoris = json.loads(self.favoris)
        if ticker in liste_favoris:
            return True
        else:
            return False

    def __str__(self):
         return f"{self.utilisateur}"
    



class Adresse(models.Model):
    rue = models.CharField(max_length=10)
    ville = models.CharField(max_length=10)
    code_zip = models.CharField(max_length=10)
    pays = models.CharField(max_length=10)
    utilisateur = models.OneToOneField(
        Utilisateur, on_delete=models.CASCADE, primary_key=True)
