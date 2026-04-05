import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTransactionStore } from '@/stores/transaction-store';
import { TransactionDetail } from '@/components/features/transaction-detail';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function TransactionDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const currentTransaction = useTransactionStore((s) => s.currentTransaction);
  const loading = useTransactionStore((s) => s.loading);
  const fetchTransaction = useTransactionStore((s) => s.fetchTransaction);

  useEffect(() => {
    fetchTransaction(id);
  }, [id, fetchTransaction]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/transactions' })}>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transaction Details</h1>
      </div>

      {loading && !currentTransaction ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 w-full" />
        </div>
      ) : currentTransaction ? (
        <TransactionDetail transaction={currentTransaction} />
      ) : (
        <p className="text-center text-sm text-[var(--text-secondary)]">Transaction not found</p>
      )}
    </div>
  );
}
