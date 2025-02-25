import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request:NextRequest) {
    try {
        const body = await request.json();
        const {token} = body;
        
        const user = await User.findOne({
            verifyEmailToken:token,
            verifyEmailDeadline:{$gt:Date.now()}
        })
        
        if(!user){
            return NextResponse.json({
                error:'Invalid Token',
                success:false,
            },{status:404})
        }

        user.isVerified = true;
        user.verifyEmailToken = undefined;
        user.verifyEmailDeadline = undefined;

        await user.save();

        return NextResponse.json({
            message:'Email verified successfully',
            success:true,
        },{status:202})

    } catch (error:any) {
       return NextResponse.json({
        error:error.message,
       },{status:500})   
    }
}