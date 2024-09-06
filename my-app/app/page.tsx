"use client"
import { FC } from 'react';
import Link from 'next/link';
import WalletConnect from './components/WalletConnect';

const HomePage: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <WalletConnect />
      <h1 className="text-3xl font-bold text-center mt-8">DAO Voting Program</h1>
      <div className="flex flex-col items-center mt-8 space-y-4">
        <Link href="/proposal" className="bg-blue-500 text-white p-4 rounded w-64 text-center">
          Create Proposal
        </Link>
        <Link href="/voting" className="bg-blue-500 text-white p-4 rounded w-64 text-center">
          Vote
        </Link>
        <Link href="/results" className="bg-blue-500 text-white p-4 rounded w-64 text-center">
          Results
        </Link>
        <Link href="/rewards" className="bg-blue-500 text-white p-4 rounded w-64 text-center">
          Rewards
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
