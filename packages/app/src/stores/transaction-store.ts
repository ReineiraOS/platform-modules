import { create } from 'zustand';
import {
  TransactionService,
  type TransactionResponse,
  type CreateTransactionRequest,
} from '@/services/TransactionService';

interface TransactionState {
  transactions: TransactionResponse[];
  currentTransaction: TransactionResponse | null;
  loading: boolean;
  hasMore: boolean;
  continuationToken: string | undefined;
  fetchTransactions: (reset?: boolean) => Promise<void>;
  fetchTransaction: (publicId: string) => Promise<void>;
  createTransaction: (req: CreateTransactionRequest) => ReturnType<typeof TransactionService.create>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  currentTransaction: null,
  loading: false,
  hasMore: false,
  continuationToken: undefined,

  fetchTransactions: async (reset = false) => {
    const state = get();
    if (state.transactions.length === 0) {
      set({ loading: true });
    }
    try {
      const token = reset ? undefined : state.continuationToken;
      const result = await TransactionService.list({ continuation_token: token });
      set({
        transactions: reset ? result.items : [...state.transactions, ...result.items],
        continuationToken: result.continuation_token,
        hasMore: result.has_more,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchTransaction: async (publicId) => {
    if (!get().currentTransaction) {
      set({ loading: true });
    }
    try {
      const transaction = await TransactionService.getById(publicId);
      set({ currentTransaction: transaction });
    } finally {
      set({ loading: false });
    }
  },

  createTransaction: (req) => TransactionService.create(req),
}));
