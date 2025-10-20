 
'use client';

import { useEffect, useState } from "react";
import React from 'react'
import Link from 'next/link';
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const NavigationBar = () => {


    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 100); // Trigger when scrollY > 10px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const  [isOpen, setIsOpen] = useState(false)





  return (

    <main className="">

      <div 
          className={`side-bar absolute backdrop-blur-lg z-50 shadow w-[100vw] h-[100vw] p-5 mb-[100vh]  duration00 left-0 top-0 transition-transform ${isOpen ? 'translate-y-0' : '-translate-y-full'} fixed`}
          style={{
            height: '100vh',
          }}
        >
          <div className='relative h-full flex flex-col gap-2'>
            
            {/* Logo and close button */}
            <div className='flex items-center justify-between'>
               <div className='font-bold text-2xl uppercase text-[#327cff] flex'>
                Caris <p className="font-bold text-[#1446e1] ">+</p>
              </div>


              {/* Close Button */}
              <div className=' bg-gray-100/20 p-1 rounded-lg w-fit cursor-pointer' onClick={() => setIsOpen(false)}>

                <IoMdClose className='text-3xl cursor-pointer'  size={20}/>
              </div>
            </div>
              

              {/* Nav links */}
            <ul className="flex flex-col justify-between gap-5 py-5 text-lg transition-all duration-1000 ease-in-out text-[#0d1321]">
              <li onClick={() => setIsOpen(!isOpen)}><a href="#home">Home</a></li>
              <li onClick={() => setIsOpen(!isOpen)}><a href="#services">Services</a></li>
              <li onClick={() => setIsOpen(!isOpen)}><a href="#doctors">Doctors</a></li>
              <li onClick={() => setIsOpen(!isOpen)}><a href="#about">About</a></li>
            </ul>



            {/* Schedule a meeting button */}
            <Link href='/signIn'>
              <button className='bg-[#1b5af5] text-white hover:bg-[#c5832b]  shadow transition-all duration-200 lg:px-7 px-4  py-4 md:rounded-xl rounded-lg lg:text-lg md:text-base sm:text-base text-[5vw] cursor-pointer w-full absolute bottom-10'>Sign In</button>
            </Link>
          </div>
        </div>


      {/* Main */}
      <div className="fixed z-10 w-full backdrop-blur-sm">
        <nav className=' w-[90%]  mx-auto flex justify-between items-center py-2'>
          {/* Logo */}
        <div className='font-bold text-2xl uppercase text-[#327cff] flex'>
            Caris <p className="font-bold text-[#1446e1] ">+</p>
          </div>

          {/* Navigation Links */}
          <div className='hidden md:flex  text-gray-900 text-lg'>
            <ul className='flex gap-8 font-medium [&_li]:cursor-pointer  '>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#doctors">Doctors</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#reviews">Reviews</a></li>
            </ul>

          </div>

          {/* Sign Up */}
          <Link href='/signIn'>
            <button className='hidden lg:block bg-[#1b5af5] hover:bg-[#59a1ff] text-white font-medium py-2 px-8 rounded-lg cursor-pointer'>
              Sign In
            </button>
          </Link>

          

          <div 
            className="md:block lg:hidden cursor-pointer transition-all duration-500 ease-in-out" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className="
                text-xl p-2 rounded-lg bg-white/10 shadow-md font-bold border border-white 
                hover:border-dashed hover:text-[#1739b6] hover:border-[#1739b6] hover:bg-white/20 
                transition-all duration-300 ease-in-out"
            >
              <CiMenuFries size={20} />
            </div>
          </div>


        </nav>
      </div>

    </main>
  )
}

export default NavigationBar