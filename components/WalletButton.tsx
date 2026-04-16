import React from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

const WalletButton: React.FC = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const address = wallets[0]?.address;

  if (!ready) {
    return (
      <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-lg">
        <Loader2 className="w-3 h-3 animate-spin" /> Loading
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Wallet className="w-3.5 h-3.5" /> Connect Wallet
      </button>
    );
  }

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <button
      onClick={() => logout()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
      title="Disconnect"
    >
      <span className="font-mono">{short}</span>
      <LogOut className="w-3 h-3 text-gray-400" />
    </button>
  );
};

export default WalletButton;
