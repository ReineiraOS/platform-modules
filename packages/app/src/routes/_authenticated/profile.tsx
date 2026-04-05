import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { UserService, type UserProfile } from '@/services/UserService';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePage() {
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const walletProvider = useAuthStore((s) => s.walletProvider);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    UserService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Profile</h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <Card>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Wallet Address</p>
                <p className="mt-1 break-all font-mono text-sm font-medium text-[var(--text-primary)]">
                  {user?.wallet_address ?? walletAddress ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Wallet Provider</p>
                <p className="mt-1 text-sm font-medium capitalize text-[var(--text-primary)]">
                  {user?.wallet_provider ?? walletProvider ?? '—'}
                </p>
              </div>
              {user?.email && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Email</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{user.email}</p>
                </div>
              )}
              {user?.created_at && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Member Since</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{formatDate(user.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
