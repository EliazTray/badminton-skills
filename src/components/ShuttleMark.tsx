import { cn } from '../lib/cn';

export function ShuttleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="羽球图谱标志"
      className={cn('h-6 w-6', className)}
      fill="none"
    >
      <circle cx="16" cy="22.5" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 19 8 6l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 18V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m20 19 4-13-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 20.5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
