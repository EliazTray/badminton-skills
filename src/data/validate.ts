import type { Skill } from './schema';
import { DOMAINS } from './domains';

export interface CatalogIssue {
  code: string;
  message: string;
}

export function validateCatalog(skills: Skill[]): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const byId = new Map<string, Skill>();
  const ids = new Set<string>();
  const names = new Set<string>();

  for (const skill of skills) {
    if (ids.has(skill.id)) {
      issues.push({ code: 'duplicate-id', message: `技能 ID 重复：${skill.id}` });
    }
    ids.add(skill.id);
    byId.set(skill.id, skill);

    const nameKey = `${skill.domainId}:${skill.name}`;
    if (names.has(nameKey)) {
      issues.push({ code: 'duplicate-name', message: `同一领域内技能名重复：${skill.name}` });
    }
    names.add(nameKey);
  }

  for (const domain of DOMAINS) {
    const domainSkills = skills.filter((skill) => skill.domainId === domain.id);
    if (domainSkills.length === 0) {
      issues.push({ code: 'empty-domain', message: `领域 ${domain.name} 没有技能` });
    }
    const anchors = domainSkills.filter((skill) => skill.isAnchor);
    if (anchors.length !== 1) {
      issues.push({
        code: 'anchor-count',
        message: `领域 ${domain.name} 需要恰好 1 个锚点技能，当前 ${anchors.length} 个`,
      });
    }
  }

  for (const skill of skills) {
    if (skill.prerequisites.some((prerequisite) => prerequisite.skillId === skill.id)) {
      issues.push({ code: 'self-reference', message: `${skill.name} 不能以自己为前置` });
    }

    for (const prerequisite of skill.prerequisites) {
      const target = byId.get(prerequisite.skillId);
      if (!target) {
        issues.push({
          code: 'missing-prerequisite',
          message: `${skill.name} 的前置 ${prerequisite.skillId} 不存在`,
        });
      } else if (prerequisite.minLevel < 1 || prerequisite.minLevel > 4) {
        issues.push({
          code: 'invalid-min-level',
          message: `${skill.name} 的前置 ${target.name} 等级要求必须是 1–4`,
        });
      }
    }

    for (const relatedId of skill.relatedSkillIds ?? []) {
      if (!byId.has(relatedId)) {
        issues.push({
          code: 'missing-related',
          message: `${skill.name} 的相关技能 ${relatedId} 不存在`,
        });
      }
    }

    if (skill.contentStatus === 'complete') {
      for (const level of [1, 2, 3, 4] as const) {
        if (skill.rubric[level].length < 2) {
          issues.push({
            code: 'complete-rubric-too-thin',
            message: `${skill.name} 标记为完整，但 L${level} 标准少于 2 条`,
          });
        }
      }
    }
  }

  issues.push(...findCycles(skills, byId));
  return issues;
}

function findCycles(skills: Skill[], byId: Map<string, Skill>): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(skill: Skill, path: string[]) {
    if (visiting.has(skill.id)) {
      issues.push({
        code: 'cycle',
        message: `前置关系存在环：${[...path, skill.name].join(' → ')}`,
      });
      return;
    }
    if (visited.has(skill.id)) return;

    visiting.add(skill.id);
    for (const prerequisite of skill.prerequisites) {
      const target = byId.get(prerequisite.skillId);
      if (target) visit(target, [...path, skill.name]);
    }
    visiting.delete(skill.id);
    visited.add(skill.id);
  }

  for (const skill of skills) visit(skill, []);
  return issues;
}
