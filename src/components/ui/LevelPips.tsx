import type { Level } from '../../data/schema';
import { cn } from '../../lib/cn';

interface LevelPipsProps {
  level: Level;
  size?: 'sm' | 'md';
  className?: string;
}

export function LevelPips({ level, size = 'md', className }: LevelPipsProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      aria-label={`${level} 级，共 4 级`}
      role="img"
    >
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className={cn(
            'rounded-full transition-colors',
            size === 'sm' ? 'h-1.5 w-3' : 'h-2 w-4',
            step <= level ? 'bg-court' : 'bg-line',
          )}
        />
      ))}
    </span>
  );
}
