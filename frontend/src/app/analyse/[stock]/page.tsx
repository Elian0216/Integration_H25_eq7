import GraphiqueComplet from '@/components/GraphiqueComplet';
import React from 'react'

const StockPage = async ({ params }: any ) => {
  const { stock } = await params;
  return (
    <>
      <section className="min-h-screen flex items-center justify-center W-full">
        <GraphiqueComplet stock={stock} />
      </section>
    </>
  )
}

export default StockPage
