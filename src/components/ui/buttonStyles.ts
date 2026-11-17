import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export function buttonClassName(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background-color,color,border-color,opacity] disabled:cursor-not-allowed disabled:opacity-45',
    variant === 'primary' && 'bg-court text-[var(--court-contrast)] hover:opacity-90',
    variant === 'secondary' && 'border border-line bg-surface text-ink hover:bg-surface2',
    variant === 'ghost' && 'text-muted hover:bg-surface2 hover:text-ink',
    className,
  );
}
