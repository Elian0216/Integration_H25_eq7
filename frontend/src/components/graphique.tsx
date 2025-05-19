'use client'
import React from 'react'
import Script from 'next/script'
import { useEffect } from 'react'
import { postFetch, authProtection } from '@/utils/fetch'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { AnimatedGroup } from './ui/animated-group'
import { ArrowBigLeft, ArrowLeftCircle, ArrowLeftFromLineIcon, ArrowLeftIcon, CircleArrowLeftIcon, CircleArrowOutUpLeftIcon, StarIcon } from 'lucide-react'
import { get } from 'http'
import { text } from 'stream/consumers'
import { filter } from 'motion/react-client'
import FlammeChargement from './FlammeChargement'


const Graphique = ({ symbol, timeframe, interval }: {symbol: string, timeframe: string, interval: string}) => {
  const [loaded, setLoaded] = useState(false);
  const [validTicker, setValidTicker] = useState(false);
  const [estFavori, setEstFavori] = useState(false);

  useEffect(() => {
      // Check authentication
      authProtection("connexion");


      // Access the plot container
      const plotDiv = document.getElementsByClassName('js-plotly-plot')[0]
      if (!plotDiv) {
        console.error('Plotly container not found')
        return
      }
  
      // Debounce function (antiRebond)
      function antiRebond(func, wait) {
        let timeout: any;
        return function(...args: any[]) {
          clearTimeout(timeout)
          timeout = setTimeout(() => func.apply(this, args), wait)
        }
      }
  
      // Update y-axis function
      function updateAxeY() {
        var visibleHighsData = []
        var visibleLowsData = []
        var xData = plotDiv.data[0].x
        var highs = plotDiv.data[0].high
        var lows = plotDiv.data[0].low
        var xRange = plotDiv.layout.xaxis.range
  
        for (var i = 0; i < xData.length; i++) {
          if (xData[i] >= xRange[0] && xData[i] <= xRange[1]) {
            visibleHighsData.push(highs[i])
            visibleLowsData.push(lows[i])
          }
        }
  
        if (visibleHighsData.length > 0) {
          const minY = Math.min(...visibleLowsData)
          const maxY = Math.max(...visibleHighsData)
          Plotly.relayout(plotDiv, {
            'yaxis.range': [minY, maxY]
          })
        }
      }
  
      var updateAntiRebond = antiRebond(updateAxeY, 100)

      async function determinerSiFavori() {
        const res = await postFetch(process.env.API_PATH + 'estFavori/', {ticker: symbol})
        const res_json = await res?.json()
        if (res_json.bool) {
          setEstFavori(true)
        }
        else {  
          setEstFavori(false)
        }
      }

      determinerSiFavori()
  
      // Optionally, you can initialize your plot here if needed:
      async function fetchAndPlot() {
        const res = await postFetch(process.env.API_PATH + 'graphique/', {symbol: symbol, timeframe: timeframe, interval: interval})
        const res_json = await res?.json()

        if (!res_json.bool) {
          setValidTicker(false)
          setLoaded(true)
          return
        }

        setValidTicker(true)
        const chartJSON = res_json.graph_json
        
        await Plotly.newPlot(plotDiv, chartJSON.data, chartJSON.layout, chartJSON.config)
        setLoaded(true);

        if (plotDiv.on) {
          plotDiv.on('plotly_relayout', function (eventData) {
              if (eventData['xaxis.range[0]'] || eventData['xaxis.range[1]']) {
                updateAntiRebond()
              }
            })
        }
      }
      
      fetchAndPlot()

      // Prend les valeurs de la légende qui serait normalement créee sur le graphique lors du passage du curseur afin de les afficher quelque part d'autre
      function getLegendValues(element: HTMLElement): string[][][] {
        const values: any[] = [];

        // Pour chaque enfant de l'élément, on vérifie s'il a des enfants ET si celui-ci ne contient pas de date
        // puisqu'on ne veut que les éléments les plus proche de la date du curseur (logique Plotly un peu bizarre)
        Array.from(element.children).forEach(child => {
          if (child.children.length > 0) {
            // Si l'enfant a des enfants, on traite l'enfant récursivement pour ne qu'avoir les enfants sans enfants
            const childValues = getLegendValues(child as HTMLElement);
            if (childValues.length > 0) {
              // On ajoute que l'enfant traité récursivement si ce n'est pas un tableau vide
              values.push(childValues);
            }
          } else {
            // Si l'enfant est l'enfant du plus bas degré, on ajoute son contenu à la liste des valeurs, s'il n'est pas vide
            if (child.textContent && child.textContent.trim() !== '' && !(child.textContent.includes(',') && child.textContent.includes(':') && !child.textContent.includes('Candlestick'))) {
              values.push(child.textContent);
            }
          }
        });

        return values;
      }

      /*
        FORMATAGE : Transforme 
        [
            "Jan 2, 2024",
            [
                [
                    [
                        "Candlestick : Jan 12, 2024",
                        "open: 52.50",
                        "high: 52.59",
                        "low: 48.10",
                        "close: 48.55  ▼"
                    ]
                ],
                [
                    [
                        "Candlestick : open: 69.25",
                        "high: 72.78",
                        "low: 68.00",
                        "close: 68.51  ▼"
                    ]
                ],
                [
                    "Fractales : 72.78"
                ]
            ]
        ]
        en
        [
          "Jan 2, 2024",
            [
              "Candlestick",
                [
                  open: 69.25",
                  "high: 72.78",
                  "low: 68.00",
                  "close: 68.51  ▼"
                ]
            ],
          "Fractales : 72.78"
        ]
      */
      function getProcessedLegendValues(valuesInArray: string[][][]): (any)[] {
        // Les valeurs viennent dans un tableau, on les extrait
        const values = valuesInArray[0];
        console.log('Values :', values);

        // On enlève les valeurs de candlestick avec plus de 4 valeurs (soit celles avec des dates)
        // Des fois, la date n'est pas présente, on vérifie cela
        const index = values.length > 1 ? 1 : 0;
        values[index] = values[index].filter((value) => {
          if (Array.isArray(value[0]) && value[0].length > 4) {
            return false;
          };
          console.log('- ', value[0]);
          return true;
        });

        // On formatte les valeurs pour qu'elles soient plus faciles à lire
        const processedValues = []
        processedValues[0] = values[0]

        for (const value of values[index]) {
          if (Array.isArray(value[0])) {
            // On sépare le titre candlestick de ses valeurs
            const splitString = value[0][0].split(' : ');
            console.log('Split string:', splitString);

            // On crée un tableau secondaire pour les valeurs du candlestick
            const newCandlestickArray = [];
            newCandlestickArray[0] = splitString[0];
            newCandlestickArray[1] = [splitString[1]];
            for (let i = 1; i < value[0].length; i++) {
              newCandlestickArray[1].push(value[0][i]);
            }

            // On ajoute le tableau secondaire au tableau principal
            processedValues.push(newCandlestickArray);

          } else {
            processedValues.push(value[0]);
          }
        }

        return processedValues;
      }

      function createLegendElement(values: (string[][])) {
        const newLegendElement = document.createElement('div');
        newLegendElement.className = 'whitespace-normal break-words';
        for (const value of values) {
          if (Array.isArray(value)) {
            const divNode = document.createElement('div');

            const titleNode = document.createElement('span');
            titleNode.className = 'font-bold';
            titleNode.textContent = value[0];

            divNode.appendChild(titleNode);

            for (const subValue of value[1]) {
              const textNode = document.createElement('span');
              textNode.className = 'block';
              textNode.textContent = subValue;
              divNode.appendChild(textNode);
            }

            newLegendElement.appendChild(divNode);
          } else {
            const textNode = document.createElement('span');
            textNode.className = 'font-bold block';
            textNode.textContent = value;
            newLegendElement.appendChild(textNode);
          }
        }
        return newLegendElement;
      }

      let previousLegendElement: HTMLElement | null = null;
      const legendObserver = new MutationObserver((mutations) => {
        const newElement = document.getElementById('legendElement');
        const legendElement = document.getElementsByClassName('legend')[1];
        if (legendElement && legendElement !== previousLegendElement) {
          previousLegendElement = legendElement as HTMLElement;

          console.log('Legend element found:', legendElement);
          
          const legendValues = getLegendValues(legendElement as HTMLElement);
          console.log('Legend values:', legendValues);
          const processedLegendValues = getProcessedLegendValues(legendValues);
          console.log('Processed legend values:', processedLegendValues);
          const newLegendElement = createLegendElement(processedLegendValues);
          // const legendContent = legendElement.innerHTML;
          // const newLegendElement = document.createElement('div');
          // newLegendElement.className = 'whitespace-normal break-words';
          // newLegendElement.innerHTML = legendContent;
          
          if (newElement && newElement.firstChild) {
            newElement.replaceChild(newLegendElement, newElement.firstChild);
          }
      
          // Hide the original legend element
          legendElement.remove();
        }
      });
      
      legendObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
  
  }, [])

  const IconeFavoris = ({ estFavori }: { estFavori: boolean }) => {
    const starIconClasses = "h-10 w-10 text-yellow-500 cursor-pointer";

    function handleClick() {
      if (estFavori) {
        postFetch(process.env.API_PATH + 'supprimerFavori/', {ticker: symbol})?.then(() => {setEstFavori(false)})
      } else {
        postFetch(process.env.API_PATH + 'ajouterFavori/', {ticker: symbol})?.then(() => {setEstFavori(true)})
      }
    }

    return (
      <div className="group w-full items-center justify-center">
        <StarIcon className={estFavori ? starIconClasses + " fill-yellow-500" : starIconClasses} onClick={handleClick}/>
        <div className="absolute hidden group-hover:block p-2 rounded-md bg-gray-700 text-white text-sm whitespace-nowrap">
          <span>{estFavori ? "Supprimer des" : "Ajouter aux"} favoris</span>
        </div>
      </div>
    )
  }

  return (
    <div className="block">
      <Script src="https://cdn.plot.ly/plotly-latest.min.js" strategy="beforeInteractive" />

      {/* Favoris */}
      {loaded && validTicker && <div className="absolute top-[10vh] right-[15vw] mt-2 mr-2 z-10">
        <IconeFavoris estFavori={estFavori} />
      </div>}
      {/* Retour */}
      {loaded && validTicker && <div className="absolute top-[10vh] left-[2vw] z-10 cursor-pointer transition-all hover:scale-120 text-gray-500 hover:text-gray-700">
        <Link href="/analyse"><CircleArrowLeftIcon className='h-10 w-10' /></Link>
      </div>}
      {/* Informations */}
      {loaded && validTicker && <div className="absolute top-[40vh] right-[5vw] z-10 border-2 border-gray-500 rounded-md bg-white p-2 w-[10vw] md:text-sm sm:text-xs">
        <div id="legendElement" className='block'>
          <div></div>
        </div>
      </div>}

      <div className="js-plotly-plot mt-12 w-[80vw] h-[80vh] flex items-center justify-center">
        {/* Chargement */}
        {!loaded && 
          // <div className="flex justify-center items-center h-full">
          //   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          // </div>
          <FlammeChargement />      
        }
        {loaded && !validTicker &&
          <AnimatedGroup className="space-y-4 text-center">
            <h1 className="text-red-500 text-4xl">Ce symbole n'existe pas</h1>
            <Button asChild variant="link" className="px-2 text-blue-500 text-xl">
              <Link href="/analyse">Retour à la page de recherche</Link>
            </Button>
          </AnimatedGroup>
        }
      </div>
    </div>
  )
}


export default Graphique
