from .yahooFinance import get_all_stock_symbols
from .outilsFinanciers import calculer_RSI, trouver_maximums, trouver_minimums, preparer_grapique, detect_divergences

import plotly.graph_objects as go
from plotly.subplots import make_subplots
from django.shortcuts import render

import pandas as pd
import json

ensemble_daction = get_all_stock_symbols()

COULEUR_TEXTE = "black"
COULEUR_FOND = 'white'
COULEUR_FOND_GRAPHE ='white'


def generer_graphique(stock_data, ticker):
    """
    Génère un graphique combinant un candlestick chart et un RSI (Relative Strength Index).

    Args:
        stock_data (pd.DataFrame): Les données boursières contenant les colonnes 'index' (dates), 'Open', 'High', 'Low', 'Close'.
        ticker (str): Le symbole boursier (ticker) pour le titre.

    Returns:
        dict: Un dictionnaire contenant la configuration du graphique au format JSON pour Plotly.
    """
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

    # Moyennes mobiles
    # Moyenne mobile exponentielle de 20 jours
    fig.add_trace(
        go.Scatter(
            x=stock_data['index'],
            y=pd.Series(stock_data["Close"]).ewm(span=20, adjust=False).mean().to_list(),  # Exponential Moving Average de 20 jours
            mode="lines",
            name="MME (20)",
            line=dict(color="#4cc9f0"),
        )
    )

    # Moyenne mobile exponentielle de 50 jours
    fig.add_trace(
        go.Scatter(
            x=stock_data['index'],
            y=pd.Series(stock_data["Close"]).ewm(span=50, adjust=False).mean().to_list(),
            mode="lines",
            name="MME (50)",
            line=dict(color="#4361ee"),
        )
    )

    # Moyenne mobile exponentielle de 200 jours
    fig.add_trace(
        go.Scatter(
            x=stock_data['index'],
            y=pd.Series(stock_data["Close"]).ewm(span=200, adjust=False).mean().to_list(),
            mode="lines",
            name="MME (200)",
            line=dict(color="#3a0ca3"),
        )
    )


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
    # Dessine un rectangle pour les supports et les resistances
    supports_resistances = preparer_grapique(stock_data)
    
    for i in range(len(supports_resistances)):
        fig.add_shape(
            type="rect",
            x0=supports_resistances[i][1][0][0],
            x1=supports_resistances[i][1][0][1],
            y0=supports_resistances[i][0] + (supports_resistances[i][1][1][0] - supports_resistances[i][0]) * 0.25,
            y1=supports_resistances[i][0] + (supports_resistances[i][1][1][1] - supports_resistances[i][0]) * 0.25,
            line=dict(color="RoyalBlue"),
            fillcolor="LightSkyBlue",
            opacity=0.3,
            layer="below",
        )

    ### DIVERGENCES
    divergences = detect_divergences(maximums + minimums, RSI_data)

    # Dessiner les lignes de divergence
    for div in divergences:
        # Price line
        fig.add_shape(
            type="line",
            x0=div['points'][0][0],
            y0=div['points'][0][1],
            x1=div['points'][1][0],
            y1=div['points'][1][1],
            line=dict(
                color="#003924" if div['type'] == 'bullish' else "#650000",
                width=3,
                dash="solid",
            ),
            row=1,
            col=1
        )
        
        # Ligne RSI
        fig.add_shape(
            type="line",
            x0=div['rsi_points'][0][0],
            y0=div['rsi_points'][0][1],
            x1=div['rsi_points'][1][0],
            y1=div['rsi_points'][1][1],
            line=dict(
                color="#003924" if div['type'] == 'bullish' else "#650000",
                width=3,
                dash="solid",
            ),
            row=2,
            col=1
        )
        

    fig_json = json.loads(fig.to_json())
    fig_json["config"] = {
        "scrollZoom": True,
        "modeBarButtonsToAdd": ["drawline", "drawrect", "eraseshape"],
        "modeBarOrientation": "h",
    }

    return fig_json