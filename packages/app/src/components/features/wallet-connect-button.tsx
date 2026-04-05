import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function WalletConnectButton() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      await login();
      navigate({ to: '/dashboard' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(username.trim());
      navigate({ to: '/dashboard' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  function toggleRegister() {
    setShowRegister(!showRegister);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <Button size="lg" loading={loading && !showRegister} disabled={loading} onClick={handleLogin}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
        </svg>
        Sign in with Passkey
      </Button>

      {showRegister && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            disabled={loading}
            className="w-full rounded-lg border border-[var(--border-dark)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent-blue)]"
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          />
          <Button size="lg" loading={loading && showRegister} disabled={loading} onClick={handleRegister}>
            Create Account
          </Button>
        </div>
      )}

      {!showRegister && (
        <button
          type="button"
          disabled={loading}
          className="text-sm text-[var(--text-secondary)] underline-offset-2 transition-colors hover:text-[var(--text-primary)] hover:underline"
          onClick={toggleRegister}
        >
          Create new account
        </button>
      )}

      {showRegister && (
        <button
          type="button"
          disabled={loading}
          className="text-sm text-[var(--text-secondary)] underline-offset-2 transition-colors hover:text-[var(--text-primary)] hover:underline"
          onClick={toggleRegister}
        >
          Already have an account? Sign in
        </button>
      )}

      {error && <p className="text-center text-sm text-[var(--status-error)]">{error}</p>}
    </div>
  );
}
