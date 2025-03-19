import yfinance as yf
import pandas as pd
from django.shortcuts import render


def get_donnees_stock(ticker, period="1y"):
    stock_data = yf.download(ticker, period=period)
    stock_data_formattee = {}
    
    for colonne in stock_data.columns:
       stock_data_formattee[colonne[0]] = stock_data[colonne].to_numpy().tolist()
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
    return  valid_symbols