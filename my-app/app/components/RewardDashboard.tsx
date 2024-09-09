"use client";
import { useEffect, useState } from 'react';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json'; // Adjust this path to your IDL
import Navbar from './Navbar'; // Ensure Navbar is properly imported

const RewardDashboard = () => {
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    const fetchRewards = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, {
        signTransaction: async (transaction) => {
          if (!publicKey) throw new Error('Wallet not connected');
          return window.solana.signTransaction(transaction); // Adapt based on your wallet
        },
        signAllTransactions: async (transactions) => {
          if (!publicKey) throw new Error('Wallet not connected');
          return window.solana.signAllTransactions(transactions); // Adapt based on your wallet
        },
        publicKey,
      }, { commitment: 'confirmed' });
      
      const programId = new PublicKey('9qkB1pcntVosURAYkTzKznGM2KuGJR5A2PmXZyBrWir1'); // Replace with your program ID
      const program = new Program(idl as Idl, programId, provider);

      try {
        const userRewards = await program.account.userRewards.fetch(publicKey);
        setRewardPoints(userRewards.points.toNumber()); // Assuming points is a BigNumber
      } catch (err) {
        console.error('Failed to fetch rewards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [publicKey, connected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9d9875119512883.60b757ed32e4a.gif)' }}>
      <Navbar />
      <div className="relative p-12 bg-white bg-opacity-80 rounded-lg shadow-lg max-w-lg w-full backdrop-blur-md border border-gray-200">
        <h3 className="text-3xl font-bold mb-4 text-center text-gray-800">My Reward Points</h3>
        {loading ? (
          <p className="text-gray-700 text-lg text-center">Loading...</p>
        ) : (
          <p className="text-gray-700 text-lg text-center">Total Points: {rewardPoints}</p>
        )}
      </div>
    </div>
  );
};

export default RewardDashboard;
