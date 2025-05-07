'use client'
import React from 'react'
import Script from 'next/script'
import { useEffect } from 'react'
import { postFetch } from '@/utils/fetch'
import { useState } from 'react'


const Graphique = ({ symbol }: {symbol: string}) => {
    const [loaded, setLoaded] = useState(false);

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
    
        // Optionally, you can initialize your plot here if needed:
        async function fetchAndPlot() {
          const res = await postFetch(process.env.API_PATH + 'graphique/', {symbol: symbol})
          const res_json = await res?.json()
          const chartJSON = res_json.graph_json
          
          console.log(chartJSON);
          console.log("as;lkdfjaslkfdj");
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

  return (
    <div>
      <Script src="https://cdn.plot.ly/plotly-latest.min.js" strategy="beforeInteractive" />
      <div className="js-plotly-plot mt-12 w-[90vw] h-[90vh] flex items-center justify-center">
        {/* Chargement */}
        { !loaded && 
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      </div>
    </div>
  )
}

export default Graphique
