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
            
            const response = await fetch(process.env.API_PATH + 'csrf/', { method: 'GET' });
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération du CSRF token');
            }
            const data = await response.json();
            // console.log(data);
            // Cookies.set('csrftoken', data.csrfToken);

            console.log('CSRF token trouvé, cookie envoyé :', data.csrfToken);
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
