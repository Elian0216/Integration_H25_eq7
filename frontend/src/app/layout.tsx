import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { HeroHeader } from "@/components/entete";
import { FooterSection } from "@/components/basDePage";
import "./globals.css";
import CsrfUtils from "@/components/utils/csrf_utils";
import React from "react";

export const metadata: Metadata = {
  title: "Mèchepro",
  description: "Donnons aux gens la mèche dont ils ont besoin",
};

/**
 * Structure de mise en page racine (pour tous les composants enfants).
 * On inclut notamment le thème, l'en-tete et le bas de page pour toutes les pages.
 * 
 * @param {Object} props - Propriétés du composant.
 * @param {React.ReactNode} props.children - Enfants à rendre à l'intérieur du layout.
 * @returns {JSX.Element} Élément JSX représentant la mise en page racine.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <CsrfUtils />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HeroHeader />
            {children}
            <FooterSection />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
