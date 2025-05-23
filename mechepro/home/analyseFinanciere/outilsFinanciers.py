import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

from home.analyseFinanciere.Fractale import Fractale

from home.analyseFinanciere.yahooFinance import get_donnees_stock


# Les paramètres data représentent la sortie de la fonction get_donnees_stock dans yahooFinance.py
# C'est dans con appel où la période de temps sera définie.
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


def moyenne_mobile(data):
    prix_fermeture = data['Close']
    somme=0
    for jour in prix_fermeture:
        somme+=jour
    return round(somme/prix_fermeture.__len__(), 3)

def trouver_maximums(data, n=10):
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
#meme principe que la fonction trouver_maximums
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
    """
    Identifie le nombre optimal de clusters dans les données de fractales et regroupe les fractales en clusters.

    Cette fonction utilise la méthode du coude pour déterminer le nombre optimal de clusters (k) en fonction des points de fractales de maximums et minimums trouvés dans les données. 
    Une fois k déterminé, elle regroupe les fractales en clusters et renvoie un dictionnaire associant chaque centre de cluster à la liste des fractales qui lui sont assignées.

    Parameters:
        data (pandas.DataFrame): Les données du stock contenant les colonnes 'High', 'Low' et 'index'.

    Returns:
        dict: Un dictionnaire où les clés sont les centres des clusters et les valeurs sont des listes de fractales appartenant à chaque cluster.
    """

    points = trouver_minimums(data) + trouver_maximums(data)
    points_seulement_montant = []
    for point in points:
        points_seulement_montant.append((point.montant, 0))

    # méthode du coude
    n=1 #nombre de clusters dans l'essai.
    resultat_possible=[]
    while n<6:
        resultat_possible.append(KMeans(n_clusters=n, max_iter=300).fit(points_seulement_montant))
        n+=1

    #pente: diff inertie / diff k(tjrs 1), donc pente = différence d'inertie.
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
    """
    Crée un rectangle qui entoure les points de la liste_fractales.

    Retourne un tuple de deux tuples. Le premier tuple contient les bornes de la date, le deuxième les bornes du montant.

    :param liste_fractales: une liste de Fractale
    :return: un tuple de deux tuples
    :rtype: ( (datetime.date, datetime.date), (float, float) )
    """
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
    """
    Prépare les données pour le graphique.

    Fait deux choses :
    - appelle trouver_k pour trouver les clusters de fractales
    - appelle cree_rectangle pour trouver les bornes de chaque cluster

    :param data: les données du stock
    :return: une liste de tuple. Le premier élément est le centroide, le deuxième est un tuple de deux éléments, le premier élément est un tuple de deux dates (borne inférieure et supérieure de la date), le deuxième élément est un tuple de deux float (borne inférieure et supérieure du montant)
    :rtype: [ (float, ( (datetime.date, datetime.date), (float, float) ) ) ]
    """
    premiere_liste = trouver_k(data)
    resultat=[]
    for element in premiere_liste:
        resultat.append((element, cree_rectangle(premiere_liste[element])))
    return resultat

### DIVERGENCES
def calculer_pente(x1, y1, x2, y2):
    """Calcule la pente entre deux points"""
    if x2 == x1:
        return float('inf')
    return (y2 - y1) / (x2 - x1)

def detect_divergences( fractals, rsi_data, min_slope_diff=0.001, min_price_change=0.01, min_candles=5, max_candles=50):
    """
    Détecte les divergences entre le prix et le RSI en vérifiant plusieurs fractales suivantes
    
    Args:
        stock_data: Données du stock
        fractals: Liste des fractales (maximums et minimums)
        rsi_data: Données RSI
        min_slope_diff: Différence minimale entre les pentes pour considérer une divergence
        min_price_change: Changement minimal du prix en pourcentage
        min_candles: Nombre minimal de bougies entre deux points
        max_candles: Nombre maximal de bougies entre deux points
    """
    divergences = []
    
    # Trier les fractales par date
    fractals = sorted(fractals, key=lambda x: x.date)
    
    for i in range(len(fractals)):
        f1 = fractals[i]
        
        # Vérifier les 3 fractales suivantes du même type
        checked_count = 0
        for j in range(i + 1, len(fractals)):
            if checked_count >= 2:  # Arrêter après avoir vérifié 2 fractales suivantes
                break
                
            f2 = fractals[j]
            
            # Vérifier si les deux fractales sont du même type (Max ou Min)
            if f1.est_max != f2.est_max:
                continue
                
            checked_count += 1
            
            # Vérifier la fenêtre temporelle
            candles_between = (f2.date - f1.date).days
            if not (min_candles <= candles_between <= max_candles):
                continue
                
            try:
                # Calculer la pente du prix
                price_slope = calculer_pente(f1.date.timestamp(), f1.montant, 
                                           f2.date.timestamp(), f2.montant) * 10**6
                
                # Obtenir les valeurs RSI correspondantes
                rsi1 = float(rsi_data[rsi_data['index'] == f1.date]['RSI'].iloc[0])
                rsi2 = float(rsi_data[rsi_data['index'] == f2.date]['RSI'].iloc[0])
                
                # Calculer la pente du RSI
                rsi_slope = calculer_pente(f1.date.timestamp(), rsi1,
                                         f2.date.timestamp(), rsi2) * 10**6
                
                # Vérifier la différence de pente
                if abs(price_slope) < min_slope_diff and abs(rsi_slope) < min_slope_diff:
                    print(f"Price slope: {price_slope}, RSI slope: {rsi_slope}, min slope diff: {min_slope_diff}")
                    continue
                
                # Vérifier le changement de prix
                price_change = abs(f2.montant - f1.montant) / f1.montant
                if price_change < min_price_change:
                    continue
                    
                # Détecter divergence haussière (prix baisse mais RSI monte)
                if (f1.est_max == False and  # Vérifier que ce sont des minimums
                    price_slope < 0 and rsi_slope > 0 and 
                    rsi1 < 40):  # RSI en zone de survente
                    divergences.append({
                        'type': 'bullish',
                        'points': [(f1.date, f1.montant), (f2.date, f2.montant)],
                        'rsi_points': [(f1.date, rsi1), (f2.date, rsi2)]
                    })
                    
                # Détecter divergence baissière (prix monte mais RSI baisse)
                elif (f1.est_max == True and  # Vérifier que ce sont des maximums
                      price_slope > 0 and rsi_slope < 0 and 
                      rsi1 > 60):  # RSI en zone de surachat
                    divergences.append({
                        'type': 'bearish',
                        'points': [(f1.date, f1.montant), (f2.date, f2.montant)],
                        'rsi_points': [(f1.date, rsi1), (f2.date, rsi2)]
                    })
                    
            except (IndexError, KeyError) as e:
                print(f"Erreur lors du traitement des fractales: {e}")
                continue
                
    return divergences