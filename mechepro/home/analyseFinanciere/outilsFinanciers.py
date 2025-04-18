import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

from home.analyseFinanciere.Fractale import Fractale

from home.analyseFinanciere.yahooFinance import get_donnees_stock


#les paramètres data représentent la sortie de la fonctions get_donnees_stock dans yahooFinance.py
#c'est dans con appel où la période de temps sera définie.
def calculer_RSI(data, period=14):
    # Convertir la liste de dictionnaires en DataFrame
    df = pd.DataFrame(data)

    # Calculer les variations de prix
    df['Delta'] = df['Close'].diff(1)

    # Calculer les gains et les pertes
    df['Gain'] = df['Delta'].where(df['Delta'] > 0, 0)
    df['Perte'] = -df['Delta'].where(df['Delta'] < 0, 0)

    # Calculer les moyennes mobiles des gains et des pertes sur une période de 14 jours
    df['MoyenneGain'] = df['Gain'].rolling(window=period).mean()
    df['MoyennePerte'] = df['Perte'].rolling(window=period).mean()

    # Calculer le RSI
    df['RS'] = df['MoyenneGain'] / df['MoyennePerte']
    df['RSI'] = 100 - (100 / (1 + df['RS']))

    # Afficher et retourner les dernières valeurs du RSI

    # 1253 2025-03-14  20.920586 EXEMPLE D'UNE SORTIE
    return df[['index', 'RSI']]


def calculer_MACD(data, short_period=12, long_period=26, signal_period=9):
    """
    Calculer le MACD et la ligne de signal pour l'analyse boursière.
    """
    # Convertir la liste de dictionnaires en DataFrame
    df = pd.DataFrame(data)

    # Calculer les moyennes mobiles exponentielles (EMA)
    df['EMA_short'] = df['Close'].ewm(span=short_period, adjust=False).mean()
    df['EMA_long'] = df['Close'].ewm(span=long_period, adjust=False).mean()

    # Calculer le MACD
    df['MACD'] = df['EMA_short'] - df['EMA_long']

    # Calculer la ligne de signal
    df['Signal_Line'] = df['MACD'].ewm(span=signal_period, adjust=False).mean()

    # Afficher et retourner les dernières valeurs du MACD et de la ligne de signal
    return df[['index', 'MACD', 'Signal_Line']].tail()

# EXEMPLE DE RETOUR DE LA FONCTION:
#              index      MACD  Signal_Line
#       246 2025-03-13 -4.716033    -1.383196

# Exemple d'utilisation
# if __name__ == "__main__":
#     data = get_donnees_stock("AAPL")
#     macd_data = calculer_MACD(data)
#     print(macd_data)


def moyenne_mobile(data):
    prix_fermeture = data['Close']
    somme=0
    for jour in prix_fermeture:
        somme+=jour
    return round(somme/prix_fermeture.__len__(), 3)

def trouver_maximums(data):
#cherche les bougies à la fin d'une suite croissante et au début d'une suite décroissante
    maximums = data["High"] #liste de max quotidiens
    dates = data['index']
    fractales_max=[]
    for max in maximums:
        if (max == maximums[0] ) or  (max == maximums[1]) or (max == maximums[maximums.__len__()-1]) or (max == maximums[maximums.__len__()-2]):
            pass #rien faire si c'est le premier, le dernier, le deuxieme, ou l'avant dernier
        else:
            pos = maximums.index(max)
            if max>maximums[pos+1] and max>maximums[pos+2] and max>maximums[pos-1] and max>maximums[pos-2]:
                date=dates[pos]
                fractales_max.append(Fractale(date, max))
    return fractales_max


def trouver_minimums(data):
#cherche les bougies à la fin d'une suite croissante et au début d'une suite décroissante
    minimums = data["Low"] #liste de max quotidiens
    dates = data['index']
    fractales_min=[]
    for min in minimums:
        if (min == minimums[0] ) or  (min == minimums[1]) or (min == minimums[minimums.__len__()-1]) or (min ==minimums[minimums.__len__()-2]):
            pass #rien faire si c'est le premier, le dernier, le deuxieme, ou l'avant dernier
        else:
            pos = minimums.index(min)
            if min<minimums[pos+1] and min<minimums[pos+2] and min<minimums[pos-1] and min<minimums[pos-2]:
                date=dates[pos]
                fractales_min.append(Fractale(date, min, est_max=False))
    return fractales_min





def k_moyennes(data, n):
    points = trouver_minimums(data) + trouver_maximums(data)

    points_seulement_montant=[]
    for point in points:
        points_seulement_montant.append((point.montant, 0))

    cluster_k_moyennes = KMeans(n_clusters=n).fit(points_seulement_montant)
    return cluster_k_moyennes
    #print(cluster_k_moyennes)#.cluster_centers_


#méthode du coude
def trouver_k(data):
    n=1
    resultat_possible=[]
    while n<6:
        resultat_possible.append(k_moyennes(data, n))
        n+=1
    return resultat_possible

if __name__ == "__main__":
    liste= trouver_k(get_donnees_stock("NFLX"))
    for resultat in liste:
        print( "eresultat: ", resultat.cluster_centers_)
    #k_moyennes()
    #print(get_donnees_stock("AAPL"))

