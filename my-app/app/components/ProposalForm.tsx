"use client";

import { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl.json'; // Ensure this path is correct
import { Idl as IdlType } from '@project-serum/anchor'; // Import Idl type

const ProposalForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !wallet.publicKey) {
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
      // Initialize provider and program
      const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      });

      const program = new Program(idl as IdlType, idl.metadata.address, provider);

      // Debugging: Check available methods on the program
      console.log('Available methods:', Object.keys(program.methods));

      // Replace 'PROPOSAL_ACCOUNT' with your actual proposal account
      const proposalAccount = new PublicKey('DDWiWPNbmV4fdZvvZWVr6mAfnWhE1szRqrXJUx1Jio4g');

      
      program.methods.
      // Call the smart contract to create a proposal
      await program.methods.CreateProposal(title, description, options.split(','))
        .accounts({
          proposal: proposalAccount,
          user: wallet.publicKey,
        })
        .rpc(); // Execute the transaction

      alert('Proposal created successfully!');
      setTitle('');
      setDescription('');
      setOptions('');
    } catch (err) {
      console.error('Failed to create proposal:', err);
      setError(`Failed to create proposal. Error: ${(err as Error).message}`);
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
          className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
          className="form-textarea mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
          className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className={`btn-primary ${loading ? 'bg-gray-500' : 'bg-blue-600'} text-white py-2 px-4 rounded-md`}
        disabled={loading}
      >
        {loading ? 'Creating Proposal...' : 'Create Proposal'}
      </button>
    </form>
  );
};

export default ProposalForm;


// "use client";

// import { useState } from 'react';
// import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
// import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
// import { PublicKey, SystemProgram } from '@solana/web3.js';
// import idl from '../idl.json'; // Ensure this path is correct
// import { Idl as IdlType } from '@project-serum/anchor';

// const ProposalForm = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [options, setOptions] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const wallet = useAnchorWallet();
//   const { connection } = useConnection();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!wallet || !wallet.publicKey) {
//       alert('Please connect your wallet.');
//       return;
//     }

//     if (!title || !description || !options) {
//       alert('Please fill in all fields.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Initialize provider and program
//       const provider = new AnchorProvider(connection, wallet, {
//         commitment: 'confirmed',
//       });

//       const program = new Program(idl as IdlType, idl.metadata.address, provider);

//       // Create a new proposal account with seeds and bump
//       const [proposalAccount, bump] = await PublicKey.findProgramAddress(
//         [Buffer.from(title)],
//         program.programId
//       );

//       // Call the smart contract to create a proposal
//       await program.methods.createProposal(title, description)
//         .accounts({
//           proposal: proposalAccount,
//           user: wallet.publicKey,
//           systemProgram: SystemProgram.programId,
//         })
//         .rpc(); // Execute the transaction

//       alert('Proposal created successfully!');
//       setTitle('');
//       setDescription('');
//       setOptions('');
//     } catch (err) {
//       console.error('Failed to create proposal:', err);
//       setError(`Failed to create proposal. Error: ${(err as Error).message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 text-black">
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700">Proposal Title</label>
//         <input
//           id="title"
//           type="text"
//           placeholder="Proposal Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//         <textarea
//           id="description"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="form-textarea mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="options" className="block text-sm font-medium text-gray-700">Options (comma-separated)</label>
//         <input
//           id="options"
//           type="text"
//           placeholder="Options (comma-separated)"
//           value={options}
//           onChange={(e) => setOptions(e.target.value)}
//           className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           required
//         />
//       </div>
//       {error && <p className="text-red-500">{error}</p>}
//       <button
//         type="submit"
//         className={`btn-primary ${loading ? 'bg-gray-500' : 'bg-blue-600'} text-white py-2 px-4 rounded-md`}
//         disabled={loading}
//       >
//         {loading ? 'Creating Proposal...' : 'Create Proposal'}
//       </button>
//     </form>
//   );
// };

// export default ProposalForm;
