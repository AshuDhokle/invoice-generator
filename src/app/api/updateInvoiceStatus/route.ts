import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoiceModel";
import { connect } from "@/dbConfig/dbConfig";
connect();
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { invoiceId, status } = body;
  
      if (!invoiceId || !status) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
  
      // Fetch invoice from DB
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
      }
  
      let updatedFields: any = { status };
  
      if (status === "paid") {
        updatedFields.paidDate = new Date();
      } else if (status === "overdue") {
        const overDueAmount = invoice.totalAmount + invoice.totalAmount * 0.1;
        updatedFields.totalAmount = overDueAmount;
        updatedFields.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
      }
  
      // Update invoice
      const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, updatedFields, { new: true });
  
      return NextResponse.json({ message: "Invoice updated successfully", invoice: updatedInvoice }, { status: 200 });
    } catch (error) {
      console.error("Error updating invoice:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }