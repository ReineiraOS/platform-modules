import { useCallback, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { EscrowService, type CreateEscrowClientEncryptResponse } from '@/services/EscrowService';
import { fheService } from '@/services/FheService';
import { useWalletStore } from '@/stores/wallet-store';
import { useAuthStore } from '@/stores/auth-store';
import { useTransactionStore } from '@/stores/transaction-store';
import type { CreateTransactionRequest } from '@/services/TransactionService';

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

export const ESCROW_FLOW_STEPS = [
  { label: 'Creating escrow' },
  { label: 'Encrypting values' },
  { label: 'Signing transaction' },
  { label: 'Confirming on-chain' },
  { label: 'Done' },
];

async function pollUntilConfirmed(publicId: string) {
  const maxAttempts = 20;
  const intervalMs = 3000;
  const confirmedStatuses = ['ON_CHAIN', 'SETTLED', 'REDEEMED'];

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    await useTransactionStore.getState().fetchTransaction(publicId);
    const status = useTransactionStore.getState().currentTransaction?.status;
    if (status && confirmedStatuses.includes(status)) return;
  }
}

export function useEscrowFlow() {
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
      const escrow: CreateEscrowClientEncryptResponse = await EscrowService.createWithClientEncrypt(dto);
      setCreatedPublicId(escrow.public_id);

      setCurrentStep(1);
      const walletAddress = useAuthStore.getState().walletAddress;
      if (!walletAddress) throw new Error('Wallet not connected');
      await fheService.initialize(walletAddress);

      const [encryptedOwner, encryptedAmount] = await fheService.encryptBatch([
        { type: 'eaddress', value: escrow.owner_address },
        { type: 'euint64', value: BigInt(escrow.amount_smallest_unit) },
      ]);

      setCurrentStep(2);
      const data = encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'create',
        args: [
          {
            ctHash: BigInt(encryptedOwner.data),
            securityZone: encryptedOwner.securityZone,
            utype: encryptedOwner.utype,
            signature: encryptedOwner.inputProof as `0x${string}`,
          },
          {
            ctHash: BigInt(encryptedAmount.data),
            securityZone: encryptedAmount.securityZone,
            utype: encryptedAmount.utype,
            signature: encryptedAmount.inputProof as `0x${string}`,
          },
          escrow.abi_parameters.resolver as `0x${string}`,
          escrow.abi_parameters.resolver_data as `0x${string}`,
        ],
      });

      const txHash = await useWalletStore.getState().sendUserOperation([{ to: escrow.contract_address, data }]);

      setCurrentStep(3);
      await EscrowService.reportTransaction(txHash, escrow.public_id);

      await pollUntilConfirmed(escrow.public_id);

      setCurrentStep(4);
      return escrow.public_id;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Escrow creation failed');
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
    steps: ESCROW_FLOW_STEPS,
    execute,
    reset,
  };
}
