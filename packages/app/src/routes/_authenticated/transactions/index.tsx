import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTransactionStore } from '@/stores/transaction-store';
import { useEscrowFlow } from '@/hooks/use-escrow-flow';
import type { CreateTransactionRequest, TransactionResponse } from '@/services/TransactionService';
import { TransactionForm } from '@/components/features/transaction-form';
import { TransactionList } from '@/components/features/transaction-list';
import { TransactionProgress } from '@/components/features/transaction-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TransactionsPage() {
  const navigate = useNavigate();
  const transactions = useTransactionStore((s) => s.transactions);
  const loading = useTransactionStore((s) => s.loading);
  const hasMore = useTransactionStore((s) => s.hasMore);
  const fetchTransactions = useTransactionStore((s) => s.fetchTransactions);

  const escrowFlow = useEscrowFlow();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransactions(true);
  }, [fetchTransactions]);

  async function handleCreate(data: CreateTransactionRequest) {
    const publicId = await escrowFlow.execute(data);
    if (publicId) {
      setShowForm(false);
      fetchTransactions(true);
      navigate({ to: '/transactions/$id', params: { id: publicId } });
    }
  }

  function handleCancel() {
    setShowForm(false);
    escrowFlow.reset();
  }

  function handleSelect(transaction: TransactionResponse) {
    navigate({ to: '/transactions/$id', params: { id: transaction.public_id } });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transactions</h1>
        <Button onClick={() => (showForm ? handleCancel() : setShowForm(true))}>
          {showForm ? 'Cancel' : 'New Transaction'}
        </Button>
      </div>

      {showForm && (
        <Card title="Create Transaction">
          {escrowFlow.currentStep < 0 && !escrowFlow.inProgress ? (
            <TransactionForm onSubmit={handleCreate} />
          ) : (
            <div className="flex flex-col gap-4">
              <TransactionProgress steps={escrowFlow.steps} currentStep={escrowFlow.currentStep} />
              {escrowFlow.inProgress && !escrowFlow.error && (
                <p className="text-sm text-[var(--text-secondary)] animate-pulse">Processing... Please wait</p>
              )}
              {escrowFlow.error && <p className="text-sm text-[var(--status-error)]">{escrowFlow.error}</p>}
              {escrowFlow.error && (
                <div className="flex justify-end">
                  <Button onClick={escrowFlow.reset}>Try Again</Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      <Card>
        <TransactionList
          transactions={transactions}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={() => fetchTransactions()}
          onSelect={handleSelect}
        />
      </Card>
    </div>
  );
}
