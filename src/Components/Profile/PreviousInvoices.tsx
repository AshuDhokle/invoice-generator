'use client'
import React, { useEffect, useState } from 'react'
import Invoice from './Invoice';
const PreviousInvoices = () => {

    const [invoices, setInvoices] = useState<string[]>([]);
    
    const getInvoices = async() => {
      try {
        const response = await fetch('/api/getInvoices',{
          method: 'GET',
          headers:{'Content-type' : 'application/json'},
        })

        const result = await response.json();

        if(response.ok){
          console.log(result);
          setInvoices(result.invoices)
        }
      } catch (error) {
        console.log(error);
      } finally {

      } 
    }
    
    useEffect(()=>{
      getInvoices(); 
    },[])

      return (
        <div className=" w-[100%] p-6">
          <div>
            <h3 className="text-xl font-semibold mt-6 text-green-600">Previous Invoices</h3>
            <ul className="mt-4 space-y-2 text-left">
              {invoices && invoices.map((invoice) => (
                <Invoice key={invoice} invoiceId={invoice}/>
              ))}
            </ul>
          </div>
        </div>
      ); 
}

export default PreviousInvoices