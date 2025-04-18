class Fractale():
    def __init__(self, date, montant, est_max=True):
        self.date=date
        self.montant=montant
        self.est_max=est_max


    def __str__(self):
        return f"{self.date} à {self.montant}$ {self.est_max}"