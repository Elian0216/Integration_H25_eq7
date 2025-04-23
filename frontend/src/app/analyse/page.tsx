"use client";
import Retour from "@/components/retour";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Favoris from "@/components/ui/favoris";
import { Plus, Search } from "lucide-react";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import Link from "next/link";
import React, { use, useState } from "react";

const Analyse = () => {
  const [token, setToken] = useState("BTC");
  const [inputValue, setInputValue] = useState("");

  // const userTokens = await fetch("/api/user/tokens", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }).then((res) => res.json());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setToken(inputValue.trim());
    }
  };


  const handleAjouterFavoris = () => {
    // Logique pour ajouter le token aux favoris
    console.log(`Ajouter ${token} aux favoris`);
  };

  return (
    <>
      <AnimatedGroup className="slide">
        <div className="relative h-screen justify-between">
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
          <div className="absolute top-[25%] right-[50%] flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-md p-2 shadow-md">
            <Plus className="text-green-400" onClick={handleAjouterFavoris} />
          </div>
          <div className="absolute top-[25%] right-[10%]">
            {
              //REMPLACER PAR TOKENS DE L'UTILISATEUR et implementer qu'il peut supprimer le token
            }
            <Favoris tokens={["BTC", "XRP"]} setTokens={(a) => setToken(a)} />
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
