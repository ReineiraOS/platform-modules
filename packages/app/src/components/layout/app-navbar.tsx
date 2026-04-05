import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { name: 'Dashboard', to: '/dashboard' as const },
  { name: 'Transactions', to: '/transactions' as const },
  { name: 'Withdrawals', to: '/withdrawals' as const },
];

export function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const { logout } = useAuth();

  const truncatedAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  async function handleLogout() {
    await logout();
    navigate({ to: '/' });
  }

  return (
    <nav className="border-b border-[var(--border-dark)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-lg font-bold text-[var(--text-primary)]">
            Reineira Modules
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(link.to)
                    ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)]',
                ].join(' ')}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {walletAddress && (
            <Link
              to="/profile"
              className="hidden rounded-lg bg-[var(--background-secondary)] px-3 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:block"
            >
              {truncatedAddress}
            </Link>
          )}
          <button
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--status-error)] transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
