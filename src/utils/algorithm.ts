import type { Node, DijkstraEdge, CostParams, PathResult } from '../types';

export const calculateEdgeCost = (
    edge: DijkstraEdge,
    params: CostParams
): number => {
    const { bandwidth, latency, reliability } = edge.data;
    const { alpha, beta, gamma } = params;

    // Avoid division by zero
    const safeBandwidth = bandwidth > 0 ? bandwidth : 0.001;

    // Cost function from paper:
    // Cost = (alpha / Bw) + (beta * L) + (gamma * (1 - R))
    return (
        (alpha / safeBandwidth) +
        (beta * latency) +
        (gamma * (1 - reliability))
    );
};

export const findConstrainedPath = (
    nodes: Node[],
    edges: DijkstraEdge[],
    startId: string,
    endId: string,
    maxLatency: number,
    params: CostParams
): PathResult => {
    const minCost: Record<string, number> = {};
    const pathLatency: Record<string, number> = {};
    const predecessors: Record<string, string | null> = {};

    // Initialize
    nodes.forEach(node => {
        minCost[node.id] = Infinity;
        pathLatency[node.id] = 0;
        predecessors[node.id] = null;
    });

    minCost[startId] = 0;

    // Priority Queue: [cost, nodeId]
    // Using simple array and sorting for O(N^2) which is fine for N < 100
    const pq: { cost: number; id: string }[] = [{ cost: 0, id: startId }];

    // Helper to find neighbors
    const getNeighbors = (nodeId: string) => {
        return edges.filter(e => e.source === nodeId);
    };

    while (pq.length > 0) {
        // Pop element with lowest cost
        pq.sort((a, b) => a.cost - b.cost); // Ascending cost
        const current = pq.shift()!;
        const u = current.id;
        const c = current.cost;

        // Optimization: If we found a cheaper way to u already, skip (standard dijkstra lazy deletion)
        // Though with the array implementation we usually just process.
        // However, since we might push multiple times, we should check.
        if (c > minCost[u]) continue;

        if (u === endId) {
            // Reconstruct path
            const path: string[] = [];
            let curr: string | null = endId;
            while (curr) {
                path.unshift(curr);
                curr = predecessors[curr];
            }
            return {
                path,
                totalCost: c,
                totalLatency: pathLatency[endId]
            };
        }

        const neighbors = getNeighbors(u);
        for (const edge of neighbors) {
            const v = edge.target;
            const edgeCost = calculateEdgeCost(edge, params);
            const edgeL = edge.data.latency;

            const newCost = minCost[u] + edgeCost;
            const newLat = pathLatency[u] + edgeL;

            // Constraint Check (Pruning)
            if (newLat <= maxLatency) {
                if (newCost < minCost[v]) {
                    minCost[v] = newCost;
                    pathLatency[v] = newLat;
                    predecessors[v] = u;
                    pq.push({ cost: newCost, id: v });
                }
            }
        }
    }

    return {
        path: [],
        totalCost: Infinity,
        totalLatency: 0,
        error: "No Possible Path"
    };
};
