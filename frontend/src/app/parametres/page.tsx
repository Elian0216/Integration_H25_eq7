"use client";
import Image from "next/image";
import { HeroHeader } from "@/components/entete";
import { FooterSection } from "@/components/basDePage";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { User, KeyRound } from "lucide-react";

import { postFetch, authProtection } from "@/utils/fetch";
import { Input } from "@/components/ui/input";

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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { type: "spring", bounce: 0.3, duration: 2 },
    },
  },
};

export default function parametres() {
  const [selected, setSelected] = React.useState<"Mon compte" | "Sécurité">(
    "Mon compte"
  );

  useEffect(() => {
    authProtection();
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        <aside className="mt-20 flex flex-col justify-between w-1/5 h-screen border-r-2 p-6">
          <div className="space-y-6">
            <h2 className="font-medium lg:text-3xl ">Paramètres</h2>

            <AnimatedGroup
              variants={fadeInSpring}
              className="flex flex-col flex-1 mt-6 space-y-3"
            >
              <button
                onClick={() => setSelected("Mon compte")}
                className="
                            flex items-center mt-5 w-full text-left 
                            px-2 py-1 rounded
                            text-gray-900 dark:text-gray-100
                            hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User />

                <p className="pl-2">Mon compte</p>
              </button>

              <button
                onClick={() => setSelected("Sécurité")}
                className=" flex items-center mt-5 w-full text-left 
                            px-2 py-1 rounded
                            text-gray-900 dark:text-gray-100
                            hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <KeyRound />
                <span className="pl-2">Sécurité</span>
              </button>
            </AnimatedGroup>
          </div>

          <Button
            onClick={() => {
              postFetch(process.env.API_PATH + "deconnexion/", {});
              window.location.reload();
            }}
            asChild
            variant="destructive"
            size="sm"
            className="mt-5 flex items-center w-full text-left px-2 py-1 rounded
                     hover:bg-red-400 dark:hover:bg-red-700 hover:cursor-pointer"
          >
            <span>Déconnexion</span>
          </Button>
        </aside>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-xl font-semibold text-center">
            {selected === "Mon compte" ? (
              <>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0}
                  as="h1"
                  className="text-3xl font-bold mb-6"
                >
                  Mon compte
                </TextEffect>
              </>
            ) : (
              <>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0}
                  as="h1"
                  className="text-3xl font-bold mb-6"
                >
                  Sécurité
                </TextEffect>

                <p className="text-lg font-medium">
                  Changement de mot de passe
                  <br />
                </p>
                <div className="flex flex-row items-center mt-4 gap-2">
                  <Input
                    type="text"
                    required
                    name="mot_de_passe"
                    id="mot_de_passe"
                    placeholder="Nouveau mot de passe"
                  />{" "}
                  <Link href="/changer-mot-de-passe">
                    <Button className="w-full">Changer le mot de passe</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
