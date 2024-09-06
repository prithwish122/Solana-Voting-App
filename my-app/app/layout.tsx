"use client"
import { FC, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css'; // Import Solana wallet adapter UI styles
import './globals.css'; // Import global styles
import Link from 'next/link';

const WalletModalProvider = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletModalProvider),
  { ssr: false }
);

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = 'https://api.mainnet-beta.solana.com'; // Mainnet endpoint
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <header className="bg-blue-500 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                  <Link href="/" className="text-2xl font-bold">DAO Voting Program</Link>
                  <WalletMultiButton />
                </div>
              </header>
              <main className="container mx-auto p-4">
                {children}
              </main>
              <footer className="bg-blue-500 text-white p-4 text-center">
                <p>© 2024 DAO Voting Program</p>
              </footer>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
};

export default Layout;
