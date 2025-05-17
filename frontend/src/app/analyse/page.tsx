"use client";

import Graphique from "@/components/graphique";
import Retour from "@/components/retour";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Favoris from "@/components/ui/favoris";
import { Plus, Search } from "lucide-react";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { FooterSection } from "@/components/basDePage";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};



const Analyse = () => {
  
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement your search logic here (e.g., API call or router push)
    console.log("Searching for:", query);
  };

  const handleAjouterFavoris = () => {
    // Logique pour ajouter le token aux favoris
    // console.log(`Ajouter ${token} aux favoris`);
  };



  return (
    <>
    
      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                delayChildren: 1,
              },
            },
          },
          item: {
            hidden: {
              opacity: 0,
              y: 20,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                bounce: 0.3,
                duration: 2,
              },
            },
          },
        }}
        >
        <div className="relative h-screen">
        <form
  onSubmit={handleSubmit}
  className="flex flex-col items-center justify-center
            h-screen
            bg-gray-50 dark:bg-gray-900
            px-4
            space-y-4"
            
>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 ">
            MèchePro
          </h1>
          <p className="text-2xl font-serif text-gray-900 dark:text-gray-100 pb-20">
            Donnons aux gens la mèche dont ils ont besoin.
          </p>
   
  <div
    className="
      flex items-center
              w-3/4 max-w-4xl
              space-x-2
              border border-gray-300 dark:border-zinc-700
              rounded-full
              bg-white dark:bg-gray-800
              px-4 py-3
              shadow-sm
              transition-colors duration-150
              focus-within:ring-2 focus-within:ring-gray-500
    "
  >
    {/*Icon de loupe*/}
    <Search
      size={20}
      className="text-gray-400 dark:text-gray-500 flex-shrink-0"
    />

    {/*Input*/}
    <input
      type="text"
      placeholder="Entrez le code boursier d'une action..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="
        flex-1
        bg-transparent
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        focus: outline-none
        
      "
    />

    {/*Bouton analyser*/}
    <button
      type="button"
      // onClick={} fonction à remplir après
      className="
        flex items-center justify-center
        px-5 py-3
        bg-gray-100 dark:bg-zinc-700
        hover:bg-gray-200 dark:hover:bg-zinc-600
        rounded-full
        text-sm font-medium
        text-gray-900 dark:text-gray-100
        transition-colors duration-150
        cursor-pointer
      "
    >
      Analyser
    </button>
  </div>
</form>
        </div>
      </AnimatedGroup>
       <FooterSection />
    </>
  );
};

export default Analyse;
