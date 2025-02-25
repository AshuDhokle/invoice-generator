'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React from 'react'
const Navbar = () => {
  const router = useRouter();

  const handleLogout = async()=>{
    try {
      const response = await fetch('/api/logout',{
        method:'POST',
        headers:{'Content-Type':'application/Json'},
      })
      
      if(response.ok){
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-row items-center justify-between border-b-2 border-green-500'>
        <h1 className='m-2 text-3xl text-green-500 font-bold cursor-pointer'>Invocify</h1>
        <div>
          <button onClick={handleLogout} className='m-2'>Logout</button>
          <Link href={'/profile'} className='m-2'>Profile</Link>
        </div>
    </div>
  )
}

export default Navbar