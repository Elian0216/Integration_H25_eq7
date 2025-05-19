"use client"
import React, { useState } from 'react'
import Graphique from './graphique'
import { AnimatedGroup } from './ui/animated-group'
import { Button } from './ui/button'

const GraphiqueComplet = ({ stock }: { stock: string}) => {
  const [periodIndex, setPeriodIndex] = useState(0);
  const interval = "1d";
  const validPeriods = ["6mo", "1y", "2y", "5y", "10y", "ytd", "max"];
  
  return (
    <div className='block'>
        <Graphique key={periodIndex} symbol={stock} timeframe={validPeriods[periodIndex]} interval={interval} />

        <AnimatedGroup
            variants={{
              container: {
                hidden: {
                  opacity: 0,
                },
                visible: {
                  opacity: 1,
                  transition: {
                    duration: 2,
                  },
                },
              },
            }}
          >
            <div className='block bg-gray-100 p-6 rounded-2xl shadow-md m-6 border-2 border-gray-200 '>
              {validPeriods.map((period, index) => (
                <Button
                  key={period}
                  onClick={() => (setPeriodIndex(index))}
                  className={`${
                    periodIndex === index ? "bg-gray-800" : "bg-gray-400"
                  } m-2 px-4 py-2 rounded-full text-white cursor-pointer transition duration-300`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </AnimatedGroup>
    </div>
  )
}

export default GraphiqueComplet
