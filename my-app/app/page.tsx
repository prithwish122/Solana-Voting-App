"use client";
import { FC, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';

gsap.registerPlugin(ScrollTrigger);

const HomePage: FC = () => {
  useEffect(() => {
    // GSAP drop effect for hero text
    const dropTextAnimation = (element: string, text: string, delay: number) => {
      const textArray = text.split('');
      const elementNode = document.querySelector(element) as HTMLElement;
      let htmlContent = textArray.map((letter, i) => `<span class="drop-letter" style="opacity: 0;">${letter}</span>`).join('');
      elementNode.innerHTML = htmlContent;

      gsap.fromTo(
        '.drop-letter',
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          stagger: 0.05, // Adjust this for the speed of the drop
          ease: 'bounce.out'
        }
      );
    };

    dropTextAnimation('.drop-heading', 'Welcome to the DAO Voting Program', 0.5);
    dropTextAnimation('.drop-subheading', 'Participate in governance and shape the future with your vote!', 1);

    // GSAP animations for buttons when hero text is in view
    gsap.fromTo(
      '.button',
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.hero-text',
          start: 'top 75%',
        },
      }
    );
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9d9875119512883.60b757ed32e4a.gif)',
      }}
    >
      {/* Include the Navbar component */}
      <Navbar />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center bg-transparent">
        <div className="container mx-auto p-4">
          {/* Hero Section */}
          <div className="hero-text text-center mb-12 p-28">
            <h5 className="drop-heading text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></h5>
            <h1 className="p-10 drop-subheading text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></h1>
          </div>

          {/* Buttons in a row, same size and moved up */}
          <div className="flex flex-wrap gap-4 justify-center mt-[-2rem]"> {/* Adjust mt-[-2rem] for vertical positioning */}
            <Link href="/proposal" passHref>
              <div className="button text-lg text-white hover:text-white hover:font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-6 py-3 rounded-md transition-transform transform hover:scale-105 hover:bg-gradient-to-l hover:from-green-500 hover:via-blue-600 hover:to-purple-700 w-48 h-14 flex items-center justify-center">
                Create Proposal
              </div>
            </Link>
            <Link href="/results" passHref>
              <div className="button text-lg text-white hover:text-white hover:font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-6 py-3 rounded-md transition-transform transform hover:scale-105 hover:bg-gradient-to-l hover:from-green-500 hover:via-blue-600 hover:to-purple-700 w-48 h-14 flex items-center justify-center">
                Results
              </div>
            </Link>
            <Link href="/voting" passHref>
              <div className="button text-lg text-white hover:text-white hover:font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-6 py-3 rounded-md transition-transform transform hover:scale-105 hover:bg-gradient-to-l hover:from-green-500 hover:via-blue-600 hover:to-purple-700 w-48 h-14 flex items-center justify-center">
                Vote
              </div>
            </Link>
            <Link href="/rewards" passHref>
              <div className="button text-lg text-white hover:text-white hover:font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-6 py-3 rounded-md transition-transform transform hover:scale-105 hover:bg-gradient-to-l hover:from-green-500 hover:via-blue-600 hover:to-purple-700 w-48 h-14 flex items-center justify-center">
                Rewards
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
