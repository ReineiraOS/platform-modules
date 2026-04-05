import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

function Card({ title, className, children }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-[var(--border-dark)] bg-[var(--background)] p-6', className)}>
      {title && <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>}
      {children}
    </div>
  );
}

export { Card };
