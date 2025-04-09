"use client";

import Retour from "@/components/retour";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Favoris from "@/components/ui/favoris";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { use, useState } from "react";

const Analyse = () => {
  const [token, setToken] = useState("BTC");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setToken(inputValue.trim());
    }
  };

  return (
    <>
      <AnimatedGroup className="slide">
        <div className="relative h-screen">
          <div className="absolute top-[25%] left-[10%]  rounded-md">
            <form onSubmit={handleSubmit} className="relative">
              <Search
                onClick={handleSubmit}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4"
              />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Rechercher un actif..."
                className="bg-zinc-800 border-zinc-700 pl-9 w-full sm:w-64"
              />
            </form>
          </div>
          <div className="absolute top-[25%] right-[10%]">
            {//REMPLACER PAR TOKENS DE L'UTILISATEUR
            }
            <Favoris tokens={["BTC", "XRP"]} />
          </div>
        </div>

        <div className="flex flex-col items-start justify-center h-screen">
          <h1>Graphique for {token}</h1>
          <div id="graphique"></div>
        </div>
      </AnimatedGroup>
    </>
  );
};

export default Analyse;
