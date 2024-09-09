"use client";
import { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl.json'; 
import { Idl as IdlType } from '@project-serum/anchor'; 
import Navbar from './Navbar';

const ProposalForm = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wallet || !wallet.publicKey) {
      alert('Please connect your wallet.');
      return;
    }

    if (!title || !description) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { blockhash } = await connection.getLatestBlockhash();
      console.log('Fetched latest blockhash:', blockhash);

      const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      });
      console.log('Provider initialized:', provider);

      const program = new Program(idl as IdlType, idl.metadata.address, provider);
      console.log('Program initialized:', program);

      const proposalAccount = new PublicKey('9qkB1pcntVosURAYkTzKznGM2KuGJR5A2PmXZyBrWir1');
      console.log('Proposal account:', proposalAccount.toString());

      const tx = await program.methods.createProposal(title, description)
        .accounts({
          proposal: proposalAccount,
          user: wallet.publicKey,
        })
        .rpc();

      console.log('Transaction signature:', tx);
      alert('Proposal created successfully!');
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create proposal:', err);

      if (err instanceof Error) {
        setError(`Failed to create proposal. Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9d9875119512883.60b757ed32e4a.gif)' }}>
      <Navbar/>
      <div className="relative p-12 bg-white bg-opacity-50 rounded-lg shadow-xl max-w-lg w-full backdrop-blur-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-800">Proposal Title</label>
            <input
              id="title"
              type="text"
              placeholder="Proposal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input mt-2 block w-full border-gray-300 rounded-md shadow-lg bg-transparent backdrop-blur-md border border-gray-300 text-lg p-3"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-gray-800">Description</label>
            <textarea
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea mt-2 block w-full border-gray-300 rounded-md shadow-lg bg-transparent backdrop-blur-md border border-gray-300 text-lg p-3"
              required
            />
          </div>
          {error && <p className="text-red-600 text-lg">{error}</p>}
          <button
            type="submit"
            className={`text-white py-3 px-6 rounded-md ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'} text-lg`}
            disabled={loading}
          >
            {loading ? 'Creating Proposal...' : 'Create Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;
