from .yahooFinance import get_donnees_stock
import plotly.graph_objects as go
from django.shortcuts import render
from .yahooFinance import get_all_stock_symbols, calculer_RSI

def generer_graphique(request):
    # Test avec AAPL
    ticker = request.POST.get("symbol", "AAPL")
    stock_data = get_donnees_stock(ticker, "5y")

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
            dragmode="pan", # Mode de déplacement dans le graphique
        ),
    )

    fig.update_layout(
        xaxis=dict(
            rangeslider=dict(
                visible=True,  # Show the range slider
                thickness=0.05,  # Thickness of the range slider (0 to 1)
                bgcolor="lightgray",  # Background color
                bordercolor="black",  # Border color
                borderwidth=1,  # Border width
            ),
            rangeselector=dict(
                buttons=list([
                    dict(count=1, label="1m", step="month", stepmode="backward"),
                    dict(count=6, label="6m", step="month", stepmode="backward"),
                    dict(count=1, label="YTD", step="year", stepmode="todate"),
                    dict(count=1, label="1y", step="year", stepmode="backward"),
                    dict(step="all", label="All"),
                ]),
            ),
        ),
        yaxis=dict(
            # autorange=True,
            # fixedrange=False,
        ),

    )

    # Changer les couleurs des bougies
    fig.update_traces(
            increasing=dict(line=dict(color="green")),
            decreasing=dict(line=dict(color="red")),
        )
    
    # Template pour les indicateurs
    # fig.add_trace(
    #     go.Scatter(
    #         x=stock_data.index,
    #         y=stock_data["Close"].rolling(window=20).mean(),  # Moyenne mobile de 20 jours
    #         mode="lines",
    #         name="Moyenne mobile (20)",
    #         line=dict(color="blue"),
    #     )
    # )

    graph_html = fig.to_html(
            full_html=False,
            config={
                "scrollZoom": True,
                "modeBarButtonsToAdd": ["drawline", "drawopenpath", "drawcircle", "drawrect", "eraseshape"],
            }
        )

    return render(request, "page_analyse.html", {"graph_html": graph_html, "symbols": get_all_stock_symbols()})	

