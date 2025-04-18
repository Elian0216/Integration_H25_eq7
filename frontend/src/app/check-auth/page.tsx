'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Retour from "@/components/retour";

export default function CheckAuth() {
  const [authStatus, setAuthStatus] = useState<string>("Vérification ...");

  async function checkAuth() {
    try {
      const response = await fetch("/api/is-auth/", {
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
