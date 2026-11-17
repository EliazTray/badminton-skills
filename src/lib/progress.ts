import { ALL_SKILLS, BASE_SKILLS, DOMAINS, VARIANT_SKILLS, getAnchorSkill, getBaseSkillsForDomain } from '../data';
import type { DomainId, Level, Skill, SkillProgress } from '../data/schema';
import { LEVEL_NAMES } from '../data/schema';

export type SkillStatus = 'not-started' | 'learning' | 'stable' | 'match-ready';

export interface PrerequisiteState {
  skill: Skill;
  currentLevel: Level;
  minLevel: 1 | 2 | 3 | 4;
  met: boolean;
}

export interface DomainStats {
  domainId: DomainId;
  name: string;
  shortName: string;
  total: number;
  started: number;
  stable: number;
  averageLevel: number;
  percent: number;
  anchorLevel: Level;
  anchorName?: string;
}

export interface OverallStats {
  total: number;
  started: number;
  stable: number;
  matchReady: number;
  averageLevel: number;
  variantTotal: number;
  variantStarted: number;
  variantStable: number;
}

export function getSkillLevel(progress: Record<string, SkillProgress>, skillId: string): Level {
  return progress[skillId]?.level ?? 0;
}

export function getSkillStatus(level: Level): SkillStatus {
  if (level === 0) return 'not-started';
  if (level <= 2) return 'learning';
  if (level === 3) return 'stable';
  return 'match-ready';
}

export function getStatusLabel(level: Level): string {
  if (level === 0) return LEVEL_NAMES[0];
  if (level <= 2) return '在练';
  if (level === 3) return LEVEL_NAMES[3];
  return LEVEL_NAMES[4];
}

export function getPrerequisiteStates(
  skill: Skill,
  progress: Record<string, SkillProgress>,
): PrerequisiteState[] {
  return skill.prerequisites.map((prerequisite) => {
    const prerequisiteSkill = ALL_SKILLS.find((candidate) => candidate.id === prerequisite.skillId);
    if (!prerequisiteSkill) {
      throw new Error(`Unknown prerequisite: ${prerequisite.skillId}`);
    }
    const currentLevel = getSkillLevel(progress, prerequisiteSkill.id);
    return {
      skill: prerequisiteSkill,
      currentLevel,
      minLevel: prerequisite.minLevel,
      met: currentLevel >= prerequisite.minLevel,
    };
  });
}

export function getUnmetPrerequisites(
  skill: Skill,
  progress: Record<string, SkillProgress>,
): PrerequisiteState[] {
  return getPrerequisiteStates(skill, progress).filter((state) => !state.met);
}

export function isSkillReady(skill: Skill, progress: Record<string, SkillProgress>): boolean {
  return getUnmetPrerequisites(skill, progress).length === 0;
}

export function getFrontierSkills(progress: Record<string, SkillProgress>): Skill[] {
  return BASE_SKILLS.filter(
    (skill) => getSkillLevel(progress, skill.id) < 4 && isSkillReady(skill, progress),
  );
}

export function getDomainStats(
  progress: Record<string, SkillProgress>,
  domainId: DomainId,
): DomainStats {
  const domain = DOMAINS.find((candidate) => candidate.id === domainId);
  if (!domain) throw new Error(`Unknown domain: ${domainId}`);

  const skills = getBaseSkillsForDomain(domainId);
  const total = skills.length;
  const levels = skills.map((skill) => getSkillLevel(progress, skill.id));
  const started = levels.filter((level) => level > 0).length;
  const stable = levels.filter((level) => level >= 3).length;
  const averageLevel = total === 0 ? 0 : levels.reduce<number>((sum, level) => sum + level, 0) / total;
  const anchor = getAnchorSkill(domainId);

  return {
    domainId,
    name: domain.name,
    shortName: domain.shortName,
    total,
    started,
    stable,
    averageLevel,
    percent: (averageLevel / 4) * 100,
    anchorLevel: anchor ? getSkillLevel(progress, anchor.id) : 0,
    anchorName: anchor?.name,
  };
}

export function getAllDomainStats(progress: Record<string, SkillProgress>): DomainStats[] {
  return DOMAINS.map((domain) => getDomainStats(progress, domain.id));
}

export function getOverallStats(progress: Record<string, SkillProgress>): OverallStats {
  const levels = BASE_SKILLS.map((skill) => getSkillLevel(progress, skill.id));
  const variantLevels = VARIANT_SKILLS.map((skill) => getSkillLevel(progress, skill.id));
  return {
    total: BASE_SKILLS.length,
    started: levels.filter((level) => level > 0).length,
    stable: levels.filter((level) => level >= 3).length,
    matchReady: levels.filter((level) => level === 4).length,
    averageLevel: levels.reduce<number>((sum, level) => sum + level, 0) / Math.max(levels.length, 1),
    variantTotal: VARIANT_SKILLS.length,
    variantStarted: variantLevels.filter((level) => level > 0).length,
    variantStable: variantLevels.filter((level) => level >= 3).length,
  };
}
