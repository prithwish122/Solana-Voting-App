"use client"
import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnect: FC = () => {
  return (
    <div className="mb-4">
      {/* WalletMultiButton handles wallet connection and disconnection */}
      <WalletMultiButton />
    </div>
  );
};

export default WalletConnect;
