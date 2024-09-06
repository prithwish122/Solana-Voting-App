"use client"
import { useEffect, useState } from 'react';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json'; // Adjust this path to your IDL

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
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      {results ? (
        <div>
          <h3 className="text-2xl font-bold mb-4">Results for {results.title}</h3>
          <p className="text-gray-700 mb-2">Total Votes: {results.totalVotes}</p>
          <div className="space-y-2">
            {results.options.map((option: { name: string; voteCount: number }, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium">{option.name}</span>
                <span>{option.voteCount}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-700">Loading results...</p>
      )}
    </div>
  );
};

export default ResultsDisplay;
