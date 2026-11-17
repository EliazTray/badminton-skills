import { describe, expect, it } from 'vitest';
import { ALL_SKILLS, CATALOG_ISSUES, CONTENT_VERSION, DOMAINS } from './index';
import type { Skill } from './schema';
import { validateCatalog } from './validate';

const EXPECTED_DOMAIN_COUNTS: Record<string, number> = {
  basics: 5,
  footwork: 8,
  'serve-receive': 6,
  'rear-court': 9,
  'front-court': 8,
  'midcourt-defense': 8,
  doubles: 6,
  tactics: 7,
};

describe('skill catalog', () => {
  it('contains 8 domains and 57 skills', () => {
    expect(DOMAINS).toHaveLength(8);
    expect(ALL_SKILLS).toHaveLength(57);
    expect(CONTENT_VERSION).toMatch(/^\d{4}\.\d{2}\.\d{1,2}$/);
  });

  it('has the expected number of skills in every domain', () => {
    for (const domain of DOMAINS) {
      const count = ALL_SKILLS.filter((skill) => skill.domainId === domain.id).length;
      expect(count, domain.name).toBe(EXPECTED_DOMAIN_COUNTS[domain.id]);
    }
  });

  it('has no catalog integrity issues', () => {
    expect(CATALOG_ISSUES).toEqual([]);
  });

  it('has unique ids and names within domains', () => {
    const ids = ALL_SKILLS.map((skill) => skill.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const domain of DOMAINS) {
      const names = ALL_SKILLS.filter((skill) => skill.domainId === domain.id).map(
        (skill) => skill.name,
      );
      expect(new Set(names).size, domain.name).toBe(names.length);
    }
  });

  it('has exactly one anchor skill per domain', () => {
    for (const domain of DOMAINS) {
      const anchors = ALL_SKILLS.filter(
        (skill) => skill.domainId === domain.id && skill.isAnchor,
      );
      expect(anchors, domain.name).toHaveLength(1);
    }
  });

  it('gives every anchor 2–4 observable criteria at every level', () => {
    const anchors = ALL_SKILLS.filter((skill) => skill.isAnchor);
    expect(anchors).toHaveLength(8);

    for (const anchor of anchors) {
      expect(anchor.contentStatus).toBe('complete');
      for (const level of [1, 2, 3, 4] as const) {
        const criteria = anchor.rubric[level];
        expect(criteria.length, `${anchor.name} L${level}`).toBeGreaterThanOrEqual(2);
        expect(criteria.length, `${anchor.name} L${level}`).toBeLessThanOrEqual(4);
      }
    }
  });

  it('has valid prerequisite references and no self references', () => {
    const ids = new Set(ALL_SKILLS.map((skill) => skill.id));
    for (const skill of ALL_SKILLS) {
      for (const prerequisite of skill.prerequisites) {
        expect(ids.has(prerequisite.skillId), `${skill.name} -> ${prerequisite.skillId}`).toBe(true);
        expect(prerequisite.skillId).not.toBe(skill.id);
      }
    }
  });

  it('detects a missing prerequisite', () => {
    const fixture = cloneSkill(ALL_SKILLS[0]);
    fixture.id = 'fixture-missing-prerequisite';
    fixture.prerequisites = [{ skillId: 'does-not-exist', minLevel: 2 }];
    const issues = validateCatalog([...ALL_SKILLS, fixture]);
    expect(issues.some((issue) => issue.code === 'missing-prerequisite')).toBe(true);
  });

  it('detects a cycle', () => {
    const a = cloneSkill(ALL_SKILLS.find((skill) => skill.id === 'forehand-grip')!);
    const b = cloneSkill(ALL_SKILLS.find((skill) => skill.id === 'backhand-grip')!);
    a.id = 'fixture-cycle-a';
    a.prerequisites = [{ skillId: 'fixture-cycle-b', minLevel: 1 }];
    b.id = 'fixture-cycle-b';
    b.prerequisites = [{ skillId: 'fixture-cycle-a', minLevel: 1 }];
    const issues = validateCatalog([...ALL_SKILLS, a, b]);
    expect(issues.some((issue) => issue.code === 'cycle')).toBe(true);
  });
});

function cloneSkill(skill: Skill): Skill {
  return {
    ...skill,
    keyPoints: [...skill.keyPoints],
    commonErrors: [...skill.commonErrors],
    drills: skill.drills.map((drill) => ({ ...drill })),
    prerequisites: skill.prerequisites.map((prerequisite) => ({ ...prerequisite })),
    rubric: {
      1: [...skill.rubric[1]],
      2: [...skill.rubric[2]],
      3: [...skill.rubric[3]],
      4: [...skill.rubric[4]],
    },
    tags: [...skill.tags],
    relatedSkillIds: skill.relatedSkillIds ? [...skill.relatedSkillIds] : undefined,
  };
}
