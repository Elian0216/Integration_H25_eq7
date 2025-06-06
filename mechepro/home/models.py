from django.db import models
from django.contrib.auth.models import User

from djongo.models import CheckConstraint, Q
from djongo import models
import json



class Utilisateur(models.Model):
    utilisateur = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    numero_telephone = models.CharField(max_length=10)
    date_de_naissance = models.DateField(null=True)
    favoris=models.TextField(null=True) # un string encodé en JSON
    # Pour convertir json.dumps(liste). Pour désérializer, uilisier json.loads(obj)
   
    def valider_mot_de_passe(self, mot_de_passe):
        """
        Valide si le mot de passe fourni correspond au mot de passe de l'utilisateur.
        """
        return self.utilisateur.check_password(mot_de_passe)
    
    def obtenir_favoris(self):
        """
        Récupère la liste des favoris de l'utilisateur à partir du champ JSON.
        """
        return json.loads(self.favoris)

    def ajouter_favoris(self, ticker):
        """
        Ajoute un ticker à la liste des favoris de l'utilisateur.

        Args:
            ticker (str): Le ticker à ajouter.
        """
        liste_favoris = self.obtenir_favoris() #convertis le JSON en liste avec laquelle nous pouvons travailler
        if not self.est_favoris(ticker):
            liste_favoris.append(ticker)
            self.favoris = json.dumps(liste_favoris)

    def enlever_favoris(self, ticker):
        """
        Supprime un ticker de la liste des favoris de l'utilisateur.

        Args:
            ticker (str): Le ticker à supprimer.
        """
        liste_favoris = self.obtenir_favoris()
        liste_favoris.remove(ticker)
        self.favoris = json.dumps(liste_favoris)

    def est_favoris(self, ticker):
        """
        Vérifie si un ticker est dans la liste des favoris de l'utilisateur.

        Args:
            ticker (str): Le ticker à vérifier.

        Returns:
            bool: True si le ticker est un favori, False sinon.
        """
        liste_favoris = self.obtenir_favoris()
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
