import Link from 'next/link'
import Image from 'next/image'

const links = [
    {
        title: 'Favoris',
        href: '/favoris',
    },
    {
        title: 'Analyse',
        href: '/analyse',
    },
    {
        title: 'À propos',
        href: '/a-propos',
    },
    {
      title: 'Paramètres',
      href: '/parametres',
  },
]

// Composant du bas de page
export const FooterSection = () => {
    return (
      <footer className="py-6 md:py-10 
      bg-gray-300 dark:bg-[#1F1F1F]">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/"
            aria-label="go home"
            className="mx-auto block size-fit"
          >
            
                  <Image
                    src="/logoMechePro.jpg"
                    alt="logo"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                
          </Link>

          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary
                dark:text-gray-400 dark:hover:text-gray-200
                block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
          <span className="text-muted-foreground 
          dark:text-gray-400 
          block text-center text-sm">
            {" "}
            © {new Date().getFullYear()} MèchePro, Tout droits reservés
          </span>
        </div>
      </footer>
    );
}
