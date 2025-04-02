'use client'
import React, { useState, useEffect } from 'react';
import Invoice from './Invoice';
import { MoonLoader } from 'react-spinners';
const PreviousInvoices = () => {
  const [invoices, setInvoices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionLoading, setSectionLoading] = useState(false);
  const invoicesPerPage = 4;

  const getInvoices = async () => {
    setSectionLoading(true);
    try {
      const response = await fetch('/api/getInvoices', {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
      });

      const result = await response.json();
      if (response.ok) {
        setInvoices(result.invoices);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSectionLoading(false);
    }

  };

  useEffect(() => {
    getInvoices();
  }, []);

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  return (
    <div className="w-[100%] p-6">
      <h3 className="text-xl font-semibold mt-6 text-green-600">Previous Invoices</h3>
      {
        sectionLoading ? <MoonLoader color="#16e7c0" /> :
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            <ul className="mt-4 space-y-2 text-left">
              {currentInvoices.map((invoice) => (
                <Invoice key={invoice} invoiceId={invoice} />
              ))}
            </ul>
          </div>
      }
      <div className="flex justify-center mt-6 space-x-2">
        <button
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-4 py-2 border rounded-lg ${currentPage === i + 1 ? 'bg-green-600 text-white' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PreviousInvoices;