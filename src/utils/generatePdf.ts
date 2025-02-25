import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { currencies } from "./currency";

export const generatePDF = (InvoiceDetails: any): void => {
  const doc = new jsPDF();

  // Set Custom Font and Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 128, 0);
  doc.text("Invoice Details", 14, 20);

  // Invoice Number & Date - Bordered Box
  doc.setDrawColor(0, 128, 0);
  doc.roundedRect(12, 25, 90, 20, 2, 2);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice Number: ${InvoiceDetails.invoiceNumber}`, 16, 32);
  doc.text(`Date: ${InvoiceDetails.date}`, 16, 38);

  // Status - Green Box Below Invoice Number
  doc.setFillColor(0, 200, 0);
  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "bold");
  doc.roundedRect(12, 47, 90, 10, 2, 2, "F");
  doc.text(`${InvoiceDetails.status.toUpperCase()}`, 16, 54);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Client Details - Box
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(12, 60, 180, 30, 3, 3);
  doc.setTextColor(0, 128, 0);
  doc.setFontSize(14);
  doc.text("Client Details", 14, 68);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Name: ${InvoiceDetails.client.name}`, 14, 76);
  doc.text(`Email: ${InvoiceDetails.client.email}`, 14, 82);
  doc.text(`Address: ${InvoiceDetails.client.address}`, 14, 88);

  // Invoice Items Table
  doc.setTextColor(0, 128, 0);
  doc.setFontSize(14);
  doc.text("Invoice Items", 14, 105);
  doc.setTextColor(0, 0, 0);
  autoTable(doc, {
    startY: 110,
    head: [["Description", "Quantity", "Unit Price", "Total"]],
    body: InvoiceDetails.items.map((item: any) => [
      { content: item.description, styles: { halign: "left" } },
      { content: item.quantity.toString(), styles: { halign: "center" } },
      { content: `${currencies[InvoiceDetails.currency].symbol}${item.unitPrice}`, styles: { halign: "center" } },
      { content: `${currencies[InvoiceDetails.currency].symbol}${item.total}`, styles: { halign: "center" } }
    ]),
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 5 },
    headStyles: { fillColor: [100, 200, 100], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  let finalY = (doc as any).lastAutoTable.finalY || 120;

  // Summary - Box
  // Summary - Styled Box with Better Layout
doc.setDrawColor(200, 200, 200);
doc.roundedRect(12, finalY + 10, 180, 35, 3, 3);
doc.setTextColor(0, 128, 0);
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Summary", 14, finalY + 18);

// Subtotal and Tax - Properly aligned
doc.setFont("helvetica", "normal");
doc.setTextColor(0, 0, 0);
doc.setFontSize(12);
doc.text(`Subtotal:`, 14, finalY + 26);
doc.text(`${currencies[InvoiceDetails.currency].symbol}${InvoiceDetails.subtotal.toFixed(2)}`, 170, finalY + 26, { align: "right" });

doc.text(`Tax (${InvoiceDetails.taxRate}%):`, 14, finalY + 32);
doc.text(`${currencies[InvoiceDetails.currency].symbol}${InvoiceDetails.taxAmount.toFixed(2)}`, 170, finalY + 32, { align: "right" });

// Add margin before Total Section
let totalSectionY = finalY + 50;

// Total - Styled with Green Background
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setDrawColor(0, 200, 0);
doc.setFillColor(240, 255, 240); // Light green background
doc.roundedRect(12, totalSectionY, 180, 14, 3, 3, "FD");

doc.setTextColor(0, 128, 0);
doc.text(
  `Total:`,
  14,
  totalSectionY + 10
);
doc.text(
  `${currencies[InvoiceDetails.currency].symbol}${InvoiceDetails.totalAmount.toFixed(2)}`,
  170,
  totalSectionY + 10,
  { align: "right" }
);

// Notes Section Styling
if (InvoiceDetails.notes) {
  doc.setTextColor(0, 128, 0);
  doc.setFontSize(14);
  doc.text("Notes", 14, totalSectionY + 25);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(InvoiceDetails.notes, 14, totalSectionY + 35);
}

  // Save the PDF
  doc.save(`invoice_${InvoiceDetails.invoiceNumber}.pdf`);
};


