'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
// import { getCookie } from '@/utils/cookie-utils'


async function callTestApi() {
    try {
      const response = await fetch('http://localhost/api/test/', {
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
