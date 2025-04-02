'use client'
import Navbar from '@/Components/Navbar/Navbar';
import { IInvoice } from '@/models/invoiceModel';
import { formatDate } from '@/utils/formatDate';
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Footer from '@/Components/Footer/Footer';
import { generatePdf } from '@/utils/generatePdf';
import { BarLoader, MoonLoader } from 'react-spinners';
const InvoiceDetails = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);
  const [invoice, setInvoice] = useState<IInvoice>()
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pathParam = window.location.pathname.split('/');
    const id = pathParam[pathParam.length - 1]
    setInvoiceId(id)
  }, [])

  useEffect(() => {
    const fetchInvoice = async () => {
      setPageLoading(true);
      try {
        const response = await fetch(`/api/getInvoice`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ invoiceId: invoiceId })
        })
        const data = await response.json();
        if (response.ok) {
          setInvoice(data.invoice)
          setNewStatus(data.invoice.status)
        }
      } catch (error) {
        console.log(error);
        return (<>No Invoice found!</>)
      } finally {
        setPageLoading(false);
      }
    }
    fetchInvoice();
  }, [invoiceId])

  const updateInvoiceStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/updateInvoiceStatus`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoiceId, status: newStatus })
      })
      const data = await response.json();
      generatePdf(data.invoice)
      router.push('/')
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        {
          pageLoading ? <MoonLoader color="#16e7c0" /> : 
          invoice &&
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Invoice Details</h2>
            <div className="mb-4">
              <p className="text-lg font-semibold">Invoice Number: <span className="text-gray-700">{invoice?.invoiceNumber}</span></p>
              <p>Date: <span className="text-gray-700">{formatDate(invoice?.date.toString())}</span></p>
              {
                <p>{invoice.status === 'paid' ? "Paid Date" : "Due Date"}: <span className="text-gray-700">{formatDate(invoice.status === 'paid' ? invoice?.paidDate?.toString() : invoice?.dueDate.toString())}</span></p>
              }
              <form>
                <label htmlFor='status'>{invoice.status}</label>
                <select id='status' className="w-full mt-2 p-2 border border-gray-300 rounded-lg" name="status" value={newStatus} onChange={(e) => { setNewStatus(e.target.value) }}>
                  <option value="paid">paid</option>
                  <option value="pending">pending</option>
                  <option value="overdue">overdue</option>
                </select>

              </form>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Client Details</h3>
              <p>Name: <span className="text-gray-700">{invoice?.client.name}</span></p>
              <p>Email: <span className="text-gray-700">{invoice?.client.email}</span></p>
              <p>Address: <span className="text-gray-700">{invoice?.client.address}</span></p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Invoice Items</h3>
              <div className="border border-gray-300 rounded-lg p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-center">Quantity</th>
                      <th className="p-2 text-right">Unit Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice && invoice?.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-2 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {
              invoice &&
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
                <p>Subtotal: <span className="text-gray-700">${invoice?.subtotal.toFixed(2)}</span></p>
                <p>Tax Amount ({invoice?.taxRate}%): <span className="text-gray-700">${invoice?.taxAmount.toFixed(2)}</span></p>
                <p className="font-bold">Total Amount: <span className="text-green-600">${invoice?.totalAmount.toFixed(2)}</span></p>
              </div>
            }

            {invoice?.notes && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}

            <button
              onClick={() => { updateInvoiceStatus() }}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
              {loading ? <BarLoader color="#2a91c9" /> : "Print Invoice"}
            </button>
          </div>
        }
      </div>
      <Footer />
    </>
  );
};

export default InvoiceDetails;
