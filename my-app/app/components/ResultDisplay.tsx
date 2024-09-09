"use client";
import { useEffect, useState } from 'react';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json'; // Adjust this path to your IDL
import Navbar from './Navbar';

const ResultsDisplay = ({ proposalId }: { proposalId: string }) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { publicKey, connected } = useWallet();
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!connected || !publicKey) {
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
        const proposalAccount = await program.account.proposal.fetch(new PublicKey(proposalId));
        setResults(proposalAccount);
      } catch (err) {
        console.error('Failed to fetch proposal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [publicKey, connected, proposalId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9d9875119512883.60b757ed32e4a.gif)' }}>
      <Navbar />
      <div className="relative p-12 bg-white bg-opacity-50 rounded-lg shadow-xl max-w-2xl w-full backdrop-blur-md border border-gray-200">
        {loading ? (
          <p className="text-gray-700 text-lg text-center">Loading results...</p>
        ) : results ? (
          <div>
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">{results.title}</h3>
            <p className="text-gray-700 text-xl mb-4 text-center">Total Votes: <span className="font-semibold">{results.totalVotes}</span></p>
            <div className="space-y-4">
              {results.options.map((option: { name: string; voteCount: number }, index: number) => (
                <div key={index} className="flex justify-between bg-gray-200 p-4 rounded-lg shadow-sm">
                  <span className="font-semibold text-lg">{option.name}</span>
                  <span className="text-lg">{option.voteCount}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-lg text-center">No results available.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
