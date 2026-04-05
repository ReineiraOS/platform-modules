import { useEffect } from 'react';
import { useBalance } from '@/hooks/use-balance';
import { useAuthStore } from '@/stores/auth-store';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BalanceCard() {
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const { balance, loading, startPolling, stopPolling } = useBalance();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Available Balance</p>
          {loading && !balance ? (
            <Skeleton className="mt-2 h-9 w-40" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-[var(--text-primary)]">
              {balance?.formatted_balance ?? '0.00'}
              <span className="text-lg font-normal text-[var(--text-secondary)]"> {balance?.currency ?? 'USDC'}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--text-secondary)]">Wallet</p>
          <p className="mt-1 font-mono text-sm text-[var(--text-secondary)]">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '—'}
          </p>
        </div>
      </div>
    </Card>
  );
}
