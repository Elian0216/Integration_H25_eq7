from .yahooFinance import get_donnees_stock
import plotly.graph_objects as go
from django.shortcuts import render
from .yahooFinance import get_all_stock_symbols

def generer_graphique(request):
    # Test avec AAPL
    ticker = "AAPL"
    stock_data = get_donnees_stock(ticker, "5y")
    # stock_data = yf.download(ticker, period="1y")  # 1 year of data
    # print(stock_data["Open"])

    # Creation du graphique
    fig = go.Figure(
        data=[
            go.Candlestick(
                x=stock_data["index"],
                open=stock_data["Open"],
                high=stock_data["High"],
                low=stock_data["Low"],
                close=stock_data["Close"],
            )
        ],
        layout=go.Layout(
            title=f"{ticker} Stock Price (1 Year)",
            xaxis_title="Date",
            yaxis_title="Price (USD)",
        ),
    )

    graph_html = fig.to_html(full_html=False)

    return render(request, "page_analyse.html", {"graph_html": graph_html, "symbols": get_all_stock_symbols()})	


