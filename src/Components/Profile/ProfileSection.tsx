'use client'
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ProfileSection  = ({ user }: { user:any }) => {
  const sendResetPasswordToken = async()=>{
    try {
      const response = await fetch('/api/sendResetPasswordToken',{
        method:'POST',
        headers:{'content':'Application/json'},
        body: JSON.stringify({email: user.email})
      })   
      if(response.ok){
        toast.success('Token send to you email')
      }    
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');  
    }
  }
  
  
  return (
    <>
    <Toaster/>
     {
        user && 
        <div className="flex m-4 items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-2xl font-bold text-green-600">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-4">
              <button onClick={sendResetPasswordToken}
                className="w-full m-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Reset Password
              </button>
            </div>
          </div>
         
        </div>
     }
    </>
    );
}

export default ProfileSection;
