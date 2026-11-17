import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowUpLeft, Layers, Minus, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDomain } from '../../data/domains';
import { cn } from '../../lib/cn';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';
import type { SkillFlowNode } from './types';

export function SkillNode({ data, selected }: NodeProps<SkillFlowNode>) {
  const navigate = useNavigate();
  const { skill, kind, level, href, variantCount, expanded, onToggleVariants } = data;
  const domain = getDomain(skill.domainId);
  const isGhost = kind === 'ghost';
  const isVariant = kind === 'variant';

  return (
    <div
      data-domain={skill.domainId}
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border bg-surface p-3.5 text-left shadow-[var(--shadow-soft)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-lg',
        isGhost
          ? 'min-h-[86px] w-[168px] border-dashed border-line bg-surface/70'
          : isVariant
            ? 'min-h-[90px] w-[184px] border-court/35 bg-court-soft/20'
            : 'min-h-[98px] w-[208px] border-line',
        selected && 'border-court shadow-[0_0_0_2px_var(--court-soft)]',
      )}
    >
      <button
        type="button"
        onClick={() => navigate(href)}
        aria-label={`打开 ${skill.name}${isVariant ? '细分' : ''}详情`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court"
      />

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="pointer-events-none relative z-20 flex flex-col">
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
            {isVariant ? (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-court/30 px-1.5 py-0.5 text-[9px] text-court">
                <Layers className="h-2.5 w-2.5" />
                细分
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
            isGhost ? 'text-[13px] text-muted' : isVariant ? 'text-sm' : 'text-base',
          )}
        >
          {skill.name}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
          <LevelPips level={level} size="sm" />
          {variantCount > 0 && !isGhost ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleVariants?.();
              }}
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? `收起 ${skill.name} 的 ${variantCount} 个细分`
                  : `展开 ${skill.name} 的 ${variantCount} 个细分`
              }
              className="pointer-events-auto relative z-30 inline-flex min-h-7 items-center gap-0.5 rounded-full bg-court px-2 text-[10px] font-bold text-[var(--court-contrast)] transition-opacity hover:opacity-90"
            >
              {expanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {variantCount} 细分
            </button>
          ) : (
            <span className="text-[10px] font-semibold tabular-nums text-faint">
              L{level}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
