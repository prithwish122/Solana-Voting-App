// Layout.tsx
"use client";
import { FC, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css'; // Import Solana wallet adapter UI styles
import Link from 'next/link';
import ThreeCanvas from './components/ThreeCanvas';
import "./globals.css";

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
      <body className="min-h-screen text-white font-sans relative overflow-hidden">
        {/* <ThreeCanvas /> */}
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <header className="fixed top-0 left-0 w-full bg-transparent text-accent p-4 backdrop-blur-lg shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                  <Link href="/" className="text-3xl font-serif transform-gpu transition-transform duration-300 hover:rotate-12 hover:translate-y-2 header-title">DAO Voting Program</Link>
                  <WalletMultiButton className="transform-gpu transition-transform duration-300 hover:scale-105 hover:rotate-12 header-button" />
                </div>
              </header>
              <main className="container mx-auto p-4 mt-20">
                {children}
              </main>
              {/* <footer className="bg-dark-primary text-accent p-4 text-center shadow-lg">
                <p>© 2024 DAO Voting Program</p>
              </footer> */}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
};

export default Layout;
