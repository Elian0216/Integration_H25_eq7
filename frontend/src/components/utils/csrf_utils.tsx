'use client'
import React from 'react'
import { useEffect } from 'react';
import Cookies from 'js-cookie';


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
    }, []); // Empty dependency array means run once on mount
  
  return (
    null
  )
}

export default CsrfUtils
