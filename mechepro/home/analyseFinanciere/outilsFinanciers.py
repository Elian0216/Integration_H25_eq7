import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

from home.analyseFinanciere.Fractale import Fractale

from home.analyseFinanciere.yahooFinance import get_donnees_stock


#les paramètres data représentent la sortie de la fonction get_donnees_stock dans yahooFinance.py
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

def trouver_maximums(data, n=10):
#cherche les bougies à la fin d'une suite croissante et au début d'une suite décroissante
    """
    Cherche les bougies à la fin d'une suite croissante et au début d'une suite décroissante.

    Parameters:
    data (pandas.DataFrame): les données du stock avec les colonnes 'High' et 'index'
    n (int): le nombre de bougies à vérifier avant et après la bougie en cours

    Returns:
    list: une liste de Fractale contenant les maximums trouvés
    """
    maximums = data["High"] #liste de max quotidiens
    dates = data['index']
    fractales_max=[]
    
    for i in range(n, len(maximums) - n):
        max = maximums[i]
        if all(max > maximums[j] for j in range(i - n, i + n + 1) if j != i):
            date = dates[i]
            fractales_max.append(Fractale(date, max))
    return fractales_max


def trouver_minimums(data, n=10):
#cherche les bougies à la fin d'une suite décroissante et au début d'une suite croissante
    minimums = data["Low"] #liste de min quotidiens
    dates = data['index']
    fractales_min=[]
    for i in range(n, len(minimums) - n):
        min = minimums[i]
        if all(min < minimums[j] for j in range(i - n, i + n + 1) if j != i):
            date = dates[i]
            fractales_min.append(Fractale(date, min, est_max=False))
    return fractales_min




def trouver_k(data):
    points = trouver_minimums(data) + trouver_maximums(data)
    points_seulement_montant = []
    for point in points:
        points_seulement_montant.append((point.montant, 0))
    # méthode du coude
    n=1
    resultat_possible=[]
    while n<6:
        resultat_possible.append(KMeans(n_clusters=n, max_iter=300).fit(points_seulement_montant))
        n+=1

    #pente: diff inertie / diff k(tjrs 1)
    #comparaison des différences d'inertie. Le plus grand est le coude
    i=0
    difference_pente=[]
    max =i # pos de la difference max, nb optimal de k

    while i< resultat_possible.__len__()-1:
        difference_pente.append(resultat_possible[i+1].inertia_ - resultat_possible[i].inertia_)
        if difference_pente[i]>difference_pente[max]:
            max=i
        i+=1

    liste = resultat_possible[max].cluster_centers_

    clusters_seul=[]
    #associations centroide a une liste de fracale

    dict_clusters ={
    }

    for e in liste:
        clusters_seul.append(float(e[0]))
        dict_clusters[float(e[0])]=[]


    etiquette = resultat_possible[max].labels_.tolist()
    for i in range(etiquette.__len__()):
        dict_clusters[clusters_seul[etiquette[i]]].append(points[i])

    return dict_clusters

def cree_rectangle(liste_fractales):
    ymax= -5
    ymin=1000000
    xmin=liste_fractales[0].date
    xmax=xmin
    for fractale in liste_fractales: # trouver prix plus bas et plus haut, trouver date plus ancienne et plsu récencte
        ymin = min(ymin, fractale.montant)
        ymax = max(ymax, fractale.montant)
        xmin= min(xmin, fractale.date)
        xmax = max(xmax, fractale.date)
    return [(xmin, xmax), (ymin, ymax)]



def preparer_grapique(data):
    premiere_liste = trouver_k(data)
    resultat=[]
    for element in premiere_liste:
        resultat.append((element, cree_rectangle(premiere_liste[element])))
    return resultat

if __name__ == "__main__":
    data=get_donnees_stock("AAPL")
    #liste= trouver_k(get_donnees_stock("AAPL"))
    print(preparer_grapique(data))
