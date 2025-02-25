'use client'
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true)

      const body = {
        email,
        username,
        password,
        confirmPassword
      }

      const response = await fetch('/api/signup',{
        method:'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const result = await response.json();
      
      if(response.ok){
        router.push('/login');
      }
    } catch (error : any) {
      console.log(error);
      setMessage(error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <div className=' flex flex-row items-center'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {showPassword ? <FaRegEye className='size-6 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}/> : <FaRegEyeSlash className='size-6 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}/>}
          </div>
          <div className=' flex flex-row items-center'>
          <input
            type={showCnfPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {showCnfPassword ? <FaRegEye className='size-6 cursor-pointer' onClick={()=>setShowCnfPassword(!showCnfPassword)}/> : <FaRegEyeSlash className='size-6 cursor-pointer' onClick={()=>setShowCnfPassword(!showCnfPassword)}/> }
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            {loading ? <ClipLoader/> : "Sign Up"}
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
