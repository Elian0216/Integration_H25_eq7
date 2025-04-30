import { FooterSection } from '@/components/basDePage';
import Graphique from '@/components/graphique';
import React from 'react'

const StockPage = async ({ params }: any ) => {
  const { stock } = await params;

  
  return (
    <>
    <section className="min-h-screen flex items-center justify-center">
      <div className='w-7/8 text-center mt-12 text-2xl'>
        <h1>Page for the stock : {stock}</h1>
        <Graphique symbol={stock} />
      </div>
    </section>
    </>
  )
}

export default StockPage
