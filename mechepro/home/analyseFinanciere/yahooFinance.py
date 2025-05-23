import yfinance as yf
import pandas as pd


def get_donnees_stock(ticker, period="1y", interval="1d"):
    """
    Récupère les données boursières pour un symbole donné.

    Args:
        ticker (str): Le symbole boursier à chercher.
        period (str): La période de temps à récupérer (par exemple 1y, 2y, etc.). Par défaut 1 année.
        interval (str): L'intervalle de temps entre chaque donnée (par exemple 1d, 1w, etc.). Par défaut 1 jour.

    Returns:
        dict: Un dictionnaire contenant les données boursières formatées.
    """
    stock_data = yf.download(ticker, period=period, interval=interval) #, rounding=True
    stock_data_formatte = {}

    for colonne in stock_data.columns:
        stock_data_formatte[colonne[0]] = stock_data[colonne].to_numpy().tolist()
    stock_data_formatte["index"] = stock_data.index

    return stock_data_formatte

def get_all_stock_symbols():
    # lire les symboles et leur description à  partir du fichier
    fichier = open("home/analyseFinanciere/yahoo_tickers.csv")

    # Vérifier que les symboles sont valides avec yfinance
    valid_symbols = []
    for ligne in fichier.readlines():
        ticker = ligne.split('",')[0].strip('"')
        nom = (ligne.split('",')[1]).strip('"')
        secteur = (ligne.split('",')[5]).strip('"')
        valid_symbols.append((ticker,nom, secteur))
    return valid_symbols



