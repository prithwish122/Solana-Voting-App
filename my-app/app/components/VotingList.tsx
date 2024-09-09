"use client";
import { useEffect, useState } from 'react';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json'; // Adjust this path to your IDL
import Navbar from './Navbar'; // Ensure Navbar is properly imported

const VotingList = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    const fetchProposals = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      const connection = new Connection('https://api.devnet.solana.com/', 'confirmed');
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
        const proposalsData = await program.account.proposal.all();
        setProposals(proposalsData);
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [publicKey, connected]);

  const handleVote = async (proposalPublicKey: PublicKey, option: string) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const connection = new Connection('https://api.devnet.solana.com/', 'confirmed');
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

      // Assuming `vote` is the method in your smart contract
      await program.methods.vote(option)
        .accounts({
          proposal: proposalPublicKey,
          user: publicKey,
        })
        .rpc();
      
      alert('Vote submitted successfully!');
    } catch (err) {
      console.error('Failed to submit vote:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9d9875119512883.60b757ed32e4a.gif)' }}>
      <Navbar />
      <div className="relative p-12 bg-white bg-opacity-70 rounded-lg shadow-xl max-w-3xl w-full backdrop-blur-md border border-gray-200">
        {loading ? (
          <p className="text-gray-700 text-lg text-center">Loading proposals...</p>
        ) : proposals.length > 0 ? (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <div key={proposal.publicKey.toString()} className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">{proposal.account.title}</h3>
                <p className="text-gray-700 mb-6 text-center">{proposal.account.description}</p>
                <div className="space-y-4">
                  {proposal.account.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => handleVote(proposal.publicKey, option)}
                    >
                      Vote for {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black text-lg text-center">No proposals available</p>
        )}
      </div>
    </div>
  );
};

export default VotingList;
