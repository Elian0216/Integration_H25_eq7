from django.db import models
from django.contrib.auth.models import User

from djongo.models import CheckConstraint, Q
from djongo import models


# Create your models here.


class Utilisateur(models.Model):
    utilisateur = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    numero_telephone = models.CharField(max_length=10)
    date_de_naissance = models.DateField(null=True)
    #favoris=models.

    def __str__(self):
         return f"{self.utilisateur}"
    



class Adresse(models.Model):
    rue = models.CharField(max_length=10)
    ville = models.CharField(max_length=10)
    code_zip = models.CharField(max_length=10)
    pays = models.CharField(max_length=10)
    utilisateur = models.OneToOneField(
        Utilisateur, on_delete=models.CASCADE, primary_key=True)
