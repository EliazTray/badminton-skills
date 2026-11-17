import type { Node } from '@xyflow/react';
import type { Level, Skill } from '../../data/schema';

export type SkillNodeKind = 'main' | 'ghost';

export interface SkillNodeData extends Record<string, unknown> {
  skill: Skill;
  kind: SkillNodeKind;
  level: Level;
  ready: boolean;
  href: string;
}

export type SkillFlowNode = Node<SkillNodeData, 'skill'>;
