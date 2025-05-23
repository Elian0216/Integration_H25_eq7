'use client'

import { useEffect } from 'react';
import Cookies from 'js-cookie';


/**
 * CsrfUtils est un composant React qui utilise le hook useEffect pour vérifier 
 * la présence d'un token CSRF dans les cookies lors du montage du composant. 
 * Si le token n'est pas trouvé, il effectue une requête GET pour obtenir un 
 * nouveau token CSRF depuis l'API spécifiée, et l'enregistre en tant que cookie. 
 * Cette opération aide à sécuriser les requêtes POST ultérieures contre les attaques CSRF.
 */

const CsrfUtils = () => {
  useEffect(() => {
    const getCsrfToken = async () => {
        if (!Cookies.get('csrftoken')) {
          console.log('CSRF token non trouvé');
          try {
            
            await fetch(process.env.API_PATH + 'csrf/', { method: 'GET' });
            console.log('CSRF token trouvé, cookie envoyé.');
          } catch (error) {
            console.error('Erreur lors de la recherche du CSRF token:', error);
          }
        } else {
          console.log('CSRF token déjà présent');
        }
      };
  
      getCsrfToken();
    }, []);
  
  return (
    null
  )
}

export default CsrfUtils
