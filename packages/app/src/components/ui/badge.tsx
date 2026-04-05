import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      success: 'bg-[var(--status-success)]/10 text-[var(--status-success)]',
      warning: 'bg-[var(--status-warning)]/10 text-[var(--status-warning)]',
      error: 'bg-[var(--status-error)]/10 text-[var(--status-error)]',
      info: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]',
      default: 'bg-[var(--background-secondary)] text-[var(--text-secondary)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: ReactNode;
}

function Badge({ variant, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))}>{children}</span>;
}

export { Badge, badgeVariants };
