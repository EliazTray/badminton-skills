import dagre from '@dagrejs/dagre';
import { BASE_SKILLS, SKILL_BY_ID, getBaseSkillsForDomain, getVariantsForSkill } from '../data';
import type { DomainId, Level, Skill, SkillProgress } from '../data/schema';
import { getSkillLevel, isSkillReady } from './progress';

const MAIN_NODE_WIDTH = 208;
const MAIN_NODE_HEIGHT = 98;
const GHOST_NODE_WIDTH = 168;
const GHOST_NODE_HEIGHT = 86;
const VARIANT_NODE_WIDTH = 184;
const VARIANT_NODE_HEIGHT = 90;

export interface DomainGraphNode {
  id: string;
  skill: Skill;
  kind: 'main' | 'ghost' | 'variant';
  level: Level;
  ready: boolean;
  position: { x: number; y: number };
}

export interface DomainGraphEdge {
  id: string;
  source: string;
  target: string;
  kind: 'prerequisite' | 'variant';
  met: boolean;
  minLevel: number;
}

export interface DomainGraph {
  nodes: DomainGraphNode[];
  edges: DomainGraphEdge[];
}

export function getDirectPrerequisiteSkills(skill: Skill): Skill[] {
  return skill.prerequisites
    .map((prerequisite) => SKILL_BY_ID.get(prerequisite.skillId))
    .filter((candidate): candidate is Skill => Boolean(candidate));
}

export function getPrerequisiteChain(skillId: string): Skill[] {
  const seen = new Set<string>();
  const result: Skill[] = [];

  function visit(currentId: string) {
    const skill = SKILL_BY_ID.get(currentId);
    if (!skill) return;
    for (const prerequisite of skill.prerequisites) {
      if (seen.has(prerequisite.skillId)) continue;
      seen.add(prerequisite.skillId);
      const prerequisiteSkill = SKILL_BY_ID.get(prerequisite.skillId);
      if (prerequisiteSkill) {
        result.push(prerequisiteSkill);
        visit(prerequisite.skillId);
      }
    }
  }

  visit(skillId);
  return result;
}

export function getDescendantCount(skillId: string): number {
  const descendants = new Set<string>();
  const queue = [skillId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const skill of BASE_SKILLS) {
      if (skill.prerequisites.some((prerequisite) => prerequisite.skillId === current)) {
        if (!descendants.has(skill.id)) {
          descendants.add(skill.id);
          queue.push(skill.id);
        }
      }
    }
  }

  return descendants.size;
}

export function buildDomainGraph(
  domainId: DomainId,
  progress: Record<string, SkillProgress>,
  expandedSkillId?: string | null,
): DomainGraph {
  const mainSkills = getBaseSkillsForDomain(domainId);
  const mainIds = new Set(mainSkills.map((skill) => skill.id));
  const ghostIds = new Set<string>();

  for (const skill of mainSkills) {
    for (const prerequisite of skill.prerequisites) {
      if (!mainIds.has(prerequisite.skillId)) {
        const prerequisiteSkill = SKILL_BY_ID.get(prerequisite.skillId);
        if (prerequisiteSkill) ghostIds.add(prerequisiteSkill.id);
      }
    }
  }

  const ghostSkills = [...ghostIds]
    .map((id) => SKILL_BY_ID.get(id))
    .filter((candidate): candidate is Skill => Boolean(candidate))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

  const expandedVariants = expandedSkillId
    ? getVariantsForSkill(expandedSkillId).filter((skill) => skill.domainId === domainId)
    : [];
  const variantIds = new Set(expandedVariants.map((skill) => skill.id));

  const graphSkills = [...ghostSkills, ...mainSkills, ...expandedVariants];
  const includedIds = new Set(graphSkills.map((skill) => skill.id));

  const layout = new dagre.graphlib.Graph();
  layout.setGraph({
    rankdir: 'LR',
    nodesep: 30,
    ranksep: 84,
    marginx: 24,
    marginy: 24,
  });
  layout.setDefaultEdgeLabel(() => ({}));

  for (const skill of graphSkills) {
    const isGhost = ghostIds.has(skill.id);
    const isVariant = variantIds.has(skill.id);
    layout.setNode(skill.id, {
      width: isGhost ? GHOST_NODE_WIDTH : isVariant ? VARIANT_NODE_WIDTH : MAIN_NODE_WIDTH,
      height: isGhost ? GHOST_NODE_HEIGHT : isVariant ? VARIANT_NODE_HEIGHT : MAIN_NODE_HEIGHT,
    });
  }

  const edges: DomainGraphEdge[] = [];
  for (const skill of [...ghostSkills, ...mainSkills]) {
    for (const prerequisite of skill.prerequisites) {
      if (!includedIds.has(prerequisite.skillId)) continue;
      layout.setEdge(prerequisite.skillId, skill.id);
      edges.push({
        id: `${prerequisite.skillId}->${skill.id}`,
        source: prerequisite.skillId,
        target: skill.id,
        kind: 'prerequisite',
        minLevel: prerequisite.minLevel,
        met: getSkillLevel(progress, prerequisite.skillId) >= prerequisite.minLevel,
      });
    }
  }

  for (const variant of expandedVariants) {
    if (!variant.parentSkillId || !includedIds.has(variant.parentSkillId)) continue;
    layout.setEdge(variant.parentSkillId, variant.id);
    edges.push({
      id: `${variant.parentSkillId}->${variant.id}`,
      source: variant.parentSkillId,
      target: variant.id,
      kind: 'variant',
      minLevel: 1,
      met: true,
    });
  }

  dagre.layout(layout);

  const nodes: DomainGraphNode[] = graphSkills.map((skill) => {
    const isGhost = ghostIds.has(skill.id);
    const isVariant = variantIds.has(skill.id);
    const node = layout.node(skill.id) as
      | { x?: number; y?: number; width?: number; height?: number }
      | undefined;
    const width = isGhost ? GHOST_NODE_WIDTH : isVariant ? VARIANT_NODE_WIDTH : MAIN_NODE_WIDTH;
    const height = isGhost ? GHOST_NODE_HEIGHT : isVariant ? VARIANT_NODE_HEIGHT : MAIN_NODE_HEIGHT;

    return {
      id: skill.id,
      skill,
      kind: isGhost ? 'ghost' : isVariant ? 'variant' : 'main',
      level: getSkillLevel(progress, skill.id),
      ready: isGhost ? true : isSkillReady(skill, progress),
      position: {
        x: (node?.x ?? 0) - width / 2,
        y: (node?.y ?? 0) - height / 2,
      },
    };
  });

  return { nodes, edges };
}
