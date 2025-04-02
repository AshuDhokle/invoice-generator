import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import { sendMail } from "@/utils/mailer";
import jwt from 'jsonwebtoken';
export async function POST(req:NextRequest) {
    try {

        const {email} = await req.json();
        
        const token  = req.cookies.get('token')?.value || '';

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof decodedToken === 'string' || !('id' in decodedToken)) {
            throw new Error('Invalid token');
        }
        
        let userId = decodedToken.id;
        
        if(userId.length <= 0){
            const user = await User.findOne({email:email})
            userId = user?._id;    
        }
        
        await sendMail({email:email,emailType:"RESETPASSWORD",userId:userId});
        
        return NextResponse.json({
            messsage:'Reset Password Link Sent To Your Email',
            success:true
        },{status:202})

    } catch (error:unknown) {
        return NextResponse.json({
            error
        },{status:500})
    }
}