import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
connect();
export async function POST() {
    try {
        const response = NextResponse.json({message:'Logged out successfully'}, {status:200})
        await response.cookies.set('token','',{httpOnly:true,expires: new Date(0)})
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal Server Error'}, {status:500})
    }
}