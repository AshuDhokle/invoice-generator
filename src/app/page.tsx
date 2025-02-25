'use client'
import Footer from "@/Components/Footer/Footer";
import Landing from "@/Components/Landing/Landing";
import Navbar from "@/Components/Navbar/Navbar";
import React from "react";

export default function Home() {
  return (
    <div className="">
      <Navbar/>
      <Landing/>
      <Footer/>   
    </div>
  );
}
