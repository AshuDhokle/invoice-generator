'use client'
import React, { useEffect, useState } from 'react';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        if(token){
        if(password != confirmPassword){
            console.log('check confirm password');
        }

        const response = await fetch('/api/resetPassword',{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({token, password, confirmPassword})
        })

        if(response.ok){
          setResetDone(true)
        }
        }else {
            throw new Error('Token not found')
        }

    } catch (error) {
        console.log(error);
        setMessage('Reset Password Failed')
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const tk = window.location.search.split('=')[1]
    setToken(tk);
  },[])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        {
          resetDone ? <div> 
            <h1>Password Reset Successfully</h1> 
            <p>close this window, logout and login again</p>
            </div>
            :

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center relative">
        <h2 className="text-2xl font-bold text-green-600">Reset Password</h2>
        <p className="text-gray-600 mb-4">Enter your new password below</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
      }
    </div>
  );
};

export default ResetPassword;
