import yfinance as yf
import pandas as pd
import numpy as np


def get_donnees_stock(ticker, period="1y"):
    stock_data = yf.download(ticker, period=period)
    stock_data_formattee = {}

    for colonne in stock_data.columns:
        stock_data_formattee[colonne[0]
                             ] = stock_data[colonne].to_numpy().tolist()
        # print(stock_data[colonne].to_numpy().tolist())

    stock_data_formattee["index"] = stock_data.index

    # print(stock_data_formattee)

    return stock_data_formattee


# Pour tester le script directement
if __name__ == "__main__":
    get_donnees_stock("AAPL")


def get_all_stock_symbols():
    # Télécharger les composants du S&P 500
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    table = pd.read_html(url)
    df = table[0]
    symbols = df['Symbol'].tolist()

    # Vérifier que les symboles sont valides avec yfinance
    valid_symbols = []
    for symbol in symbols[:50]:
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            valid_symbols.append((symbol, info.get('longName', 'Nom inconnu')))
        except Exception as e:
            print(f"Erreur avec le symbole {symbol}: {e}")

    return valid_symbols


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
    return df[['index', 'RSI']].tail()


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

