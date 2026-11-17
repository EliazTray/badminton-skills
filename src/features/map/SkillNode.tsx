import type { KeyboardEvent } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowUpLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDomain } from '../../data/domains';
import { getStatusLabel } from '../../lib/progress';
import { cn } from '../../lib/cn';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';
import type { SkillFlowNode } from './types';

export function SkillNode({ data, selected }: NodeProps<SkillFlowNode>) {
  const navigate = useNavigate();
  const { skill, kind, level, href } = data;
  const domain = getDomain(skill.domainId);
  const isGhost = kind === 'ghost';

  const open = () => navigate(href);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${skill.name}，${isGhost ? '跨领域前置，' : ''}${getStatusLabel(level)}，${level} 级`}
      onClick={open}
      onKeyDown={onKeyDown}
      data-domain={skill.domainId}
      className={cn(
        'group relative flex h-full cursor-pointer flex-col rounded-2xl border bg-surface p-3.5 text-left shadow-[var(--shadow-soft)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-lg',
        isGhost
          ? 'min-h-[86px] w-[168px] border-dashed border-line bg-surface/70'
          : 'min-h-[98px] w-[208px] border-line',
        selected && 'border-court shadow-[0_0_0_2px_var(--court-soft)]',
      )}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold text-muted">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--domain)]"
            aria-hidden="true"
          />
          <span className="truncate">{domain.shortName}</span>
          {skill.isAnchor ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-court-soft px-1.5 py-0.5 text-[9px] text-court">
              <Sparkles className="h-2.5 w-2.5" />
              锚点
            </span>
          ) : null}
        </span>
        {isGhost ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-line px-1.5 py-0.5 text-[9px] font-medium text-faint">
            <ArrowUpLeft className="h-2.5 w-2.5" />
            跨领域
          </span>
        ) : (
          <StatusBadge level={level} className="shrink-0 px-2 py-0.5 text-[9px]" />
        )}
      </div>

      <p
        className={cn(
          'mt-2 font-bold leading-tight tracking-tight',
          isGhost ? 'text-[13px] text-muted' : 'text-base',
        )}
      >
        {skill.name}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
        <LevelPips level={level} size="sm" />
        <span className="text-[10px] font-semibold tabular-nums text-faint">L{level}</span>
      </div>
    </div>
  );
}
