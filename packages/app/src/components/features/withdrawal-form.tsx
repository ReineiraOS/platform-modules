import { useMemo, useState, type FormEvent } from 'react';
import type { TransactionResponse } from '@/services/TransactionService';
import type { CreateWithdrawalRequest } from '@/services/WithdrawalService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WithdrawalFormProps {
  transactions: TransactionResponse[];
  onSubmit: (data: CreateWithdrawalRequest) => void;
}

const chainOptions = [
  { value: 'ETH', label: 'Ethereum' },
  { value: 'BASE', label: 'Base' },
  { value: 'POLYGON', label: 'Polygon' },
];

export function WithdrawalForm({ transactions, onSubmit }: WithdrawalFormProps) {
  const [destinationChain, setDestinationChain] = useState('ETH');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const settledTransactions = useMemo(() => transactions.filter((txn) => txn.status === 'SETTLED'), [transactions]);

  const selectedTotal = useMemo(
    () =>
      settledTransactions
        .filter((txn) => selectedIds.has(Number(txn.on_chain_escrow_id)))
        .reduce((sum, txn) => sum + txn.amount, 0),
    [settledTransactions, selectedIds],
  );

  function toggleTransaction(onChainEscrowId: string | undefined) {
    if (!onChainEscrowId) return;
    const id = Number(onChainEscrowId);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (selectedIds.size === 0 || !recipientAddress) return;
    setSubmitting(true);
    try {
      onSubmit({
        escrow_ids: Array.from(selectedIds),
        destination_chain: destinationChain,
        recipient_address: recipientAddress,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {settledTransactions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text-primary)]">Select settled transactions to withdraw</p>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-[var(--border-dark)]">
            {settledTransactions.map((txn) => (
              <label
                key={txn.public_id}
                className="flex cursor-pointer items-center gap-3 border-b border-[var(--border-dark)] px-4 py-3 last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(Number(txn.on_chain_escrow_id))}
                  onChange={() => toggleTransaction(txn.on_chain_escrow_id)}
                  className="h-4 w-4 rounded border-[var(--border-dark)] accent-[var(--accent-blue)]"
                />
                <span className="flex-1 text-sm text-[var(--text-primary)]">
                  {txn.external_reference || txn.public_id}
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{txn.amount} USDC</span>
              </label>
            ))}
          </div>
          {selectedIds.size > 0 && (
            <p className="text-sm text-[var(--text-secondary)]">
              Total: <span className="font-medium text-[var(--text-primary)]">{selectedTotal.toFixed(2)} USDC</span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">No settled transactions available for withdrawal.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Destination Chain</label>
          <select
            value={destinationChain}
            onChange={(e) => setDestinationChain(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-dark)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/50"
          >
            {chainOptions.map((chain) => (
              <option key={chain.value} value={chain.value}>
                {chain.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Recipient Address"
          placeholder="0x..."
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={submitting} disabled={selectedIds.size === 0 || !recipientAddress}>
          Withdraw
        </Button>
      </div>
    </form>
  );
}
