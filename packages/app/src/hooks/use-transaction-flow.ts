import { useCallback, useState } from 'react';
import { encodeFunctionData } from 'viem';
import {
  TransactionService,
  type CreateTransactionRequest,
  type CreateTransactionResponse,
} from '@/services/TransactionService';
import { useWalletStore } from '@/stores/wallet-store';
import { useTransactionStore } from '@/stores/transaction-store';

const ESCROW_ABI = [
  {
    name: 'create',
    type: 'function',
    inputs: [
      {
        name: 'encryptedOwner',
        type: 'tuple',
        components: [
          { name: 'ctHash', type: 'uint256' },
          { name: 'securityZone', type: 'uint8' },
          { name: 'utype', type: 'uint8' },
          { name: 'signature', type: 'bytes' },
        ],
      },
      {
        name: 'encryptedAmount',
        type: 'tuple',
        components: [
          { name: 'ctHash', type: 'uint256' },
          { name: 'securityZone', type: 'uint8' },
          { name: 'utype', type: 'uint8' },
          { name: 'signature', type: 'bytes' },
        ],
      },
      { name: 'resolver', type: 'address' },
      { name: 'resolverData', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const TRANSACTION_FLOW_STEPS = [
  { label: 'Creating transaction' },
  { label: 'Signing transaction' },
  { label: 'Confirming on-chain' },
  { label: 'Done' },
];

async function pollUntilIssued(publicId: string) {
  const maxAttempts = 20;
  const intervalMs = 3000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    await useTransactionStore.getState().fetchTransaction(publicId);
    if (useTransactionStore.getState().currentTransaction?.status === 'ISSUED') return;
  }
}

export function useTransactionFlow() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [createdPublicId, setCreatedPublicId] = useState<string | null>(null);

  const execute = useCallback(async (dto: CreateTransactionRequest): Promise<string | null> => {
    setInProgress(true);
    setError(null);
    setCreatedPublicId(null);

    try {
      setCurrentStep(0);
      const response: CreateTransactionResponse = await useTransactionStore.getState().createTransaction(dto);
      setCreatedPublicId(response.public_id);

      setCurrentStep(1);
      const data = encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'create',
        args: [
          response.abi_parameters.encrypted_owner as unknown as {
            ctHash: bigint;
            securityZone: number;
            utype: number;
            signature: `0x${string}`;
          },
          response.abi_parameters.encrypted_amount as unknown as {
            ctHash: bigint;
            securityZone: number;
            utype: number;
            signature: `0x${string}`;
          },
          response.abi_parameters.resolver as `0x${string}`,
          response.abi_parameters.resolver_data as `0x${string}`,
        ],
      });

      const txHash = await useWalletStore.getState().sendUserOperation([{ to: response.contract_address, data }]);

      setCurrentStep(2);
      await TransactionService.reportTransaction(txHash, response.public_id);

      await pollUntilIssued(response.public_id);

      setCurrentStep(3);
      return response.public_id;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transaction creation failed');
      return null;
    } finally {
      setInProgress(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(-1);
    setError(null);
    setInProgress(false);
    setCreatedPublicId(null);
  }, []);

  return {
    currentStep,
    error,
    inProgress,
    createdPublicId,
    steps: TRANSACTION_FLOW_STEPS,
    execute,
    reset,
  };
}
