import type { WithdrawalResponse } from '@/services/WithdrawalService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface WithdrawalListProps {
  withdrawals: WithdrawalResponse[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
}

function statusVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    COMPLETED: 'success',
    REDEEMED: 'success',
    PAID: 'success',
    PENDING: 'warning',
    PENDING_REDEEM: 'warning',
    PENDING_BRIDGE: 'warning',
    PROCESSING: 'warning',
    BRIDGING: 'warning',
    ISSUED: 'info',
    DRAFT: 'info',
    FAILED: 'error',
    CANCELED: 'error',
    CANCELLED: 'error',
    OVERDUE: 'error',
  };
  return map[status] ?? 'default';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WithdrawalList({ withdrawals, loading, hasMore, onLoadMore }: WithdrawalListProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-dark)] text-[var(--text-secondary)]">
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 pr-4 font-medium">Chain</th>
              <th className="pb-3 pr-4 font-medium">Recipient</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.public_id} className="border-b border-[var(--border-dark)] last:border-0">
                <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                  {formatAmount(w.actual_amount ?? w.estimated_amount)} USDC
                </td>
                <td className="py-3 pr-4 text-[var(--text-secondary)] capitalize">{w.destination_chain}</td>
                <td className="py-3 pr-4 font-mono text-sm text-[var(--text-secondary)]">
                  {truncateAddress(w.recipient_address)}
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={statusVariant(w.status)}>{w.status}</Badge>
                </td>
                <td className="py-3 text-[var(--text-secondary)]">{formatDate(w.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && withdrawals.length === 0 && (
        <div className="flex flex-col gap-3 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {!loading && withdrawals.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--text-secondary)]">No withdrawals yet</p>
      )}

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" loading={loading} onClick={onLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
