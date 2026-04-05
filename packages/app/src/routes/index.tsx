import { WalletConnectButton } from '@/components/features/wallet-connect-button';

export function WalletAuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reineira Platform Modules</h1>
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">Build on ReineiraOS</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Connect your wallet to get started</p>
        </div>
        <div className="rounded-xl border border-[var(--border-dark)] bg-[var(--background)] p-6 shadow-sm">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
}
