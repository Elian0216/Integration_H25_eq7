import yfinance as yf

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