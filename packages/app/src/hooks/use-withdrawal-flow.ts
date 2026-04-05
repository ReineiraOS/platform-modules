import { useCallback, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { WithdrawalService, type CreateWithdrawalRequest, type WithdrawalCall } from '@/services/WithdrawalService';
import { useWalletStore } from '@/stores/wallet-store';
import { useWithdrawalStore } from '@/stores/withdrawal-store';

const REDEEM_ABI = [
  {
    name: 'redeemMultiple',
    type: 'function',
    inputs: [{ name: 'escrowIds', type: 'uint256[]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

const UNWRAP_ABI = [
  {
    name: 'unwrap',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint64' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

const ABI_MAP: Record<string, typeof REDEEM_ABI | typeof UNWRAP_ABI> = {
  redeemMultiple: REDEEM_ABI,
  unwrap: UNWRAP_ABI,
};

export const WITHDRAWAL_FLOW_STEPS = [
  { label: 'Creating withdrawal' },
  { label: 'Signing transaction' },
  { label: 'Confirming on-chain' },
  { label: 'Done' },
];

function encodeWithdrawalCall(call: WithdrawalCall): { to: string; data: string } {
  const functionName = call.abi_function_signature.split('(')[0];
  const abi = ABI_MAP[functionName];
  if (!abi) throw new Error(`Unknown function: ${functionName}`);

  const abiDef = abi[0];
  const args = abiDef.inputs.map((input) => {
    const value = (call.abi_parameters as Record<string, unknown>)[input.name];
    if (value === undefined) throw new Error(`Missing parameter: ${input.name}`);
    return value;
  });

  return {
    to: call.contract_address,
    data: encodeFunctionData({ abi, functionName: functionName as 'redeemMultiple' | 'unwrap', args } as Parameters<
      typeof encodeFunctionData
    >[0]),
  };
}

export function useWithdrawalFlow() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [createdPublicId, setCreatedPublicId] = useState<string | null>(null);
  const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null);

  const execute = useCallback(async (dto: CreateWithdrawalRequest): Promise<string | null> => {
    setInProgress(true);
    setError(null);
    setCreatedPublicId(null);
    setEstimatedAmount(null);

    try {
      setCurrentStep(0);
      const response = await useWithdrawalStore.getState().createWithdrawal(dto);
      setCreatedPublicId(response.public_id);
      setEstimatedAmount(response.estimated_amount);

      setCurrentStep(1);
      const encodedCalls = response.calls.map(encodeWithdrawalCall);
      const txHash = await useWalletStore.getState().sendUserOperation(encodedCalls);

      setCurrentStep(2);
      await WithdrawalService.reportTransaction(txHash, 'redeem', response.public_id);

      setCurrentStep(3);
      await useWithdrawalStore.getState().fetchWithdrawals(true);

      return response.public_id;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Withdrawal failed');
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
    setEstimatedAmount(null);
  }, []);

  return {
    currentStep,
    error,
    inProgress,
    createdPublicId,
    estimatedAmount,
    steps: WITHDRAWAL_FLOW_STEPS,
    execute,
    reset,
  };
}
