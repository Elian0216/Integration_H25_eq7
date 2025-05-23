"use client";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { checkAuth } from "@/utils/fetch";


  /**
   * La page d'analyse d'une action principale. Elle permet de saisir un code boursier
   * dans une barre de recherche et de rediriger vers la page d'analyse de l'action.
   */
const Analyse = () => {
  // Contenu du champ de recherche
  const [query, setQuery] = useState("");

  // Si l'utilisateur n'est pas connecté, préparer à rediriger vers la page de connexion
  let isAuth = true;
  checkAuth().then((bool) => {
    isAuth = bool;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si le champ de recherche est vide, ne rien faire
    if (!query) return;
    // On redirige vers la page d'analyse de l'action seulement si l'utilisateur est connecté
    if (!isAuth)
      window.location.href = "/connexion";
    else
      window.location.href = `/analyse/${query.toUpperCase()}`;
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
                type="submit"
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
    </>
  );
};

export default Analyse;
