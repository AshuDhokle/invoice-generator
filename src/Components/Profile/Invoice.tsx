'use client'
import React, { useEffect, useState } from 'react'
import {IInvoice} from '@/models/invoiceModel';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
const Invoice = ({invoiceId } : {invoiceId : string}) => {
    const router = useRouter()
    const [invoice, setInvoice] = useState<IInvoice | null>(null);
     
    const getInvoice = async()=>{
       try {
        const response = await fetch(`/api/getInvoice`,{
            method:'POST',
            headers:{'Content-type':'application/json'},
            body: JSON.stringify({invoiceId:invoiceId})
       })

       const result = await response.json();

       if(response.ok){
        setInvoice(result.invoice)
       }
       } catch (error) {
         console.log(error);
       }
    }

    useEffect(()=>{
       getInvoice()
    },[invoiceId])
    
  return (
    <div onClick={()=>router.push(`/InvoiceDetails/${invoiceId}`)} className='m-4 shadow-2xl p-2 md:max-w-[60%] lg:max-w-[40%] cursor-pointer'>
      <div className='flex flex-row'>
        <h1 className='m-2'><span className='font-medium'>Date</span> : {formatDate(invoice?.date.toString())}</h1>
        <h1 className='m-2'><span className='font-medium'>Total Amount</span> : {invoice?.totalAmount} $</h1>
      </div>
      <h1 className='text-gray-700 mx-6'>{invoice?.notes}</h1>
    </div>
  )
}

export default Invoice