import { getInvoiceHTML } from "./invoiceHTML";
import toast from "react-hot-toast";
export const generatePdf = async (Invoice: any) => {
  const url = 'https://yakpdf.p.rapidapi.com/pdf';
const options = {
  method: 'POST',
  headers: {
    'x-rapidapi-key': '65678eeabamsh5e85a0f267aa77ep1dcce1jsne84310329fb0',
    'x-rapidapi-host': 'yakpdf.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source: {
      html: getInvoiceHTML(Invoice)
    },
    pdf: {
      format: 'A4',
      scale: 1,
      printBackground: true
    },
    wait: {
      for: 'navigation',
      waitUntil: 'load',
      timeout: 2500
    }
  })
};

try {
	const response = await fetch(url, options);
	const result = await response.blob();
  const pdfURL = URL.createObjectURL(result);
  const a = document.createElement('a');
  a.href = pdfURL;
  a.download = `invoice_${Invoice.invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click()
  document.body.removeChild(a);
  URL.revokeObjectURL(pdfURL);
	toast.success('Pdf downloaded');
} catch (error) {
	console.error(error);
}
}


