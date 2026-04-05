import { useCallback, useState } from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { encodeFunctionData, type Abi } from 'viem';

export function useContractCall() {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCall = useCallback(async (contractAddress: string, abi: Abi, functionName: string, args: unknown[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = encodeFunctionData({ abi, functionName, args });
      const hash = await useWalletStore.getState().sendUserOperation([{ to: contractAddress, data }]);
      setTxHash(hash);
      return hash;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeBatchCalls = useCallback(
    async (calls: Array<{ contractAddress: string; abi: Abi; functionName: string; args: unknown[] }>) => {
      setLoading(true);
      setError(null);
      try {
        const encodedCalls = calls.map((c) => ({
          to: c.contractAddress,
          data: encodeFunctionData({ abi: c.abi, functionName: c.functionName, args: c.args }),
        }));
        const hash = await useWalletStore.getState().sendUserOperation(encodedCalls);
        setTxHash(hash);
        return hash;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Transaction failed';
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { txHash, loading, error, executeCall, executeBatchCalls };
}
