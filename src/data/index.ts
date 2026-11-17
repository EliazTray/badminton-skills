import { DOMAINS } from './domains';
import type { DomainId, Skill } from './schema';
import { SkillSchema } from './schema';
import { basicsSkills } from './skills/basics';
import { footworkSkills } from './skills/footwork';
import { serveReceiveSkills } from './skills/serve-receive';
import { rearCourtSkills } from './skills/rear-court';
import { frontCourtSkills } from './skills/front-court';
import { midcourtDefenseSkills } from './skills/midcourt-defense';
import { doublesSkills } from './skills/doubles';
import { tacticsSkills } from './skills/tactics';
import { netSpinVariants } from './skills/net-spin-variants';
import { frontCourtVariants } from './skills/front-court-variants';
import { rearCourtVariants } from './skills/rear-court-variants';
import { defenseVariants } from './skills/defense-variants';
import { footworkVariants } from './skills/footwork-variants';
import { tacticsVariants } from './skills/tactics-variants';
import { validateCatalog } from './validate';

export const CONTENT_VERSION = '2026.11.3';

const rawSkills: Skill[] = [
  ...basicsSkills,
  ...footworkSkills,
  ...serveReceiveSkills,
  ...rearCourtSkills,
  ...frontCourtSkills,
  ...midcourtDefenseSkills,
  ...doublesSkills,
  ...tacticsSkills,
  ...netSpinVariants,
  ...frontCourtVariants,
  ...rearCourtVariants,
  ...defenseVariants,
  ...footworkVariants,
  ...tacticsVariants,
];

export const ALL_SKILLS: Skill[] = SkillSchema.array().parse(rawSkills);
export const BASE_SKILLS = ALL_SKILLS.filter((skill) => !skill.parentSkillId);
export const VARIANT_SKILLS = ALL_SKILLS.filter((skill) => Boolean(skill.parentSkillId));
export const CATALOG_ISSUES = validateCatalog(ALL_SKILLS);

if (CATALOG_ISSUES.length > 0) {
  console.error('[skill-catalog] 内容校验未通过', CATALOG_ISSUES);
}

export const SKILL_BY_ID = new Map(ALL_SKILLS.map((skill) => [skill.id, skill]));

export const SKILLS_BY_DOMAIN = new Map<DomainId, Skill[]>(
  DOMAINS.map((domain) => [domain.id, ALL_SKILLS.filter((skill) => skill.domainId === domain.id)]),
);

export const BASE_SKILLS_BY_DOMAIN = new Map<DomainId, Skill[]>(
  DOMAINS.map((domain) => [
    domain.id,
    BASE_SKILLS.filter((skill) => skill.domainId === domain.id),
  ]),
);

export function getSkill(skillId: string): Skill | undefined {
  return SKILL_BY_ID.get(skillId);
}

export function getSkillsForDomain(domainId: DomainId): Skill[] {
  return SKILLS_BY_DOMAIN.get(domainId) ?? [];
}

export function getBaseSkillsForDomain(domainId: DomainId): Skill[] {
  return BASE_SKILLS_BY_DOMAIN.get(domainId) ?? [];
}

export function getVariantsForSkill(skillId: string): Skill[] {
  return VARIANT_SKILLS.filter((skill) => skill.parentSkillId === skillId);
}

export function getAnchorSkill(domainId: DomainId): Skill | undefined {
  return getBaseSkillsForDomain(domainId).find((skill) => skill.isAnchor);
}

export { DOMAINS };
export type { DomainId, Skill };
