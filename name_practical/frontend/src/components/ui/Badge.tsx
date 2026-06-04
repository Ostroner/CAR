import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-accent-soft text-ink border border-transparent',
    success: 'bg-accent-soft text-accent border border-accent/15',
    warning: 'bg-orange-50 text-warning border border-orange-200',
    danger: 'bg-red-50 text-danger border border-red-200',
    outline: 'bg-white text-ink border border-border-strong',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-ring)] focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
