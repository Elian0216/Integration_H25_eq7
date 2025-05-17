from .yahooFinance import get_all_stock_symbols
from .outilsFinanciers import calculer_RSI, trouver_maximums, trouver_minimums, preparer_grapique

import plotly.graph_objects as go
from plotly.subplots import make_subplots
from django.shortcuts import render

import json

ensemble_daction = get_all_stock_symbols()

COULEUR_TEXTE = "black"
COULEUR_FOND = 'white'
COULEUR_FOND_GRAPHE ='white'


def generer_graphique(stock_data, ticker):
    # Creation du graphique
    fig = make_subplots(rows=2, cols=1, shared_xaxes=True, vertical_spacing=0.15, row_heights=[0.7, 0.3])
    

    # Création du sous-graphique pour les bougies
    fig.add_trace(
        go.Candlestick(
            x=stock_data["index"],
            open=stock_data["Open"],
            high=stock_data["High"],
            low=stock_data["Low"],
            close=stock_data["Close"],
            name="Candlestick"
        ),
        row=1,
        col=1
    )

    # Changer les couleurs des bougies
    fig.update_traces(
            increasing=dict(line=dict(color="green")),
            decreasing=dict(line=dict(color="red")),
        )
    
    # Création du sous-graphique pour le RSI
    RSI_data = calculer_RSI(stock_data)

    fig.add_trace(
        go.Scatter(
            x=RSI_data["index"].tolist(),
            y=RSI_data["RSI"].tolist(),
            mode="lines",
            name="RSI",
            line=dict(color="blue"),
        ),
        row=2,
        col=1,
    )

    # Changer la taille du sous-graphique
    fig.update_yaxes(range=[0, 100], row=2, col=1, fixedrange=True)

    # Configuration du graphique
    fig.update_layout(
        title=dict(text="Graphique pour " + ticker, font_size=18, font_color="black", x=0.5, y=0.95, xanchor="center", yanchor="top", pad=dict(t=10)),
        yaxis_title="Price (USD)",
        dragmode="pan", # Mode de déplacement dans le graphique
        xaxis=dict(
            rangeslider=dict(
                visible=True,  # Show the range slider
                thickness=0.05,  # Thickness of the range slider (0 to 1)
                bgcolor="white",  # Background color
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
        paper_bgcolor=COULEUR_FOND, 
        plot_bgcolor=COULEUR_FOND_GRAPHE,
        font=dict(color=COULEUR_TEXTE),
        hovermode="x unified",
        hoverdistance=10,
        hoverlabel=dict(
            bgcolor="rgba(255, 255, 255, 0.8)",
        )
    )

    fig.update_xaxes(tickfont=dict(color=COULEUR_TEXTE), showgrid=True, gridcolor="lightgrey", gridwidth=0.5, nticks=20, zeroline=False, showspikes=True, spikemode='across', spikesnap='cursor', spikedash='solid', spikethickness=1, tickformat="%Y-%m-%d", tickangle=0)
    fig.update_yaxes(tickfont=dict(color=COULEUR_TEXTE), showgrid=True, tickformat=".2f", gridcolor="lightgrey", gridwidth=0.5, nticks=25, showspikes=True, spikemode='across', spikesnap='cursor', showline=False, spikedash='solid', zeroline=False)
    fig.update_layout(legend=dict(font=dict(color=COULEUR_TEXTE)))


    # fig.add_trace(
    #     go.Scatter(
    #         x=stock_data.index,
    #         y=stock_data["Close"].rolling(window=20).mean(),  # Moyenne mobile de 20 jours
    #         mode="lines",
    #         name="Moyenne mobile (20)",
    #         line=dict(color="blue"),
    #     )
    # )

    # ANALYSE DU GRAHPIQUE
    ## Fractales
    ### Maximums
    maximums = trouver_maximums(stock_data)
    fractale_maximums = {"x":[], "y":[]}
    for fractale in maximums:
        fractale_maximums["x"].append(fractale.date)
        fractale_maximums["y"].append(fractale.montant)
    fig.add_trace(
        go.Scatter(
            x=fractale_maximums["x"],
            y=fractale_maximums["y"],
            mode="markers",
            name="Fractales",
            line=dict(color="purple"),
        )
    )
    ### Minimums
    minimums = trouver_minimums(stock_data)
    fractale_minimums = {"x":[], "y":[]}
    for fractale in minimums:
        fractale_minimums["x"].append(fractale.date)
        fractale_minimums["y"].append(fractale.montant)
    fig.add_trace(
        go.Scatter(
            x=fractale_minimums["x"],
            y=fractale_minimums["y"],
            mode="markers",
            name="Fractales",
            line=dict(color="#FE9000"),
        )
    )

    ## Supports et Résistances
    # Draw a rectangle for supports and resistances
    supports_resistances = preparer_grapique(stock_data)
    
    for i in range(len(supports_resistances)):
        fig.add_shape(
            type="rect",
            x0=supports_resistances[i][1][0][0],
            x1=supports_resistances[i][1][0][1],
            # y0=supports_resistances[i][1][1][0],
            # y1=supports_resistances[i][1][1][1],
            y0=supports_resistances[i][0] + (supports_resistances[i][1][1][0] - supports_resistances[i][0]) * 0.25,
            y1=supports_resistances[i][0] + (supports_resistances[i][1][1][1] - supports_resistances[i][0]) * 0.25,
            line=dict(color="RoyalBlue"),
            fillcolor="LightSkyBlue",
            opacity=0.3,
            layer="below",
        )
    # fig.add_shape(
    #     type="rect",
    #     x0=supports_resistances[0][1][0][0],
    #     x1=supports_resistances[0][1][0][1],
    #     y0=supports_resistances[0][1][1][0],
    #     y1=supports_resistances[0][1][1][1],
    #     line=dict(color="RoyalBlue"),
    #     fillcolor="LightSkyBlue",
    #     opacity=0.3,
    #     layer="below",
    # )        
        

    fig_json = json.loads(fig.to_json())
    fig_json["config"] = {
        "scrollZoom": True,
        # "modeBarButtonsToAdd": ["drawline", "drawopenpath", "drawcircle", "drawrect", "eraseshape"],
        "modeBarButtonsToAdd": ["drawline", "drawrect", "eraseshape"],
        "modeBarOrientation": "h",
    }

    return fig_json


    # === Ancien code Django ===
    # Convertir le graphique en HTML
    # graph_html = fig.to_html(
    #         full_html=False,
    #         config={
    #             "scrollZoom": True,
    #             "modeBarButtonsToAdd": ["drawline", "drawopenpath", "drawcircle", "drawrect", "eraseshape"],
    #         }
    #     )

    # return render(request, "page_analyse.html", {"graph_html": graph_html, "symbols": ensemble_daction})

