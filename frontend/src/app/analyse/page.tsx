"use client";

import Graphique from "@/components/graphique";
import Retour from "@/components/retour";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Favoris from "@/components/ui/favoris";
import { Plus, Search } from "lucide-react";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

const Analyse = () => {
  const handleAjouterFavoris = () => {
    // Logique pour ajouter le token aux favoris
    console.log(`Ajouter ${token} aux favoris`);
  };

  return (
    <>
      <AnimatedGroup className="slide">
        <div className="relative h-screen">
        <div className="absolute top-[25%] left-[10%] rounded-md w-[80%] space-y-4">
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
        </div>

      </AnimatedGroup>
    </>
  );
};

export default Analyse;
