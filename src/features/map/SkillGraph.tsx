import { useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
} from '@xyflow/react';
import type { DomainId } from '../../data/schema';
import { getVariantsForSkill } from '../../data';
import { buildDomainGraph } from '../../lib/graph';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { useAppStore } from '../../store/appStore';
import { SkillNode } from './SkillNode';
import type { SkillFlowNode } from './types';

const nodeTypes = { skill: SkillNode };

export function SkillGraph({ domainId }: { domainId: DomainId }) {
  const progress = useAppStore((state) => state.data.progress);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const graph = useMemo(() => buildDomainGraph(domainId, progress), [domainId, progress]);

  const nodes = useMemo<SkillFlowNode[]>(
    () =>
      graph.nodes.map((node) => ({
        id: node.id,
        type: 'skill',
        position: node.position,
        data: {
          skill: node.skill,
          kind: node.kind,
          level: node.level,
          ready: node.ready,
          variantCount: node.kind === 'main' ? getVariantsForSkill(node.skill.id).length : 0,
          href: `/map/${node.skill.id}?domain=${domainId}`,
        },
        style: {
          width: node.kind === 'ghost' ? 168 : 208,
          height: node.kind === 'ghost' ? 86 : 98,
        },
        draggable: false,
        selectable: true,
      })),
    [domainId, graph.nodes],
  );

  const edges = useMemo<Edge[]>(
    () =>
      graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        style: {
          stroke: edge.met ? 'var(--court)' : 'var(--faint)',
          strokeWidth: edge.met ? 2 : 1.6,
          strokeDasharray: edge.met ? undefined : '5 5',
          opacity: edge.met ? 0.9 : 0.75,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.met ? 'var(--court)' : 'var(--faint)',
          width: 16,
          height: 16,
        },
      })),
    [graph.edges],
  );

  if (graph.nodes.length === 0) {
    return (
      <div className="app-card grid min-h-[360px] place-items-center p-6 text-sm text-muted">
        这个领域还没有技能节点。
      </div>
    );
  }

  return (
    <div className="graph-canvas h-[540px] w-full overflow-hidden rounded-[1.5rem] border border-line md:h-[640px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView={!isMobile}
        fitViewOptions={{ padding: 0.1, maxZoom: 1.1 }}
        defaultViewport={isMobile ? { x: 16, y: 24, zoom: 0.82 } : undefined}
        minZoom={0.32}
        maxZoom={1.4}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elementsSelectable
        panOnScroll={false}
        zoomOnDoubleClick={false}
        aria-label="领域技能图谱"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--line)" />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
    </div>
  );
}
