import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/50 disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-[var(--status-error)]' : 'border-[var(--border-dark)]',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--status-error)]">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
