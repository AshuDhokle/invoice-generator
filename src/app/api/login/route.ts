import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();
export async function POST(req: NextRequest) {
    try {
        const {loginId, password} = await req.json();

        if(!loginId || !password){
            return NextResponse.json({message:'Provide all details'}, {status:400});
        }

        const userName = loginId.split(" ").join("");

        const existingUser = await User.findOne({username: userName});
    
        const existingEmail = await User.findOne({email: loginId});

        if(!existingEmail && !existingUser){
            return NextResponse.json({message: 'User not exists'}, {status:404});
        }
        let user;

        if(existingEmail){
            user = existingEmail
        }else {
            user = existingUser
        }
        
        const compare = await bcryptjs.compare(password, user.password);
        
        if(!compare){
            return NextResponse.json({message: 'Invalid credentials'}, {status:401})
        }
        
        const response = NextResponse.json({message:'Login Successfull', user: user}, {status:200})
        
        const tokenData = {
            id:user._id,
            email: user.email,
            username : user.username,
        }
        
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!,{expiresIn:'1d'})
        
        response.cookies.set('token', token,{
            httpOnly: true,
        });

        return response 
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal Server Error'}, {status:500})
    }
}