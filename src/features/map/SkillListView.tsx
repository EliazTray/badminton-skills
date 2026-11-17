import { Link } from 'react-router-dom';
import { ChevronRight, Layers, Sparkles } from 'lucide-react';
import { getBaseSkillsForDomain, getSkillsForDomain, getVariantsForSkill } from '../../data';
import type { DomainId, SkillTier } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { getSkillLevel, getUnmetPrerequisites } from '../../lib/progress';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';

const TIER_LABELS: Record<SkillTier, string> = {
  foundation: '基础',
  core: '进阶',
  advanced: '实战',
};

const TIER_ORDER: SkillTier[] = ['foundation', 'core', 'advanced'];

export function SkillListView({
  domainId,
  query,
}: {
  domainId: DomainId;
  query: string;
}) {
  const progress = useAppStore((state) => state.data.progress);
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');
  const domainSkills = getSkillsForDomain(domainId);
  const baseSkills = getBaseSkillsForDomain(domainId);
  const variantSkills = domainSkills.filter((skill) => Boolean(skill.parentSkillId));

  const skills = (normalizedQuery ? [...baseSkills, ...variantSkills] : baseSkills).filter((skill) => {
    if (!normalizedQuery) return true;
    return (
      skill.name.toLocaleLowerCase('zh-CN').includes(normalizedQuery) ||
      skill.summary.toLocaleLowerCase('zh-CN').includes(normalizedQuery)
    );
  });

  if (skills.length === 0) {
    return (
      <div className="app-card p-8 text-center">
        <p className="text-sm font-semibold">没有找到匹配的技能</p>
        <p className="mt-1 text-xs text-muted">试试更短的关键词，或清空搜索。</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {TIER_ORDER.map((tier) => {
        const tierSkills = skills.filter((skill) => skill.tier === tier);
        if (tierSkills.length === 0) return null;

        return (
          <section key={tier} aria-labelledby={`tier-${tier}`}>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 id={`tier-${tier}`} className="text-xs font-bold tracking-wide text-muted">
                {TIER_LABELS[tier]}
              </h2>
              <span className="text-[11px] text-faint">{tierSkills.length} 项</span>
            </div>

            <ul className="app-card divide-y divide-line overflow-hidden">
              {tierSkills.map((skill) => {
                const level = getSkillLevel(progress, skill.id);
                const unmet = getUnmetPrerequisites(skill, progress);
                const variantCount = getVariantsForSkill(skill.id).length;

                return (
                  <li key={skill.id}>
                    <Link
                      to={`/map/${skill.id}?domain=${domainId}`}
                      className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface2/70"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold tracking-tight">{skill.name}</span>
                          {skill.isAnchor ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-court-soft px-1.5 py-0.5 text-[9px] font-semibold text-court">
                              <Sparkles className="h-2.5 w-2.5" />
                              锚点
                            </span>
                          ) : null}
                          {skill.contentStatus === 'draft' ? (
                            <span className="rounded-full border border-line px-1.5 py-0.5 text-[9px] font-medium text-faint">
                              草案
                            </span>
                          ) : null}
                          {skill.parentSkillId ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-court-soft px-1.5 py-0.5 text-[9px] font-semibold text-court">
                              <Layers className="h-2.5 w-2.5" />
                              细分
                            </span>
                          ) : null}
                          {variantCount > 0 ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-court-soft px-1.5 py-0.5 text-[9px] font-semibold text-court">
                              <Layers className="h-2.5 w-2.5" />
                              {variantCount} 细分
                            </span>
                          ) : null}
                          {unmet.length > 0 ? (
                            <span className="rounded-full bg-amber-soft px-1.5 py-0.5 text-[9px] font-medium text-amber">
                              前置待补
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted">
                          {skill.summary}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-faint">
                          <span>{skill.prerequisites.length} 个前置</span>
                          <span aria-hidden="true">·</span>
                          <span>{skill.drills.length} 个练习</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <LevelPips level={level} size="sm" />
                          <StatusBadge level={level} />
                        </div>
                        <ChevronRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-court" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
