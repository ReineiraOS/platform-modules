import type { TransactionResponse } from '@/services/TransactionService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionListProps {
  transactions: TransactionResponse[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
  onSelect?: (transaction: TransactionResponse) => void;
}

function statusVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    SETTLED: 'success',
    COMPLETED: 'success',
    REDEEMED: 'success',
    PENDING: 'warning',
    PENDING_REDEEM: 'warning',
    PENDING_BRIDGE: 'warning',
    PROCESSING: 'warning',
    BRIDGING: 'warning',
    ISSUED: 'info',
    DRAFT: 'info',
    CREATED: 'info',
    FAILED: 'error',
    CANCELED: 'error',
    CANCELLED: 'error',
    EXPIRED: 'error',
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

export function TransactionList({ transactions, loading, hasMore, onLoadMore, onSelect }: TransactionListProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-dark)] text-[var(--text-secondary)]">
              <th className="pb-3 pr-4 font-medium">Reference</th>
              <th className="pb-3 pr-4 font-medium">Counterparty</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 pr-4 font-medium">Due Date</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.public_id}
                className="border-b border-[var(--border-dark)] last:border-0 cursor-pointer hover:bg-[var(--background-secondary)] transition-colors"
                onClick={() => onSelect?.(transaction)}
              >
                <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                  {transaction.external_reference || '—'}
                </td>
                <td className="py-3 pr-4 text-[var(--text-secondary)]">{transaction.counterparty}</td>
                <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                  {formatAmount(transaction.amount)} USDC
                </td>
                <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDate(transaction.deadline)}</td>
                <td className="py-3 pr-4">
                  <Badge variant={statusVariant(transaction.status)}>{transaction.status}</Badge>
                </td>
                <td className="py-3 text-[var(--text-secondary)]">{formatDate(transaction.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && transactions.length === 0 && (
        <div className="flex flex-col gap-3 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--text-secondary)]">No transactions yet</p>
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
