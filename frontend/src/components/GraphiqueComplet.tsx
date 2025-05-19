"use client"
import React, { useState } from 'react'
import Graphique from './graphique'
import { AnimatedGroup } from './ui/animated-group'
import { Button } from './ui/button'
import { TextEffect } from './ui/text-effect'

const GraphiqueComplet = ({ stock }: { stock: string}) => {
  const [periodIndex, setPeriodIndex] = useState(3);
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
            <div className='block bg-gray-100 p-6 rounded-2xl shadow-md m-6 border-2 border-gray-200 overflow-auto w-[80vw]'>
              <div>
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
              <div className='m-6 space-y-4'>
                <h2 className='text-xl'>Moyennes Mobiles Exponentielles</h2>
                  <p>
                    <strong>Cet indicateur lisse les fluctuations de prix pour révéler la tendance générale du marché. </strong>
                    La courbe de la moyenne mobile peut agir comme un support dynamique en tendance haussière (le prix rebondit dessus)
                    ou une résistance dynamique en tendance baissière. Les moyennes sont dites exponentielles puisqu'elles sont plus sensibles aux
                    variations récentes de prix, contrairement aux moyennes mobiles simples qui prennent en compte toutes les valeurs de manière égale.
                    En général, les croisements entre la moyenne mobile à court terme et celle à long terme peuvent signaler des opportunités d'achat ou de vente.
                    Dans le graphique, les nombres après MME représentent la période de la moyenne mobile. Par exemple, une période de 20 jours, signifie que la valeur de chaque point
                    de la courbe est la moyenne des 20 derniers jours de prix.
                  </p>
                <h2 className="text-xl">RSI (Relative Strength Index)</h2>
                  <p>
                    Cet oscillateur mesure la <strong>vitesse</strong> et <strong>l'ampleur</strong> des <strong>variations récentes de prix</strong> sur une échelle de 0 à 100.
                    Des valeurs en dessous de 30 suggèrent un marché survendu (potentiel rebond), tandis qu'au-dessus de 70, un marché suracheté (potentiel repli).
                    Le RSI peut également signaler des <strong>divergences</strong>, indiquant un possible renversement de tendance lorsque l'évolution du prix diffère de celle
                    de l'indicateur.
                  </p>
                <h2 className="text-xl">Fractales</h2>
                  <p>
                    Les fractales identifient des points de retournement potentiels sur le graphique, <strong>marquant des hauts et des bas significatifs</strong>. 
                    Ces sommets et creux aident à visualiser les niveaux clés où le prix a historiquement changé de direction,
                    servant de points de référence pour identifier des supports et résistances.
                  </p>
                <h2 className="text-xl">Zones de Supports et Résistances (K-Moyennes)</h2>
                  <p>
                    <strong>Les rectangles bleus représentent des zones de supports et de résistances identifiées statistiquement à l'aide de l'algorithme des K-Moyennes. </strong>
                    Cette méthode regroupe des périodes de prix similaires pour délimiter des zones où le prix a historiquement montré une forte probabilité de
                    trouver un support (et rebondir à la hausse) ou une résistance (et rebondir à la baisse).
                    L'intérêt de ces zones est qu'elles ne sont pas basées sur des points uniques mais sur des agrégations de prix,
                    reflétant des zones d'intérêt où l'activité d'achat ou de vente a été historiquement concentrée.
                    La théorie sous-jacente est que l'historique des prix a tendance à se répéter, et que ces zones où le prix a réagi dans le passé sont susceptibles
                    de le faire à nouveau. Il est important de noter que ces zones ne sont pas des niveaux exacts, mais plutôt des aires où la probabilité
                    d'une réaction du prix est en théorie plus élevée.
                  </p>
              </div>
            </div>
          </AnimatedGroup>
    </div>
  )
}

export default GraphiqueComplet
