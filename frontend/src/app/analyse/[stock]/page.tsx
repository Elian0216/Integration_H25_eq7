import Graphique from '@/components/graphique';
import React from 'react'

const StockPage = async ({ params }: any ) => {
    const { stock } = await params;
  return (
    <section className="min-h-screen flex items-center justify-center">
      Page for the stock : {stock}
      <Graphique symbol={stock} />
    </section>
  )
}

export default StockPage
