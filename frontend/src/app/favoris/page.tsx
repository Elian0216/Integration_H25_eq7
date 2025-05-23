"use client";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "@/components/entete";
import { postFetch } from "@/utils/fetch";

  /**
   * Page affichant les actions favoris de l'utilisateur.
   *
   * - Charge les favoris via l'API.
   * - Affiche les favoris sous forme de liste.
   * - Permet de supprimer un favori via un bouton.
   */
export default function Favoris() {
  const [tickersFavoris, setTickersFavoris] = useState<string[]>([]); // Liste des favoris
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  // Charge les favoris via l'API au chargement de la page (au montage)
  useEffect(() => {
    fetch(process.env.API_PATH + "obtenirFavoris/")
      .then((res) => res.json())
      .then((data) => {
        setTickersFavoris(data.tickersFavoris);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des favoris :", err);
        setLoading(false);
      });
  }, []);

  /**
   * Supprime un favori via l'API.
   * @param {string} ticker - Le ticker du favori à supprimer.
   */
  const supprimerFavori = async (ticker: string) => {
    try {
      const res = await postFetch(process.env.API_PATH + "supprimerFavori/", {ticker: ticker});

      // Si la suppression a reussi, on met a jour la liste des favoris
      if (res?.ok) {
        setTickersFavoris((prev) =>
          prev.filter((t) => t.toUpperCase() !== ticker.toUpperCase())
        );
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <>
      <HeroHeader />
      <section className="min-h-screen py-16 md:py-32">
        <div className="container mx-auto py-8 px-4">
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0}
            as="h1"
            className="text-3xl font-bold mb-6"
          >
            Mes Actions Favoris
          </TextEffect>

          {loading ? (
            <p className="font-bold">Chargement...</p>
          ) : tickersFavoris.length === 0 ? (
            <p className="font-bold">Aucun favori trouvé.</p>
          ) : (
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
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
              }}
            >
              <div className="space-y-4">
                {tickersFavoris.map((ticker, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-background p-4 rounded-lg border hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/analyse/${ticker}`}>
                      <p className="text-xl font-medium underline">{ticker}</p>
                    </Link>
                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() => supprimerFavori(ticker)}
                    >
                      <Trash className="mr-2" size={16} />
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </AnimatedGroup>
          )}
        </div>
      </section>
    </>
  );
}
