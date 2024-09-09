// // components/Navbar.tsx
// "use client";
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import React from 'react';

// const Navbar: React.FC = () => {
//   return (
//     <nav className="bg-transparent fixed w-full top-0 left-0 flex items-center justify-between p-4 shadow-none z-20">
//       <div className="flex items-center">
//         {/* <img src="/path-to-your-logo.png" alt="Logo" className="h-10 w-auto" /> */}
//         <span className="text-2xl font-semibold ml-2 text-white">LOGO</span>
//       </div>
//       <div className="flex items-center ">
//         <WalletMultiButton 
//           className="bg-transparent text-white border border-white py-2 px-4 rounded hover:bg-white hover:text-black transition duration-300"
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// components/Navbar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; // Ensure this import is correct

const LogoSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M12 22l10-5V7l-10 5-10-5v10l10 5z" />
  </svg>
);

const Navbar: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Fonts
    const loadGoogleFonts = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;600&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };

    loadGoogleFonts();

    // GSAP animations
    gsap.fromTo(
      '.navbar',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );

    gsap.fromTo(
      '.navbar-logo',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'bounce.out' }
    );

    gsap.fromTo(
      '.connect-button',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.5 }
    );

    gsap.fromTo(
      '.claim-button',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.7 }
    );
  }, []);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access or there was an error");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask extension.");
    }
  };

  const handleClaimPrize = () => {
    alert('Prize claimed successfully!'); // Replace this with actual logic for claiming the prize
  };

  return (
    <nav className="navbar bg-transparent fixed w-full top-0 left-0 p-4 shadow-none flex items-center justify-between z-20">
      <Link href="/" className="navbar-logo flex items-center">
        {/* <LogoSVG /> */}
        <span
          className="ml-3 text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-500 to-purple-700"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          LOGO
        </span>
      </Link>
      <div className="flex items-center gap-4">
        
          <WalletMultiButton
            className="connect-button bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:bg-violet-500 hover:scale-105"
            style={{ fontFamily: 'Poppins, sans-serif' }} />

        
      </div>
    </nav>
  );
};

export default Navbar;
