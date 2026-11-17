import { getDomain } from '../../data/domains';
import type { DomainId } from '../../data/schema';
import { cn } from '../../lib/cn';

export function DomainDot({ domainId, className }: { domainId: DomainId; className?: string }) {
  return (
    <span
      data-domain={domainId}
      className={cn('inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--domain)]', className)}
      aria-hidden="true"
    />
  );
}

export function DomainBadge({
  domainId,
  className,
  dotOnly = false,
}: {
  domainId: DomainId;
  className?: string;
  dotOnly?: boolean;
}) {
  const domain = getDomain(domainId);
  return (
    <span
      data-domain={domainId}
      className={cn('inline-flex items-center gap-2 text-xs font-medium text-muted', className)}
    >
      <DomainDot domainId={domainId} />
      {!dotOnly && domain.name}
    </span>
  );
}
