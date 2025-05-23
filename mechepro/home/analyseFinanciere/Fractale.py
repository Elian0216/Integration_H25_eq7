class Fractale():
    """
    Une fractale est un pic ou un creux dans une cote boursi re.
    C'est une classe qui permet de representer ces pics et creux.

    Attributes:
        date (datetime.date): La date de la fractale.
        montant (float): Le montant de la fractale en $.
        est_max (bool): Vrai si la fractale est un pic, faux si c'est un creux.
    """
    def __init__(self, date, montant, est_max=True):
        self.date=date
        self.montant=montant
        self.est_max=est_max


    def __str__(self):
        return f"{self.date} à {self.montant}$ {self.est_max}"
    
    # La méthode ci-haut est utilisé seulement pour tester dans la console