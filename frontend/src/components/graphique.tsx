'use client'
import React from 'react'
import Script from 'next/script'
import { useEffect } from 'react'
import { postFetch } from '@/utils/fetch'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { AnimatedGroup } from './ui/animated-group'
import { ArrowBigLeft, ArrowLeftCircle, ArrowLeftFromLineIcon, ArrowLeftIcon, CircleArrowLeftIcon, CircleArrowOutUpLeftIcon, StarIcon } from 'lucide-react'
import { get } from 'http'
import { text } from 'stream/consumers'
import { filter } from 'motion/react-client'


const Graphique = ({ symbol }: {symbol: string}) => {
  const [loaded, setLoaded] = useState(false);
  const [validTicker, setValidTicker] = useState(false);
  const [estFavori, setEstFavori] = useState(false);

  useEffect(() => {
      // Access the plot container
      const plotDiv = document.getElementsByClassName('js-plotly-plot')[0]
      if (!plotDiv) {
        console.error('Plotly container not found')
        return
      }
  
      // Debounce function (antiRebond)
      function antiRebond(func, wait) {
        let timeout;
        return function(...args) {
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
        const res = await postFetch(process.env.API_PATH + 'graphique/', {symbol: symbol})
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

      function getLegendValues(element: HTMLElement): string[] {
        const values: (string[] | string[][])[] = [];

        Array.from(element.children).forEach(child => {
          if (child.children.length > 0) {
            values.push(getLegendValues(child as HTMLElement));
          } else {
            values.push(child.textContent);
          }
        });

        return values;
      }

      function createLegendElement2(values: string[] | string[][], indentLevel = 0): HTMLElement {
        const element = document.createElement('div');
        element.className = 'space-y-2';
        element.style.marginLeft = `${indentLevel * 1}px`; // adjust the indent level

        values.forEach(value => {
          if (Array.isArray(value)) {
            const childElement = createLegendElement(value, indentLevel + 1);
            element.appendChild(childElement);
          } else {
            const textElement = document.createElement('span');
            textElement.textContent = value;
            textElement.style.display = 'block'; // make each value appear on a new line
            element.appendChild(textElement);
          }
        });

        return element;
      }

      function createLegendElement(values: string[]): HTMLElement {
        function removeEmptyStringsDeep(arr: (string | string[])[]): (string | string[])[] {
          return arr.flatMap(item => {
            if (Array.isArray(item)) {
              const filteredSubarray = removeEmptyStringsDeep(item);
              return filteredSubarray.length > 0 ? [filteredSubarray] : [];
            } else {
              return item !== '' ? [item] : [];
            }
          });
        }

        function filterOutDatedInfoDeep(arr: (string | string[])[]): (string | string[])[] {
          return arr.flatMap(item => {
            if (Array.isArray(item)) {
              if (item.length > 0 && typeof item[0] === 'string' && item[0].startsWith("Candlestick :") && item[0].includes(',')) {
                return []; // Discard the entire Candlestick array if the first element has a date
              } else {
                const filteredSubarray = filterOutDatedInfoDeep(item).filter(subItem => {
                  if (typeof subItem === 'string') {
                    return !subItem.includes(',');
                  }
                  return true; // Keep nested arrays that don't get filtered down to empty
                });
                return filteredSubarray.length > 0 ? [filteredSubarray] : [];
              }
            } else if (typeof item === 'string') {
              return !item.includes(',') ? [item] : [];
            }
            return [item]; // Keep non-string, non-array items as is (though your example doesn't have any)
          });
        }

        const cleanArray = removeEmptyStringsDeep(values);
        const date = values[0];
        console.log("Clean array:", cleanArray);
        
        let processedArray = filterOutDatedInfoDeep(cleanArray);
        console.log("Processed array:", processedArray);
        

        const element = document.createElement('div');
        element.className = 'whitespace-normal break-words';
        return element;
      }

      let previousLegendElement;
      const legendObserver = new MutationObserver((mutations) => {
        const newElement = document.getElementById('legendElement');
        const legendElement = document.getElementsByClassName('legend')[1];
        if (legendElement && legendElement !== previousLegendElement) {
          previousLegendElement = legendElement;

          console.log('Legend element found:', legendElement);
          
          const legendValues = getLegendValues(legendElement as HTMLElement);
          console.log('Legend values:', legendValues);
          const newLegendElement = createLegendElement(legendValues[1]);
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
    <div>
      <Script src="https://cdn.plot.ly/plotly-latest.min.js" strategy="beforeInteractive" />

      {loaded && validTicker && <div className="absolute top-[10vh] right-[15vw] mt-2 mr-2 z-10">
        <IconeFavoris estFavori={estFavori} />
      </div>}
      {loaded && validTicker && <div className="absolute top-[10vh] left-[2vw] z-10 cursor-pointer transition-all hover:scale-120 text-gray-500 hover:text-gray-700">
        <Link href="/analyse"><CircleArrowLeftIcon className='h-10 w-10' /></Link>
      </div>}
      {loaded && validTicker && <div className="absolute top-[40vh] right-[1vw] z-10 border-2 border-gray-500 rounded-md bg-white p-2 w-[10vw]">
        <div id="legendElement" className='block'>
          <div></div>
        </div>
      </div>}

      <div className="js-plotly-plot mt-12 w-[70vw] h-[90vh] flex items-center justify-center">
        {/* Chargement */}
        { !loaded && 
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
