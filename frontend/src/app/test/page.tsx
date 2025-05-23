'use client'
import React from 'react'
import { Button } from '@/components/ui/button'


async function callTestApi() {
    try {
      const response = await fetch(process.env.API_PATH + 'test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
        },
        body: JSON.stringify({ key: 'value' }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(JSON.stringify(data));
      } else {
        console.error('API call failed');
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  }

/**
 * Page de test qui affiche un bouton "Test"
 * qui appelle l'API de test en POST.
 * 
 * C'est une page qui test la connexion entre le backend et le frontend. Non nécessaire en production.
 */
const page = () => {
  return (
    <div>
      <div className="flex justify-center h-screen items-center">
        <Button
          variant={'outline'}
          className='h-16 w-52 flex items-center justify-center'
          onClick={callTestApi}
        >
          Test
        </Button>
      </div>
    </div>
  )
}

export default page
