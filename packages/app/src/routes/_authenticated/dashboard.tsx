import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTransactionStore } from '@/stores/transaction-store';
import { useWithdrawalStore } from '@/stores/withdrawal-store';
import { BalanceCard } from '@/components/features/balance-card';
import { TransactionList } from '@/components/features/transaction-list';
import { WithdrawalList } from '@/components/features/withdrawal-list';
import { Card } from '@/components/ui/card';

export function DashboardPage() {
  const navigate = useNavigate();
  const transactions = useTransactionStore((s) => s.transactions);
  const transactionLoading = useTransactionStore((s) => s.loading);
  const fetchTransactions = useTransactionStore((s) => s.fetchTransactions);
  const withdrawals = useWithdrawalStore((s) => s.withdrawals);
  const withdrawalLoading = useWithdrawalStore((s) => s.loading);
  const fetchWithdrawals = useWithdrawalStore((s) => s.fetchWithdrawals);

  useEffect(() => {
    fetchTransactions(true);
    fetchWithdrawals(true);
  }, [fetchTransactions, fetchWithdrawals]);

  function handleSelectTransaction(transaction: { public_id: string }) {
    navigate({ to: '/transactions/$id', params: { id: transaction.public_id } });
  }

  return (
    <div className="flex flex-col gap-6">
      <BalanceCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Transactions">
          <TransactionList
            transactions={transactions.slice(0, 5)}
            loading={transactionLoading}
            hasMore={false}
            onSelect={handleSelectTransaction}
          />
          {transactions.length > 0 && (
            <div className="mt-4 border-t border-[var(--border-dark)] pt-4">
              <Link
                to="/transactions"
                className="text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] transition-colors"
              >
                View all transactions
              </Link>
            </div>
          )}
        </Card>

        <Card title="Recent Withdrawals">
          <WithdrawalList withdrawals={withdrawals.slice(0, 5)} loading={withdrawalLoading} hasMore={false} />
          {withdrawals.length > 0 && (
            <div className="mt-4 border-t border-[var(--border-dark)] pt-4">
              <Link
                to="/withdrawals"
                className="text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] transition-colors"
              >
                View all withdrawals
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
