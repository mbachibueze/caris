'use client'


import React from 'react'
import { useEffect, useState } from 'react';

import { FaAngleUp } from "react-icons/fa6";


const ScrollToTop = () => {

  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 200px
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  return (
    <div>
      <div 
        onClick={scrollToTop}
        className={`bg-white fixed shadow p-2 rounded-lg w-fit text-black  bottom-5 right-5 z-50 cursor-pointer hover:bg-gray-100 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        aria-label="Scroll to top"
        >
        <FaAngleUp />
      </div>
    </div>
  )
}

export default ScrollToTop