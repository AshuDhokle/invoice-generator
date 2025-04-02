'use client'
import React, { useEffect, useState } from 'react';
import { IInvoice } from '@/models/invoiceModel';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import { currencies } from '@/utils/currency';
import { MoonLoader } from 'react-spinners';
const Invoice = ({ invoiceId }: { invoiceId: string }) => {
    const router = useRouter();
    const [invoice, setInvoice] = useState<IInvoice | null>(null);
    const [sectionLoading, setSectionLoading] = useState(false);
    const getInvoice = async () => {
        setSectionLoading(true);
        try {
            const response = await fetch(`/api/getInvoice`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ invoiceId })
            });

            const result = await response.json();

            if (response.ok) {
                setInvoice(result.invoice);
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
        } finally {
            setSectionLoading(false);
        }
    };

    useEffect(() => {
        getInvoice();
    }, [invoiceId]);

    return (
        <div
            onClick={() => router.push(`/InvoiceDetails/${invoiceId}`)}
            className='m-4 p-4 md:max-w-[60%] lg:max-w-[70%] bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 cursor-pointer'
        >
            {
                sectionLoading ? <MoonLoader color="#16e7c0" /> :
                    <div className='flex flex-col md:flex-row justify-between items-center border-b pb-3'>
                        <h1 className='text-gray-700 font-medium'>Date: <span className='text-gray-900'>{formatDate(invoice?.date?.toString() || '')}</span></h1>
                        <h1>Number: #{invoice?.invoiceNumber}</h1>
                        <h1 className='text-gray-700 font-medium'>Total: <span className='text-gray-900 font-semibold'>{invoice?.totalAmount} {invoice?.currency ? currencies[invoice.currency!]?.code : '$'}</span></h1>
                    </div>
            }
            <p className='text-gray-600 mt-3 px-2'>{invoice?.notes || 'No additional notes provided.'}</p>
        </div>
    );
};

export default Invoice;