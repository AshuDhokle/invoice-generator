import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoiceModel";

export async function POST(req : NextRequest) {
  try {
    const { invoiceId } = await req.json(); 
    if (!invoiceId) {  
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }
    const invoice = await Invoice.findOne({_id: invoiceId})
    if(invoice)
      return NextResponse.json({message:'ok', invoice:invoice}, {status:200})
    
    return NextResponse.json({message:'Invoice not found'}, {status:404})
  } catch (error) {
    console.log(error);
    return NextResponse.json({message:'Internal server error'}, {status:500})
  }  
}