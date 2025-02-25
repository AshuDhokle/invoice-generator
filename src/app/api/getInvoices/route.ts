import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = await getDataFromToken(req);

        const user = await User.findOne({_id: userId})

        const invoices = user.invoices;

        return NextResponse.json({messge:'Invoices Found', invoices:invoices}, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'internal server error'},{status:500})
    }
}