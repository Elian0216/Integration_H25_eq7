import { FooterSection } from '@/components/basDePage';
import Graphique from '@/components/graphique';
import React from 'react'

const StockPage = async ({ params }: any ) => {
  const { stock } = await params;
  const timeframe = "1d";
  
  return (
    <>
      <section className="min-h-screen flex items-center justify-center W-full">
        <Graphique symbol={stock} timeframe={timeframe} />
      </section>
    </>
  )
}

export default StockPage
