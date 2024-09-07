// app/page.tsx (or your HomePage component file)
"use client"
import { FC } from 'react';
import Link from 'next/link';
import WalletConnect from './components/WalletConnect'; // Adjust the import path as needed

const HomePage: FC = () => {
  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Background animation will be handled by ThreeCanvas in layout.tsx */}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <WalletConnect />

        <h1 className="text-5xl font-extrabold mb-10 drop-shadow-lg">DAO Voting Program</h1>

        <div className="flex flex-col items-center space-y-6">
          <Link href="/proposal" className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
            Create Proposal
          </Link>
          <Link href="/voting" className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
            Vote
          </Link>
          <Link href="/results" className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
            Results
          </Link>
          <Link href="/rewards" className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
            Rewards
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
