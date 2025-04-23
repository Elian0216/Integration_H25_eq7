import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Retour from "@/components/retour";
import { HeroHeader } from "@/components/entete";
import { FooterSection } from "@/components/basDePage";

export default function connexion() {
  return (
    <>
      <HeroHeader />
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <form
          method="POST"
          action=""
          className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="p-8 pb-6">
            <div>
              <Link href="/" aria-label="go home">
                {/* logo ici */}
              </Link>
              <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                Connectez vous à votre compte MèchePro
              </h1>
              <p className="text-sm">
                Bienvenue! Connectez vous un compte pour commencer à analyser!
              </p>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nom_utilisateur" className="block text-sm">
                  Nom d'utilisateur
                </Label>
                <Input
                  type="text"
                  required
                  name="nom_utilisateur"
                  id="nom_utilisateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mot_de_passe" className="text-title text-sm">
                  Mot de Passe
                </Label>
                <Input
                  type="password"
                  required
                  name="mot_de_passe"
                  id="mot_de_passe"
                  className="input sz-md variant-mixed"
                />
              </div>

              <Button className="w-full">Se connecter</Button>
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Vous n'avez pas un compte ?
              <Button asChild variant="link" className="px-2">
                <Link href="/inscription">Créez un compte</Link>
              </Button>
            </p>
          </div>
        </form>
      </section>
      <FooterSection />
    </>
  );
}
