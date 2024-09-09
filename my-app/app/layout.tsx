// Layout.tsx
"use client";
import { FC, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css'; // Import Solana wallet adapter UI styles
// import Navbar from './components'; // Import the new Navbar component
import "./globals.css";
import Navbar from './components/Navbar';

const WalletModalProvider = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletModalProvider),
  { ssr: false }
);

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = 'https://api.devnet.solana.com/'; // Mainnet endpoint
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <html lang="en">
      <body>
        {/* <ThreeCanvas /> */}
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {/* <Navbar /> Use the new Navbar component */}
              <main >
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
