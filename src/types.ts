export type NodeId = string;

export interface Node {
    id: NodeId;
    label: string;
    x: number;
    y: number;
    type?: 'source' | 'target' | 'default';
}

export interface EdgeData {
    bandwidth: number; // Mbps
    latency: number; // ms
    reliability: number; // 0-1
    weight?: number; // Calculated cost
}

// React Flow edge type with our custom data
export interface DijkstraEdge {
    id: string;
    source: NodeId;
    target: NodeId;
    data: EdgeData;
    type?: string;
    animated?: boolean;
    style?: React.CSSProperties;
}

export interface CostParams {
    alpha: number; // Weight for 1/Bandwidth
    beta: number;  // Weight for Latency
    gamma: number; // Weight for Reliability
}

export interface PathResult {
    path: NodeId[];
    totalCost: number;
    totalLatency: number;
    error?: string;
}
