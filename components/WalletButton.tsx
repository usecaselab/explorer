import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Wallet, LogOut, Loader2, Coins } from 'lucide-react';
import { getTokenBalance, getTokenSymbol } from '../token';

interface WalletButtonProps {
  onBountyClick?: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({ onBountyClick }) => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('TOKEN');
  const [loadingBalance, setLoadingBalance] = useState(false);

  const address = wallets[0]?.address as `0x${string}` | undefined;

  useEffect(() => {
    if (!address) { setBalance(null); return; }
    setLoadingBalance(true);
    Promise.all([getTokenBalance(address), getTokenSymbol()])
      .then(([bal, sym]) => { setBalance(bal.formatted); setSymbol(sym); })
      .finally(() => setLoadingBalance(false));
  }, [address]);

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
    <div className="flex items-center gap-2">
      {balance !== null && (
        <button
          onClick={onBountyClick}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          title="Go to Bounties"
        >
          <Coins className="w-3 h-3" />
          {loadingBalance ? '…' : `${balance} ${symbol}`}
        </button>
      )}
      <button
        onClick={() => logout()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
        title="Disconnect"
      >
        <span className="font-mono">{short}</span>
        <LogOut className="w-3 h-3 text-gray-400" />
      </button>
    </div>
  );
};

export default WalletButton;
