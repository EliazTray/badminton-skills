import type { Node } from '@xyflow/react';
import type { Level, Skill } from '../../data/schema';

export type SkillNodeKind = 'main' | 'ghost' | 'variant';

export interface SkillNodeData extends Record<string, unknown> {
  skill: Skill;
  kind: SkillNodeKind;
  level: Level;
  ready: boolean;
  variantCount: number;
  expanded: boolean;
  href: string;
  onToggleVariants?: () => void;
}

export type SkillFlowNode = Node<SkillNodeData, 'skill'>;
