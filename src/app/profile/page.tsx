'use client'
import Footer from '@/Components/Footer/Footer'
import Navbar from '@/Components/Navbar/Navbar'
import PreviousInvoices from '@/Components/Profile/PreviousInvoices'
import ProfileSection from '@/Components/Profile/ProfileSection'
import { IUser } from '@/models/userModel'
import React, {useState, useEffect} from 'react'

const Profile = () => {
  const [user, setUser] = useState<IUser | null>();
  const getUser = async()=>{
    try {
        const response = await fetch('/api/getUser',{
            method:'GET',
            headers: { "Content-Type": "application/json" },
        })
        
        const data = await response.json();
        
        if(response.ok){
            setUser(data.user);
        }
    } catch (error) {
        console.log(error);
    }
  }  
  
  useEffect(()=>{
    getUser()
  },[])

  return (
    <div className=''>
        <Navbar/>
        <div className='flex flex-col items-start justify-center'>
        <ProfileSection user = {user}/>
        <PreviousInvoices/>
        </div>
        <Footer/>
    </div>
  )
}

export default Profile