import { create } from 'zustand';
import { WithdrawalService, type WithdrawalResponse, type CreateWithdrawalRequest } from '@/services/WithdrawalService';

interface WithdrawalState {
  withdrawals: WithdrawalResponse[];
  currentWithdrawal: WithdrawalResponse | null;
  loading: boolean;
  hasMore: boolean;
  continuationToken: string | undefined;
  fetchWithdrawals: (reset?: boolean) => Promise<void>;
  fetchWithdrawal: (publicId: string) => Promise<void>;
  createWithdrawal: (req: CreateWithdrawalRequest) => ReturnType<typeof WithdrawalService.create>;
}

export const useWithdrawalStore = create<WithdrawalState>((set, get) => ({
  withdrawals: [],
  currentWithdrawal: null,
  loading: false,
  hasMore: false,
  continuationToken: undefined,

  fetchWithdrawals: async (reset = false) => {
    const state = get();
    if (state.withdrawals.length === 0) {
      set({ loading: true });
    }
    try {
      const token = reset ? undefined : state.continuationToken;
      const result = await WithdrawalService.list({ continuation_token: token });
      set({
        withdrawals: reset ? result.items : [...state.withdrawals, ...result.items],
        continuationToken: result.continuation_token,
        hasMore: result.has_more,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchWithdrawal: async (publicId) => {
    if (!get().currentWithdrawal) {
      set({ loading: true });
    }
    try {
      const withdrawal = await WithdrawalService.getById(publicId);
      set({ currentWithdrawal: withdrawal });
    } finally {
      set({ loading: false });
    }
  },

  createWithdrawal: (req) => WithdrawalService.create(req),
}));
