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

      <div className="js-plotly-plot mt-12 w-[90vw] h-[90vh] flex items-center justify-center">
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
