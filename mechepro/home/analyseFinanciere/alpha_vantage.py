from alpha_vantage.timeseries import TimeSeries
from django.conf import settings
import requests

def get_donnees_stock_temps_reel(symbol):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_quote_endpoint(symbol=symbol)
    return data

def get_donnees_stock_intraday(symbol):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_intraday(symbol=symbol)
    return data

def get_donnees_stock_daily(symbol):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_daily(symbol=symbol)
    return data 

def get_donnees_stock_weekly(symbol):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_weekly(symbol=symbol)
    return data

def get_donnees_stock_monthly(symbol):
    api_key = settings.ALPHA_VANTAGE_API_KEY    
    ts = TimeSeries(key=api_key, output_format='json')
    data = ts.get_monthly(symbol=symbol)
    return data

def get_meilleurs_gagnants_perdants():
    url = 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=' + settings.ALPHA_VANTAGE_API_KEY
    return obtenir_donnees_json(url)

def calculer_rsi(symbol):
    url = 'https://www.alphavantage.co/query?function=RSI&symbol='+ symbol +'&interval=weekly&time_period=10&series_type=open&apikey=' + settings.ALPHA_VANTAGE_API_KEY
    return obtenir_donnees_json(url)


def obtenir_donnees_json(url):
    try:
        r = requests.get(url, timeout=5)  # Set timeout to 5 seconds
        data = r.json()
        return data
    except requests.Timeout:
        print("Timeout error: the server did not respond within 5 seconds")
        return None
    
def get_symboles_stock():
    key = settings.ALPHA_VANTAGE_API_KEY
    data = TimeSeries(key=key, output_format='json').get_symbol_search('')  # Recherche tous les symboles disponibles
    symbols = [(item['1. symbol'], item['2. name']) for item in data]
    return symbols