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

    if (skill.parentSkillId) {
      const parent = byId.get(skill.parentSkillId);
      if (!parent) {
        issues.push({
          code: 'missing-parent',
          message: `${skill.name} 的父技术 ${skill.parentSkillId} 不存在`,
        });
      } else {
        if (parent.id === skill.id) {
          issues.push({ code: 'self-parent', message: `${skill.name} 不能以自己为父技术` });
        }
        if (parent.parentSkillId) {
          issues.push({
            code: 'nested-parent',
            message: `${skill.name} 当前只支持一层细分，父技术 ${parent.name} 不能也是细分`,
          });
        }
        if (parent.domainId !== skill.domainId) {
          issues.push({
            code: 'parent-domain',
            message: `${skill.name} 和父技术 ${parent.name} 必须在同一领域`,
          });
        }
        if (skill.isAnchor) {
          issues.push({
            code: 'variant-anchor',
            message: `${skill.name} 是细分技术，不能同时作为领域锚点`,
          });
        }
      }
    }

    if (skill.role === 'specialized' && !skill.parentSkillId) {
      issues.push({
        code: 'missing-parent-role',
        message: `${skill.name} 标记为 specialized，但没有 parentSkillId`,
      });
    }

    if (skill.role === 'base' && skill.parentSkillId) {
      issues.push({
        code: 'base-with-parent',
        message: `${skill.name} 标记为 base，但又有 parentSkillId`,
      });
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
