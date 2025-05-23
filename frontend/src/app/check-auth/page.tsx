'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Retour from "@/components/retour";

  /**
   * CheckAuth est un composant Next.js qui vérifie si l'utilisateur est connecté
   * en faisant une requête GET au backend sur l'endpoint "is-auth/". Si la requête est
   * réussie, le statut de l'authentification est mis à jour dans l'état local.
   * Si une erreur se produit, le statut de l'authentification est mis à jour avec
   * un message d'erreur.
   *
   * Le composant affiche le statut de l'authentification actuel, ainsi qu'un bouton
   * "Réessayer" qui permet de relancer la vérification de l'authentification.
   * 
   * C'est une page qui test si l'utilisateur est connecté ou non.
   */
export default function CheckAuth() {
  const [authStatus, setAuthStatus] = useState<string>("Vérification ...");

  async function checkAuth() {
    try {
      const response = await fetch(`${process.env.API_PATH}is-auth/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const data = await response.json();
      setAuthStatus(data.message);
    } catch (error) {
      setAuthStatus("Erreur lors de la vérification de l'authentification.");
      console.error("Errur lors de la vérification de l'authentification:", error);
    }
  }

  // Effectuer la vérification de l'authentification au montage
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Retour />
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-md">
          <h1 className="mb-6 text-2xl font-bold">Statut de l'authentification</h1>
          <p className="mb-4 text-lg transition-all duration-300 animate-fade">
            {authStatus}
          </p>
          <Button onClick={checkAuth} className="w-full">
            Réessayer
          </Button>
        </div>
      </div>
    </>
  );
}
