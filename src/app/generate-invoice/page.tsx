'use client'
import React, {useState} from 'react'
import Navbar from '@/Components/Navbar/Navbar'
import toast,{ Toaster } from 'react-hot-toast';
import { generatePDF } from '@/utils/generatePdf';
import {currencies} from "@/utils/currency";
import Footer from '@/Components/Footer/Footer';
const GenerateInvoice = ()=>{ 
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [client, setClient] = useState({ name: "", email: "", address: "" });
  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState(0);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (updatedItems: any[]) => {
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTaxAmount = (newSubtotal * taxRate) / 100;
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotalAmount(newSubtotal + newTaxAmount);
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const InvoiceDetails = {
        invoiceNumber,
        date : Date.now(),
        dueDate,
        client,
        items,
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        status,
        notes,
        currency
      }

      const response = await fetch('/api/generateInvoice',{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({InvoiceDetails}),
      })

      const result = await response.json();
   
      if(response.ok){
        console.log(`Invoice Generated : ${result}`);
        toast.success('Invoice Generated')
        generatePDF(InvoiceDetails);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }

  };
  
  

  return (
    <>
    <Navbar/>
    <Toaster/>
    <div className="flex  justify-center min-h-screen bg-gray-100 p-6">
    
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Generate Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
  
          <div>
          <label htmlFor='due-date'>Due Date</label>
          <input type="date" id='due-date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Client Details</h3>
          <input type="text" placeholder="Name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
          <input type="email" placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
          <input type="text" placeholder="Address" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
          <h3 className="text-lg font-semibold text-gray-700">Invoice Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
              <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-20 px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
              <div className='flex flex-row items-center'>
              <input type="number" min="0" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} className="w-24 px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
              <span>{currencies[currency].symbol}</span>
              </div>
              <span className="w-24 px-4 py-2 border rounded-lg text-gray-700">{currencies[currency].symbol}{item.total.toFixed(2)}</span>
              <button type="button" onClick={() => removeItem(index)} className="text-red-500">&times;</button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-green-600">+ Add Item</button>
          <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
          <p>Subtotal: {currencies[currency].symbol}{subtotal.toFixed(2)}</p>
          <input type="number" min="0" placeholder="Tax Rate (%)" value={taxRate} onChange={(e) => { setTaxRate(parseFloat(e.target.value)); calculateTotals(items); }} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none" />
          <p>Tax Amount: {currencies[currency].symbol}{taxAmount.toFixed(2)}</p>
          <p>Total Amount: {currencies[currency].symbol}{totalAmount.toFixed(2)}</p>
          <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-green-400 focus:outline-none"></textarea>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">Generate Invoice</button>
        </form>
      </div>
      <div className="p-4">
      <label className="block text-sm font-medium mb-2">Select Currency:</label>
      <select
        className="border border-gray-300 rounded-lg p-2 w-full"
        value={currency}
        onChange={(e)=>setCurrency(parseInt(e.target.value))} /*set the index of the selected currency*/
      >
        {currencies.map((currency, idx) => (
          <option key={currency.symbol} value={currency.index}>
            {currency.code} ({currency.symbol})
          </option>
        ))}
      </select>
      <p className="mt-2 text-gray-700">
        Selected Currency: <strong>{currencies[currency].symbol}</strong>
      </p>
    </div>
    </div>
    <Footer/>
    </>
  );
};



export default GenerateInvoice