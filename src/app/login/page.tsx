'use client'
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
const Login = () => {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async(e : React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const body = {
        loginId,
        password
      }  

      const response = await fetch('/api/login',{
        method: 'POST',
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const result = await response.json();
      console.log(result);
      
      if(response.ok){
        router.push('/');
      }
    } catch (error : unknown) {
      console.log(error);
      setMessage('Login Failed')
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="login id (email or username)"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <div className='flex flex-row items-center'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          { showPassword ? <FaRegEye className='size-6 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}/> : <FaRegEyeSlash className='size-6 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}/>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            {loading ? <ClipLoader/> : "Login"}
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
