import { useEffect, useState } from 'react';
import { useTransactionStore } from '@/stores/transaction-store';
import { useWithdrawalStore } from '@/stores/withdrawal-store';
import { useWithdrawalFlow } from '@/hooks/use-withdrawal-flow';
import type { CreateWithdrawalRequest } from '@/services/WithdrawalService';
import { WithdrawalForm } from '@/components/features/withdrawal-form';
import { WithdrawalList } from '@/components/features/withdrawal-list';
import { TransactionProgress } from '@/components/features/transaction-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function WithdrawalsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const fetchTransactions = useTransactionStore((s) => s.fetchTransactions);
  const withdrawals = useWithdrawalStore((s) => s.withdrawals);
  const withdrawalLoading = useWithdrawalStore((s) => s.loading);
  const hasMore = useWithdrawalStore((s) => s.hasMore);
  const fetchWithdrawals = useWithdrawalStore((s) => s.fetchWithdrawals);

  const withdrawalFlow = useWithdrawalFlow();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransactions(true);
    fetchWithdrawals(true);
  }, [fetchTransactions, fetchWithdrawals]);

  async function handleCreate(data: CreateWithdrawalRequest) {
    const publicId = await withdrawalFlow.execute(data);
    if (publicId) {
      setShowForm(false);
    }
  }

  function handleCancel() {
    setShowForm(false);
    withdrawalFlow.reset();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Withdrawals</h1>
        <Button onClick={() => (showForm ? handleCancel() : setShowForm(true))}>
          {showForm ? 'Cancel' : 'New Withdrawal'}
        </Button>
      </div>

      {showForm && (
        <Card title="Create Withdrawal">
          {withdrawalFlow.currentStep < 0 ? (
            <WithdrawalForm transactions={transactions} onSubmit={handleCreate} />
          ) : (
            <div className="flex flex-col gap-4">
              <TransactionProgress steps={withdrawalFlow.steps} currentStep={withdrawalFlow.currentStep} />
              {withdrawalFlow.estimatedAmount && (
                <p className="text-sm text-[var(--text-secondary)]">
                  Estimated amount: {withdrawalFlow.estimatedAmount} USDC
                </p>
              )}
              {withdrawalFlow.error && <p className="text-sm text-[var(--status-error)]">{withdrawalFlow.error}</p>}
              {withdrawalFlow.error && (
                <div className="flex justify-end">
                  <Button onClick={withdrawalFlow.reset}>Try Again</Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      <Card>
        <WithdrawalList
          withdrawals={withdrawals}
          loading={withdrawalLoading}
          hasMore={hasMore}
          onLoadMore={() => fetchWithdrawals()}
        />
      </Card>
    </div>
  );
}
