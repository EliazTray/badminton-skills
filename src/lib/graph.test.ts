import { describe, expect, it } from 'vitest';
import { ALL_SKILLS } from '../data';
import type { SkillProgress } from '../data/schema';
import {
  buildDomainGraph,
  getDescendantCount,
  getPrerequisiteChain,
} from './graph';
import { getFrontierSkills, getSkillLevel } from './progress';

function progressFor(ids: string[], level: 1 | 2 | 3 | 4): Record<string, SkillProgress> {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      {
        level,
        assessments: [
          {
            id: `a-${id}`,
            date: '2026-11-17',
            level,
            kind: 'baseline' as const,
            criteriaSnapshot: [],
            contentVersion: 'test',
          },
        ],
      },
    ]),
  );
}

describe('graph helpers', () => {
  it('builds a domain graph with cross-domain ghost nodes and finite positions', () => {
    const graph = buildDomainGraph('rear-court', {});
    const ids = graph.nodes.map((node) => node.id);

    expect(ids).toContain('forehand-clear');
    expect(ids).toContain('forehand-grip');
    expect(ids).toContain('rearcourt-footwork');

    const ghosts = graph.nodes.filter((node) => node.kind === 'ghost');
    expect(ghosts.length).toBeGreaterThan(0);

    for (const node of graph.nodes) {
      expect(Number.isFinite(node.position.x)).toBe(true);
      expect(Number.isFinite(node.position.y)).toBe(true);
    }

    expect(new Set(ids).size).toBe(ids.length);
    expect(graph.edges.length).toBeGreaterThan(0);
  });

  it('marks prerequisite edges as met when levels are sufficient', () => {
    const forehandClear = ALL_SKILLS.find((skill) => skill.id === 'forehand-clear')!;
    const prerequisiteIds = forehandClear.prerequisites.map((item) => item.skillId);
    const graph = buildDomainGraph('rear-court', progressFor(prerequisiteIds, 4));
    const edge = graph.edges.find((item) => item.target === 'forehand-clear');
    expect(edge?.met).toBe(true);
  });

  it('walks prerequisite chains without duplicates', () => {
    const chain = getPrerequisiteChain('four-corners');
    const ids = chain.map((skill) => skill.id);
    expect(ids).toContain('forehand-clear');
    expect(ids).toContain('net-shot');
    expect(ids).toContain('forehand-grip');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('counts downstream skills', () => {
    expect(getDescendantCount('forehand-grip')).toBeGreaterThan(
      getDescendantCount('four-corners'),
    );
  });

  it('only surfaces frontier skills with met prerequisites', () => {
    const frontier = getFrontierSkills({});
    const ids = frontier.map((skill) => skill.id);

    expect(ids).toContain('forehand-grip');
    expect(ids).toContain('ready-stance');
    expect(ids).not.toContain('forehand-clear');

    for (const skill of frontier) {
      expect(skill.prerequisites.every((item) => getSkillLevel({}, item.skillId) >= item.minLevel)).toBe(
        true,
      );
    }
  });
});
