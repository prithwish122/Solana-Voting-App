"use client"
import { useEffect, useState } from 'react';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json'; // Adjust this path to your IDL

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
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold mb-4">My Reward Points</h3>
    <p className="text-gray-700">Total Points: {rewardPoints}</p>
  </div>
  );
};

export default RewardDashboard;
