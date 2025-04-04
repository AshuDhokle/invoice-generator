import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Invoice from "@/models/invoiceModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/utils/getDataFromToken";
connect();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
      
        const newInvoice = new Invoice(body.InvoiceDetails)

        const savedInvoice = await newInvoice.save();
        
        const userId = await getDataFromToken(req);
        
        await User.findOneAndUpdate({_id:userId},{
            $push:{invoices:savedInvoice}
        })
        
        return NextResponse.json({message:'Ok', invoice : savedInvoice}, {status:200})
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({message:'Internal Server Error'},{status:500})
    }
}