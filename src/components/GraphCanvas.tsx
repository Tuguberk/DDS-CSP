import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, type Node as FlowNode, type Edge as FlowEdge, MarkerType } from '@xyflow/react';
import type { Node, DijkstraEdge } from '../types';

interface GraphCanvasProps {
    nodes: Node[];
    edges: DijkstraEdge[];
    path: string[];
    onEdgeClick: (edgeId: string | null) => void;
    selectedEdgeId: string | null;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges, path, onEdgeClick, selectedEdgeId }) => {
    // Convert our nodes to React Flow nodes
    const flowNodes: FlowNode[] = useMemo(() => {
        return nodes.map((node) => {
            let style = { background: '#1f2937', color: '#e5e7eb', border: '1px solid #4b5563' };

            if (node.type === 'source') {
                style = { background: '#059669', color: 'white', border: '2px solid #34d399' };
            } else if (node.type === 'target') {
                style = { background: '#dc2626', color: 'white', border: '2px solid #f87171' };
            } else if (path.includes(node.id)) {
                style = { background: '#3b82f6', color: 'white', border: '2px solid #60a5fa' };
            }

            return {
                id: node.id,
                position: { x: node.x, y: node.y },
                data: { label: node.label },
                type: 'default', // Force default type for consistent rendering, use style for visual distinction
                style: style,
            };
        });
    }, [nodes, path]);

    // Convert our edges to React Flow edges with highlighting
    const flowEdges: FlowEdge[] = useMemo(() => {
        return edges.map((edge) => {
            // Check if this edge is part of the active path
            let isPathEdge = false;
            for (let i = 0; i < path.length - 1; i++) {
                if (path[i] === edge.source && path[i + 1] === edge.target) {
                    isPathEdge = true;
                    break;
                }
            }

            const isSelected = edge.id === selectedEdgeId;
            const relPerc = Math.round(edge.data.reliability * 100);

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: 'smoothstep', // nice clean lines
                animated: isPathEdge,
                label: `${edge.data.bandwidth}M / ${edge.data.latency}ms / ${relPerc}%`,
                labelStyle: { fill: isSelected ? '#3b82f6' : '#9ca3af', fontSize: 10, fontWeight: isSelected ? 700 : 400 },
                style: {
                    stroke: isSelected ? '#3b82f6' : (isPathEdge ? '#60a5fa' : '#4b5563'),
                    strokeWidth: isSelected || isPathEdge ? 3 : 1,
                    cursor: 'pointer',
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isSelected ? '#3b82f6' : (isPathEdge ? '#60a5fa' : '#4b5563'),
                },
            };
        });
    }, [edges, path, selectedEdgeId]);

    return (
        <div className="w-full h-full bg-gray-900">
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                onEdgeClick={(_, edge) => onEdgeClick(edge.id)}
                onPaneClick={() => onEdgeClick(null)}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#374151" gap={20} />
                <Controls className="bg-gray-800 border-gray-700 fill-gray-200 text-gray-200" />
            </ReactFlow>
        </div>
    );
};

export default GraphCanvas;
