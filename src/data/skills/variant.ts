import type { DomainId, Drill, Skill, SkillTag, SkillTier, TermStatus } from '../schema';

export interface VariantSeed {
  id: string;
  domainId: DomainId;
  name: string;
  parentSkillId: string;
  parentMinLevel?: 1 | 2 | 3 | 4;
  tier: SkillTier;
  summary: string;
  keyPoints: string[];
  errors: string[];
  drills: Drill[];
  rubric: Record<1 | 2 | 3 | 4, string[]>;
  tags: SkillTag[];
  relatedSkillIds?: string[];
  aliases?: string[];
  termStatus?: TermStatus;
}

export function defineVariant(seed: VariantSeed): Skill {
  return {
    id: seed.id,
    domainId: seed.domainId,
    name: seed.name,
    tier: seed.tier,
    parentSkillId: seed.parentSkillId,
    role: 'specialized',
    aliases: seed.aliases,
    termStatus: seed.termStatus ?? 'needs-review',
    contentStatus: 'draft',
    summary: seed.summary,
    keyPoints: seed.keyPoints,
    commonErrors: seed.errors,
    drills: seed.drills,
    prerequisites: [{ skillId: seed.parentSkillId, minLevel: seed.parentMinLevel ?? 2 }],
    rubric: seed.rubric,
    tags: seed.tags,
    relatedSkillIds: seed.relatedSkillIds,
  };
}
