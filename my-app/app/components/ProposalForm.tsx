"use client"
import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../idl.json'; // Adjust this path to your IDL
import { Idl } from '@project-serum/anchor'; // Import Idl type

const ProposalForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey || !connected) {
      alert('Please connect your wallet.');
      return;
    }

    if (!title || !description || !options) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
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

      const program = new Program(idl as Idl, idl.metadata.address, provider);

      const proposalAccount = new PublicKey('PROPOSAL_ACCOUNT'); // Replace with your proposal account

      await program.rpc.createProposal(title, description, options.split(','), {
        accounts: {
          proposal: proposalAccount,
          user: publicKey,
        },
      });

      alert('Proposal created successfully!');
      setTitle('');
      setDescription('');
      setOptions('');
    } catch (err) {
      console.error('Failed to create proposal:', err);
      setError('Failed to create proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Proposal Title</label>
        <input
          id="title"
          type="text"
          placeholder="Proposal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input mt-1 block w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea mt-1 block w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="options" className="block text-sm font-medium text-gray-700">Options (comma-separated)</label>
        <input
          id="options"
          type="text"
          placeholder="Options (comma-separated)"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          className="form-input mt-1 block w-full"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="btn-primary text-red-600" disabled={loading}>
        {loading ? 'Creating Proposal...' : 'Create Proposal'}
      </button>
    </form>
  );
};

export default ProposalForm;
