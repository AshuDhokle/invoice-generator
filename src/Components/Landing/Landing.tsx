import { useRouter } from 'next/navigation'
import React from 'react'

const Landing = () => {
  const router = useRouter();
  return (
    <div className='p-20 '>
        <h1 className='text-8xl font-bold'>Free Invoice Generator</h1>
        <h2 className='mt-20 text-5xl text-green-400 m-2'>Make Invoices with one click!</h2>
        <p className='mt-2 text-xl text-gray-600 lg:w-[70%] m-2'>Welcome to the original Invoice Generator, trusted by millions of people. Invoice Generator lets you instantly make Invoices with our attractive invoice template straight from your web browser. The Invoices you make can be sent and paid online or downloaded as a PDF.</p>
        <button onClick={()=>router.push('/generate-invoice')}
         className='m-10 p-2 px-4 border-2 border-green-400 rounded-lg hover:text-white hover:bg-green-400 shadow-2xl'>Get Started</button>
    </div>
  )
}

export default Landing