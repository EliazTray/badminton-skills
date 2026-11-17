import type { Level } from '../../data/schema';
import { cn } from '../../lib/cn';
import { getStatusLabel } from '../../lib/progress';

export function StatusBadge({ level, className }: { level: Level; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        level === 0 && 'bg-surface2 text-muted',
        level > 0 && level <= 2 && 'bg-amber-soft text-amber',
        level === 3 && 'bg-court-soft text-court',
        level === 4 && 'bg-court text-[var(--court-contrast)]',
        className,
      )}
    >
      {getStatusLabel(level)}
    </span>
  );
}
