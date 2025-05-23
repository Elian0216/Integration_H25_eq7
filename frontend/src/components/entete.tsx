'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ModeToggle } from './ui/toggler'
import { checkAuth } from '@/utils/fetch'
import { TextEffect } from './ui/text-effect'
import { AnimatedGroup } from './ui/animated-group'


/**
 * Composant qui représente l'en-tête de la page.
 * 
 * Ce composant gère l'état du menu et l'état de défilement de la page.
 * Il vérifie l'authentification de l'utilisateur pour afficher les éléments de menu pertinents.
 * Le menu contient des liens de navigation vers différentes sections du site.
 * 
 * États :
 * - `menuState` : booléen indiquant si le menu est ouvert ou fermé.
 * - `isScrolled` : booléen indiquant si la page est défilée au-delà d'un certain point.
 * - `menuItems` : liste des éléments de menu à afficher.
 * - `loaded` : booléen indiquant si les éléments de menu ont été chargés.
 * - `isAuth` : booléen indiquant si l'utilisateur est authentifié.
 */

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [menuItems, setMenuItems] = React.useState<{ name: string; href: string }[]>([]);
    const [loaded, setLoaded] = React.useState(false);
    const [isAuth, setIsAuth] = React.useState(false);

    
    React.useEffect(() => {
        /**
         * Charge les éléments du menu en fonction de l'état d'authentification
         * de l'utilisateur.
         * 
         * Si l'utilisateur est authentifié, charge les éléments de menu
         * "Favoris", "Analyse", "À propos" et "Paramètres".
         * Sinon, charge les éléments de menu "Analyse" et "À propos".
         * 
         * Une fois les éléments chargés, défini l'état `loaded` à `true`.
         */
      async function loadMenuItems() {
        if (await checkAuth()) {
          setMenuItems([
            { name: 'Favoris', href: '/favoris' },
            { name: 'Analyse', href: '/analyse' },
            { name: 'À propos', href: '/a-propos' },
            { name: 'Paramètres', href: '/parametres'},
          ]);
          setIsAuth(true);
        } else {
          setMenuItems([
            { name: 'Analyse', href: '/analyse' },
            { name: 'À propos', href: '/a-propos' },
          ]);
        }
        setLoaded(true);
      }

      loadMenuItems();

    /**
     * Mets à jour l'état `isScrolled` en fonction de la position de défilement
     * actuelle.
     * 
     * Si la position de défilement est supérieure à 50, défini `isScrolled` à
     * `true`. Sinon, le défini à `false`.
     * 
     * Utilisé pour afficher ou masquer le menu en fonction de la position de défilement.
     */
      const handleScroll = () => {
          setIsScrolled(window.scrollY > 50)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full px-2"
        >
          <div
            className={cn(
              "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
              isScrolled &&
                "bg-background/30 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
            )}
          >
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="/logoMechePro.jpg"
                    alt="logo"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                <ul className="flex gap-14 text-sm">
                  {loaded && menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <TextEffect>{item.name}</TextEffect>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:hidden">
                  <ul className="space-y-6 text-base">
                    {loaded && menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {(!isAuth && loaded) && <AnimatedGroup><div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}
                  >
                    
                    <Link href="/connexion">
                      <span>Connexion</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled)}
                  >
                    <Link href="/inscription">
                      <span>Inscription</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                  >
                  </Button>
                  <ModeToggle />
                </div></AnimatedGroup>}
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
}
