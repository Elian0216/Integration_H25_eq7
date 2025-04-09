import yfinance as yf
import pandas as pd


def get_donnees_stock(ticker, period="1y"):
    stock_data = yf.download(ticker, period=period) #, rounding=True
    stock_data_formatte = {}

    for colonne in stock_data.columns:
        stock_data_formatte[colonne[0]] = stock_data[colonne].to_numpy().tolist()
        # print(stock_data[colonne].to_numpy().tolist())

    stock_data_formatte["index"] = stock_data.index

    # print(stock_data_formatte)

    return stock_data_formatte


# Pour tester le script directement
if __name__ == "__main__":
    print(get_donnees_stock("AAPL"))


def get_all_stock_symbols():
    # lire les symboles et leur description du fichier
    fichier = open("home/analyseFinanciere/all.csv")#changer le nom pour elargir

    # Vérifier que les symboles sont valides avec yfinance
    valid_symbols = []
    for ligne in fichier.readlines():
        ticker = ligne.split('",')[0].strip('"')
        nom = (ligne.split('",')[1]).strip('"')
        secteur = (ligne.split('",')[5]).strip('"')
        valid_symbols.append((ticker,nom, secteur))
    return valid_symbols



