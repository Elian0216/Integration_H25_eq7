"use client";
import React, { useEffect, useState } from "react";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postFetch, authProtection } from "@/utils/fetch";

export default function Parametres() {
  const [selected, setSelected] = useState<"Mon compte" | "Sécurité">(
    "Mon compte"
  );
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    authProtection();
  }, []);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    try {
      const data = await postFetch(
        `${process.env.API_PATH}changerMotDePasse/`,
        {
          ancien_mot_de_passe: ancienMotDePasse,
        
          mot_de_passe: nouveauMotDePasse,
        }
      );

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Mot de passe mis à jour avec succès.");
        setAncienMotDePasse("");
        setNouveauMotDePasse("");
      } else {
        throw new Error(data.message || "Échec de la mise à jour.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Une erreur est survenue.");
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="mt-20 flex flex-col justify-between w-1/5 h-screen border-r-2 p-6">
        <div className="space-y-6">
          <h2 className="font-medium lg:text-3xl">Paramètres</h2>
          <AnimatedGroup
            variants={fadeInSpring}
            className="flex flex-col flex-1 mt-6 space-y-3"
          >
            <button
              onClick={() => setSelected("Mon compte")}
              className="flex items-center px-2 py-1 rounded text-gray-900 hover:bg-gray-100"
            >
              <User /> <span className="pl-2">Mon compte</span>
            </button>
            <button
              onClick={() => setSelected("Sécurité")}
              className="flex items-center px-2 py-1 rounded text-gray-900 hover:bg-gray-100"
            >
              <KeyRound /> <span className="pl-2">Sécurité</span>
            </button>
          </AnimatedGroup>
        </div>
        <Button
          onClick={() => {
            postFetch(process.env.API_PATH + "deconnexion/", {});
            window.location.reload();
          }}
          variant="destructive"
          size="sm"
          className="mt-5 w-full"
        >
          Déconnexion
        </Button>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6">
        {selected === "Mon compte" ? (
          <div className="text-center">
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
            <p>Affiche ici les informations de l’utilisateur.</p>
          </div>
        ) : (
          <form
            onSubmit={handlePasswordChange}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-md w-full space-y-4"
          >
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0}
              as="h1"
              className="text-3xl font-bold mb-4 text-center"
            >
              Sécurité
            </TextEffect>

            <p className="text-lg font-medium mb-4 text-center">
              Changement de mot de passe 🔒
            </p>

            <Input
              type="password"
              required
              value={ancienMotDePasse}
              onChange={(e) => setAncienMotDePasse(e.target.value)}
              placeholder="Ancien mot de passe"
            />
            <Input
              type="password"
              required
              value={nouveauMotDePasse}
              onChange={(e) => setNouveauMotDePasse(e.target.value)}
              placeholder="Nouveau mot de passe"
            />
            <Button type="submit" variant="default" className="w-full">
              Mettre à jour
            </Button>

            {status === "success" && (
              <div className="p-3 bg-green-100 text-green-800 rounded">
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                {message}
              </div>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

export const fadeInSpring = {
  container: { visible: { transition: { delayChildren: 1 } } },
  item: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { type: "spring", bounce: 0.3, duration: 2 },
    },
  },
};
