import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
connect();

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value || '';
        
        const decodedToken :any = jwt.verify(token, process.env.JWT_SECRET!);

        const userId = decodedToken.id;

        const user = await User.findOne({_id:userId}).select('-password')
       
        if(!user){
            return NextResponse.json({message:'User not found'}, {status:404})
        }

        return NextResponse.json({message:'User found', user : user}, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal server Error'}, {status:500})
    }
}