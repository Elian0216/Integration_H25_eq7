"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Fournit un contexte de thème à l'application.
 * 
 * Ce composant enveloppe ses enfants dans le fournisseur de thèmes de `next-themes`,
 * permettant ainsi la gestion des thèmes (comme le mode sombre/clair) sur le site.
 * 
 * @param {Object} props - Propriétés du composant.
 * @param {React.ReactNode} props.children - Les éléments enfants à rendre sous le contexte du thème.
 * @returns {JSX.Element} Élément JSX qui fournit le contexte de thème à ses enfants.
 */

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}
  >{children}</NextThemesProvider>;
}
