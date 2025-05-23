from alpha_vantage.timeseries import TimeSeries
from django.conf import settings
import requests

# NOTE: À cause des limitations de l'API Alpha Vantage, ce fichier n'est pas utilisé. Il est remplacé par yfinance.py.

def get_donnees_stock_temps_reel(symbol):
    """
    Récupère les données boursières en temps réel pour un symbole donné.

    Args:
        symbol (str): Le symbole boursier à rechercher.

    Returns:
        dict: Les données boursières en temps réel au format JSON.
    """
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_quote_endpoint(symbol=symbol)
    return data

def get_donnees_stock_intraday(symbol):
    """
    Récupère les données boursières intrajournalières pour un symbole donné.

    Args:
        symbol (str): Le symbole boursier à rechercher.

    Returns:
        dict: Les données boursières intrajournalières au format JSON.
    """
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_intraday(symbol=symbol)
    return data

def get_donnees_stock_daily(symbol):
    """
    Récupère les données boursières quotidiennes pour un symbole donné.

    Args:
        symbol (str): Le symbole boursier à rechercher.

    Returns:
        dict: Les données boursières quotidiennes au format JSON.
    """
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_daily(symbol=symbol)
    return data

def get_donnees_stock_weekly(symbol):
    """
    Récupère les données boursières hebdomadaires pour un symbole donné.

    Args:
        symbol (str): Le symbole boursier à rechercher.

    Returns:
        dict: Les données boursières hebdomadaires au format JSON.
    """
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_weekly(symbol=symbol)
    return data

def get_donnees_stock_monthly(symbol):
    """
    Récupère les données boursières mensuelles pour un symbole donné.

    Args:
        symbol (str): Le symbole boursier à rechercher.

    Returns:
        dict: Les données boursières mensuelles au format JSON.
    """
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_monthly(symbol=symbol)
    return data

def get_meilleurs_gagnants_perdants():
    """
    Récupère les meilleurs gagnants et perdants du marché boursier.

    Returns:
        dict: Les données des meilleurs gagnants et perdants au format JSON.
    """
    url = 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=' + settings.ALPHA_VANTAGE_API_KEY
    return obtenir_donnees_json(url)

def calculer_rsi(symbol):
    """
    Calcule l'indice de force relative (RSI) pour un symbole boursier donné.

    Args:
        symbol (str): Le symbole boursier à rechercher.

    Returns:
        dict: Les données RSI au format JSON.
    """
    url = 'https://www.alphavantage.co/query?function=RSI&symbol='+ symbol +'&interval=weekly&time_period=10&series_type=open&apikey=' + settings.ALPHA_VANTAGE_API_KEY
    return obtenir_donnees_json(url)


def obtenir_donnees_json(url):
    """
    Récupère les données JSON à partir d'une URL donnée.

    Args:
        url (str): L'URL à partir de laquelle récupérer les données.

    Returns:
        dict: Les données JSON récupérées.
    """
    try:
        r = requests.get(url, timeout=5)  # Set timeout to 5 seconds
        data = r.json()
        return data
    except requests.Timeout:
        print("Timeout error: the server did not respond within 5 seconds")
        return None
    
def get_symboles_stock():
    """
    Récupère tous les symboles boursiers disponibles.

    Returns:
        list: Une liste de tuples contenant le symbole et le nom de chaque action.
    """
    key = settings.ALPHA_VANTAGE_API_KEY
    data = TimeSeries(key=key, output_format='json').get_symbol_search('')  # Recherche tous les symboles disponibles
    symbols = [(item['1. symbol'], item['2. name']) for item in data]
    return symbols