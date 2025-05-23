import Link from "next/link";

/**
 * Composant React qui affiche un lien permettant de retourner à 
 * la page d'accueil.
 */
export default function Retour() {
  return (
    <div className="flex bg-zinc-50 px-4 py-1 dark:bg-transparent">
      <Link
        href={"/"}
        className="text-muted-foreground hover:text-accent-foreground block duration-150"
      >
        <span>Retour à la page d'accueil</span>
      </Link>
    </div>
  );
}