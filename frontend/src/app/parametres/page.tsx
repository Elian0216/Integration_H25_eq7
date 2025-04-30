"use client"
import Image from 'next/image'
import { HeroHeader } from "@/components/entete";
import { FooterSection } from "@/components/basDePage";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { format } from 'date-fns'
import {User, KeyRound } from "lucide-react";


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
  export const fadeInSpring = {
    container: {
      visible: { transition: { delayChildren: 1 } },
    },
    item: {
      hidden:   { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { type: "spring", bounce: 0.3, duration: 2 },
      },
    },
  }

export default function parametres(){
    const [selected, setSelected] = React.useState<"Mon compte"|"Sécurité">("Mon compte")
return (
        <>  
        
        <HeroHeader />      
    
        <div className = "flex min-h-screen">
            
            <aside className = "w-1/5 border-r-2 pl-6 pr-6 mt-25 mb-10 rounded-tl-lg rounded-bl-lg">
                <h2 className="font-medium lg:text-3xl ">
                    Paramètres
                </h2>
                    
                    <AnimatedGroup
                         variants={fadeInSpring}
                        className = "mt-10 cursor-pointer"
                        
                        >
                    
                        <button
                            onClick={() => setSelected("Mon compte")}
                            className="
                            flex items-center 
                            mt-5
                            w-full text-left 
                            cursor-pointer 
                            px-2 py-1 
                            rounded
                            hover:bg-gray-100
                            "
                        >
                            <User /> 

                            <p className = "pl-2">
                            Mon compte
                            </p>    
                            </button>
                        
                    </AnimatedGroup>
                
                    <AnimatedGroup
                         variants={fadeInSpring}
                        
                        >
                         <button
                            onClick={() => setSelected("Sécurité")}
                            className="flex items-center w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                            >
                            <KeyRound />
                            <span className="pl-2">Sécurité</span>
                        </button>
                    </AnimatedGroup>
                
            </aside>
                    <main className="flex-1 flex items-center justify-center p-6">
                        <p className="text-xl font-semibold text-center">
                            {selected}
                        </p>
                    </main>
        </div>
        
        <FooterSection />
        </>
    )
}
