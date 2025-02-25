import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    
    const isPublic = path === '/login' || path === '/signup' || path === '/';
    const token = req.cookies.get('token')?.value || '';
    
    if(isPublic && token){
       return NextResponse.redirect(new URL('/generate-invoice', req.nextUrl))
    } else if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
}

export const config ={
    matcher : [
        '/',
        '/login',
        '/signup',
        '/generate-invoice',
        '/profile'
    ]
}