import { useState, type FormEvent } from 'react';
import type { CreateTransactionRequest } from '@/services/TransactionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionRequest) => void;
}

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [counterparty, setCounterparty] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const minDate = getTomorrowDate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setSubmitting(true);
    try {
      onSubmit({
        counterparty: counterparty || undefined,
        external_reference: externalReference || undefined,
        amount: parseFloat(amount),
        deadline: deadline || undefined,
        type: 'escrow',
        currency: { type: 'crypto', code: 'USDC' },
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Amount (USDC) *"
          placeholder="0.00"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="Due Date"
          type="date"
          min={minDate}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Counterparty"
          placeholder="Acme Inc."
          value={counterparty}
          onChange={(e) => setCounterparty(e.target.value)}
        />
        <Input
          label="External Reference"
          placeholder="TXN-001"
          value={externalReference}
          onChange={(e) => setExternalReference(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={submitting} disabled={!amount}>
          Create Transaction
        </Button>
      </div>
    </form>
  );
}
