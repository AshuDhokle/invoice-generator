import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { sendMail } from "@/utils/mailer";
connect();
export async function POST(req: NextRequest) {
    try {
        const {username, email, password, confirmPassword} = await req.json();

        if(!email || !username || !password || !confirmPassword){
            return NextResponse.json({message:'Provide all details'}, {status:400});
        }

        const userName = username.split(" ").join("");

        if(password != confirmPassword){
            return NextResponse.json({message:'Check confirm password'}, {status:400});
        }

        const existingUser = await User.findOne({username: userName});
        
        if(existingUser){
           return  NextResponse.json({message:'Username already used'}, {status:409});
        }

        const existingEmail = await User.findOne({email: email});

        if(existingEmail){
            return NextResponse.json({message: 'Email already in use'});
        }

        const hashedPassword = await bcryptjs.hash(password, 8);

        const newUser = new User({
            username:userName,
            email,
            password:hashedPassword,
        })

        const user = await newUser.save();
        
        await sendMail({email: email, emailType: 'VERIFY', userId: user._id});
        
        return NextResponse.json({message:'Signup Successfull', user: user}, {status:200})
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal Server Error'}, {status:500})
    }
}