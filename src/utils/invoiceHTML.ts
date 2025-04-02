import { IInvoice } from "@/models/invoiceModel"
import { currencies } from "./currency"

export const getInvoiceHTML = (InvoiceData : IInvoice) =>{
  const {invoiceNumber, date, dueDate, client, items, subtotal, taxAmount, taxRate, totalAmount, notes, status, currency} = InvoiceData
  console.log(currency);
  
  console.log(currencies.find((_,code)=>code === currency));

    const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <header class="flex justify-between items-center border-b pb-4">
            <h1 class="text-3xl font-bold">Invoice</h1>
            <div class="text-right">
                <p class="text-gray-600">Invoice #: <span class="font-semibold">${InvoiceData.invoiceNumber}</span></p>
                <p class="text-gray-600">Date: <span class="font-semibold">${InvoiceData.date}</span></p>
                <p class="text-gray-600">Due Date: <span class="font-semibold">${InvoiceData.dueDate}</span></p>
            </div>
        </header>

        <section class="mt-6">
            <h2 class="text-lg font-semibold">Bill To:</h2>
            <p class="text-gray-700">${client.name}</p>
            <p class="text-gray-700">${client.email}</p>
            <p class="text-gray-700">${client.address}</p>
        </section>

        <table class="w-full mt-6 border-collapse border border-gray-300">
            <thead class="bg-gray-200">
                <tr>
                    <th class="border p-2 text-left">Description</th>
                    <th class="border p-2 text-center">Quantity</th>
                    <th class="border p-2 text-right">Unit Price</th>
                    <th class="border p-2 text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr>
                    <td class="border p-2">${item.description}</td>
                    <td class="border p-2 text-center">${item.quantity}</td>
                    <td class="border p-2 text-right">${item.unitPrice}</td>
                    <td class="border p-2 text-right">${item.total}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="mt-6 text-right">
            <p>Subtotal: <span class="font-semibold">${subtotal}</span></p>
            <p>Tax (${taxRate}%): <span class="font-semibold">${taxAmount}</span></p>
            <p class="text-xl font-bold">Total: ${currencies[currency].code} ${totalAmount}</p>
        </div>

        <footer class="mt-6 border-t pt-4 text-gray-600">
            <p>Status: <span class="font-semibold">${status}</span></p>
            <p class="mt-2">${notes}</p>
        </footer>
    </div>
</body>
</html>
`
return invoiceHtml 
}
