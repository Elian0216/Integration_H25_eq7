'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Form from "next/form";
import { postFetch } from "@/utils/fetch";
import { AnimatedGroup } from "@/components/ui/animated-group";


export default function inscription() {
  // Traitement du formulaire d'inscription
  async function handleForm(e: any) {
    // On recupere les valeurs des champs du formulaire en les mettant dans un dictionnaire
    let inputs = document.getElementsByTagName("input");
    var map: { [key: string]: string } = {}
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      map[element.name] = element.value;
    }
    
    var resp = await postFetch(process.env.API_PATH + "inscription/", map);
    const data = await resp?.json();
    
    // Si la reponse est un succes, on redirige vers la page de connexion
    // Sinon, on affiche un message d'erreur
    if (data.bool) {
      window.location.href = "/connexion";
    } else {
      alert(data.message);
    }
  }

  return (
    <>
      <AnimatedGroup>
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <Form
          action={handleForm}
          className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="p-8 pb-6">
            <div>
              <Link href="/" aria-label="go home">
                {/* logo ici */}
              </Link>
              <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                Créer un compte MèchePro
              </h1>
              <p className="text-sm">
                Bienvenue! Créez un compte pour commencer à analyser!
              </p>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="block text-sm">
                    Prénom
                  </Label>
                  <Input type="text" required name="prenom" id="firstname" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="block text-sm">
                    Nom
                  </Label>
                  <Input type="text" required name="nom" id="nom" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse_courriel" className="block text-sm">
                  Adresse Courriel
                </Label>
                <Input
                  type="email"
                  required
                  name="adresse_courriel"
                  id="adresse_courriel"
                />
              </div>

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

              <div className="space-y-2">
                <Label
                  htmlFor="numero_telephone"
                  className="text-title text-sm"
                >
                  Numéro de Téléphone
                </Label>
                <Input
                  type="tel"
                  required
                  name="numero_telephone"
                  id="numero_telephone"
                  className="input sz-md variant-mixed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_naissance" className="text-title text-sm">
                  Date de naissance
                </Label>
                <Input
                  type="date"
                  required
                  name="date_naissance"
                  id="date_naissance"
                  className="input sz-md variant-mixed"
                />
              </div>

              <Button className="w-full cursor-pointer">Créer un compte</Button>
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Vous avez déjà un compte ?
              <Button asChild variant="link" className="px-2">
                <Link href="/connexion">Connectez vous</Link>
              </Button>
            </p>
          </div>
        </Form>
      </section>
      </AnimatedGroup>
    </>
  );
}
