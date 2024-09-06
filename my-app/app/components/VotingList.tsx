"use client"
import { useEffect, useState } from 'react';
import { AnchorProvider, Program , Idl} from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json'; // Adjust this path to your IDL

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
      
      const programId = new PublicKey('YOUR_PROGRAM_ID'); // Replace with your program ID
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
    // <div>
    //   {loading ? (
    //     <p>Loading proposals...</p>
    //   ) : proposals.length > 0 ? (
    //     proposals.map((proposal) => (
    //       <div key={proposal.publicKey.toString()} className="proposal-card">
    //         <h3>{proposal.account.title}</h3>
    //         <p>{proposal.account.description}</p>
    //         <div>
    //           {proposal.account.options.map((option: string, index: number) => (
    //             <button key={index} className="btn-primary" onClick={() => handleVote(proposal.publicKey, option)}>
    //               Vote for {option}
    //             </button>
    //           ))}
    //         </div>
    //       </div>
    //     ))
    //   ) : (
    //     <p>No proposals found.</p>
    //   )}
    // </div>


    <div className="space-y-4">
      {proposals.length > 0 ? (
        proposals.map((proposal) => (
          <div key={proposal.publicKey.toString()} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{proposal.account.title}</h3>
            <p className="text-gray-700 mb-4">{proposal.account.description}</p>
            <div className="space-y-2">
              {proposal.account.options.map((option: string, index: number) => (
                <button
                  key={index}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleVote(proposal.publicKey, option)}
                >
                  Vote for {option}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className='text-black'>No proposals available</p>
      )}
    </div>
  );
};

export default VotingList;
