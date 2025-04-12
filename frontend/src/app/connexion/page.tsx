'use client'
import Link from "next/link";
import Form from "next/form";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Retour from "@/components/retour";
import Cookies from "js-cookie"


export default function connexion() {
  function handleForm(e: any) {
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      alert("An error occured. " + csrfToken);
      return;
    }

    let inputs = document.getElementsByTagName("input");
    var map: { [key: string]: string } = {}
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      map[element.name] = element.value;
    }
    console.log(map);
    
    var resp = fetch("/api/connexion/",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
          'X-CSRFToken': csrfToken,
        }),
        credentials: "include",
        // Automatically converted to "username=example&password=password"
        body: new URLSearchParams(map),
      }
    );
  }

  return (
    <>
      <Retour />
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <Form
          action={handleForm}
          className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="p-8 pb-6">
            <div>
              <Link href="/" aria-label="go home">
                <Logo />
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

              <Button className="w-full" type="submit">Se connecter</Button>
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
        </Form>
      </section>
    </>
  );
}
