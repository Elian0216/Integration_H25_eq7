"use client"
import { Clock, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from "react";
import Link from "next/link";
import { useState, useMemo } from 'react'
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "@/components/entete";
import { FooterSection } from "@/components/basDePage";
import { format } from 'date-fns'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
  } from "@/components/ui/dropdown-menu"


type Favorite = {
    id: number
    nomBourse: string
    dateFavori: string
    prixFavori: number
  }

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
  
  const mockFavorites: Favorite[] = [
    { id: 1, nomBourse: 'AAPL', dateFavori: '2025-04-10T14:23:00Z', prixFavori: 172.54 },
    { id: 2, nomBourse: 'GOOGL', dateFavori: '2025-04-12T09:10:00Z', prixFavori: 2840.13 },
    { id: 3, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
    { id: 4, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
    { id: 5, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
    { id: 6, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
    { id: 7, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
    { id: 8, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
    { id: 9, nomBourse: 'TSLA', dateFavori: '2025-04-15T18:45:00Z', prixFavori: 1032.49 },
  ]


export default function favoris(){
    const [sortBy, setSortBy] = useState<"date" | "price">("date")
    const favorites = mockFavorites  // ← swap in your real fetch or props

    const sortedFavorites = useMemo(() => {
        return [...favorites].sort((a, b) => {
            if (sortBy === "price") {
                return b.prixFavori - a.prixFavori
            }
            // date: newest first
            return (
                new Date(b.dateFavori).getTime() -
                new Date(a.dateFavori).getTime()
            )
        })
    }, [favorites, sortBy])

    return(
        <>
        
        <section className="min-h-screen py-16 md:py-32">
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between w-full px-4">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            Trier par...
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset={4} className="w-40 p-1">
                            <DropdownMenuRadioGroup
                            value={sortBy}
                            onValueChange={(v) => setSortBy(v as any)}
                            >
                            <DropdownMenuRadioItem value="recent">
                                Récent<Clock></Clock>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="ancien">
                                Ancien <Clock></Clock>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="haut">
                                Haute valeur $
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bas">
                                Basse valeur $
                            </DropdownMenuRadioItem>    
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu> 
                </div>

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
                        ...transitionVariants,
                    }}
                    >
                        <div className="space-y-4">
                            {favorites.map((bourse) => (
                                <Link
                                key={bourse.id}
                                href={`/analyse/${bourse.id}`}      // ← your real analysis page route        
                                className="block bg-background p-4 rounded-lg border hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-center">
                                        {/* Left side: name + date */}
                                        <div>
                                            <p className="text-xl font-medium">{bourse.nomBourse}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                            Favori le : {format(new Date(bourse.dateFavori), 'dd/MM/yyyy')}
                                            </p>
                                        </div>
                                        {/* Right side: price */}
                                        <p className="text-lg font-semibold">
                                            Prix au moment de sauvegarde: $<span className="underline">{bourse.prixFavori.toFixed(2)}</span>
                                        </p>
                                        <Button> 
                                            <Trash>
                                                Supprimer
                                            </Trash>
                                        </Button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                </AnimatedGroup>
            </div>
        </section>
        <FooterSection/>
        </>
    );
}
