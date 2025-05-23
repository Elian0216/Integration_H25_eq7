"use client";
import React, { useEffect, useState } from "react";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postFetch, authProtection } from "@/utils/fetch";

type DonneesUtilisateur = {
  nom_utilisateur: string;
  prenom: string;
  nom: string;
  adresse_courriel: string;
  numero_telephone: string;
  date_de_naissance: string; // ISO
};

export default function Parametres() {
  const [selected, setSelected] = useState<"Mon compte" | "Sécurité">(
    "Mon compte"
  );
  const [donnees, setDonnees] = useState<DonneesUtilisateur | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");

  // Vérification de l'authentification, si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  useEffect(() => {
    authProtection();
  }, []);

  // Chargement des données de l'utilisateur au chargement de la page et au changement de l'onglet dans les paramètres
  useEffect(() => {
    if (selected === "Mon compte") {
      fetchUserData();
    }
  }, [selected]);

  /**
   * Charge les données de l'utilisateur actuel.
   */
  async function fetchUserData() {
    setLoadingUser(true);
    try {
      const data = await postFetch(
        `${process.env.API_PATH}donneesUtilisateur/`,
        {}
      );
      const res = await data?.json();
      if (res && res.success) {
        setDonnees(res.utilisateur);
      } else {
        console.error("Erreur fetchUserData:", res.message);
        setDonnees(null);
      }
    } catch (err: any) {
      console.error("Erreur fetchUserData:", err);
      setDonnees(null);
    } finally {
      setLoadingUser(false);
    }
  }

  /**
   * Fonction pour changer le mot de passe de l'utilisateur.
   * @param e Le formulaire de changement de mot de passe
   */
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
      const res = await data?.json();

      if (res.success) {
        setStatus("success");
        setMessage(res.message || "Mot de passe mis à jour avec succès.");
        setAncienMotDePasse("");
        setNouveauMotDePasse("");
      } else {
        throw new Error(res.message || "Échec de la mise à jour.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Une erreur est survenue.");
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="mt-20 flex flex-col justify-between w-1/5 border-r-2 p-6">
        <div className="space-y-6">
          <h2 className="font-medium text-3xl">Paramètres</h2>
          <AnimatedGroup
            variants={fadeInSpring}
            className="flex flex-col flex-1 mt-6 space-y-4"
          >
            <button
              onClick={() => setSelected("Mon compte")}
              className="flex items-center px-3 py-2 rounded-lg text-xl font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <User className="w-5 h-5" />
              <span className="pl-3">Mon compte</span>
            </button>
            <button
              onClick={() => setSelected("Sécurité")}
              className="flex items-center px-3 py-2 rounded-lg text-xl font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <KeyRound className="w-5 h-5" />
              <span className="pl-3">Sécurité</span>
            </button>
          </AnimatedGroup>
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={() => {
              // Fonction de déconnexion. On redirige vers la page de connexion si la requête de déconnexion est un succcess
              postFetch(process.env.API_PATH + "deconnexion/", {})?.then((res) => {
                if (!res.ok) {
                  console.error(res);
                  return;
                }
                window.location.href = "/";
              });
            }}
            variant="destructive"
            size="sm"
            className="mt-5 w-full cursor-pointer"
          >
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
        {selected === "Mon compte" ? (
          <div className="max-w-lg mx-auto space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0}
              as="h1"
              className="text-3xl font-bold mb-4 text-center"
            >
              Mon compte
            </TextEffect>

            {loadingUser ? (
              <p className="text-center">Chargement des informations…</p>
            ) : donnees ? (
              <AnimatedGroup variants={fadeInSpring}>
              <div className="space-y-3 text-xl p-8">
                <p>
                  <span className="font-semibold">Nom d’utilisateur :</span>{" "}
                  {donnees.nom_utilisateur}
                </p>
                <p>
                  <span className="font-semibold">Prénom :</span>{" "}
                  {donnees.prenom}
                </p>
                <p>
                  <span className="font-semibold">Nom :</span> {donnees.nom}
                </p>
                <p>
                  <span className="font-semibold">Email :</span>{" "}
                  {donnees.adresse_courriel}
                </p>
                <p>
                  <span className="font-semibold">Téléphone :</span>{" "}
                  {donnees.numero_telephone}
                </p>
                <p>
                  <span className="font-semibold">Date de naissance :</span>{" "}
                  {new Date(donnees.date_de_naissance).toLocaleDateString(
                    "fr-CA"
                  )}
                </p>
              </div>
              </AnimatedGroup>
            ) : (
              <p className="text-center text-red-600">
                Impossible de charger vos données.
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handlePasswordChange}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-md w-full mx-auto space-y-4"
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
