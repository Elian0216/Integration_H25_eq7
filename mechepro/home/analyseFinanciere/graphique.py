import yfinance as yf
import plotly.graph_objects as go
from django.shortcuts import render
from plotly.utils import PlotlyJSONEncoder
import json

def generer_graphique(request):
    # Fetch AAPL stock data
    ticker = "AAPL"
    stock_data = yf.download(ticker, period="1y")  # 1 year of data
    print(stock_data)

    # Create a Plotly candlestick chart
    fig = go.Figure(
        data=[
            go.Candlestick(
                x=stock_data.index,
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

    # Convert the Plotly figure to JSON for rendering in the template
    plot_json = json.dumps(fig, cls=PlotlyJSONEncoder)

    return render(request, "page_analyse.html", {"plot_json": plot_json})