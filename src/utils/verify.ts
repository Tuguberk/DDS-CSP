import { findConstrainedPath } from './algorithm';
import type { Node, DijkstraEdge, CostParams } from '../types';

const verify = () => {
    console.log("Verifying Algorithm...");

    const nodes: Node[] = [
        { id: 'A', label: 'A', x: 0, y: 0 },
        { id: 'B', label: 'B', x: 0, y: 0 },
        { id: 'C', label: 'C', x: 0, y: 0 }, // Unused
    ];

    // Scenario:
    // Path 1 (Direct A->B): High Bandwidth (Cheap), High Latency (Slow). Cost low.
    // Path 2 (via C? No, just parallel edge if supported, or A->C->B). Let's use parallel edges logic or just 2 paths.
    // My algorithm supports multiple edges between nodes? 
    // `getNeighbors` filters by source. If multiple edges exist, it iterates all.
    // Yes, multiple edges are supported.

    const params: CostParams = {
        alpha: 1000,
        beta: 1,
        gamma: 0 // Ignore reliability for now
    };

    const edges: DijkstraEdge[] = [
        // Edge 1: Cheap but Slow
        // Bw = 1000 => Alpha/Bw = 1. Lat = 50. Cost = 51.
        {
            id: 'e1', source: 'A', target: 'B',
            data: { bandwidth: 1000, latency: 50, reliability: 1 }
        },
        // Edge 2: Expensive but Fast
        // Bw = 10 => Alpha/Bw = 100. Lat = 10. Cost = 110.
        {
            id: 'e2', source: 'A', target: 'B',
            data: { bandwidth: 10, latency: 10, reliability: 1 }
        }
    ];

    // Test 1: Constraint 60ms. Should pick Cheap (Edge 1, Cost 51).
    const res1 = findConstrainedPath(nodes, edges, 'A', 'B', 60, params);
    console.log(`Test 1 (Max 60): Cost=${res1.totalCost.toFixed(0)} Lat=${res1.totalLatency}`);
    if (Math.abs(res1.totalCost - 51) < 0.1 && res1.totalLatency === 50) {
        console.log("✅ Passed (Picked Cheap/Slow)");
    } else {
        console.error("❌ Failed 1", res1);
    }

    // Test 2: Constraint 40ms. Should pick Expensive (Edge 2, Cost 110) because Edge 1 is too slow.
    const res2 = findConstrainedPath(nodes, edges, 'A', 'B', 40, params);
    console.log(`Test 2 (Max 40): Cost=${res2.totalCost.toFixed(0)} Lat=${res2.totalLatency}`);
    if (Math.abs(res2.totalCost - 110) < 0.1 && res2.totalLatency === 10) {
        console.log("✅ Passed (Picked Expensive/Fast)");
    } else {
        console.error("❌ Failed 2", res2);
    }
};

verify();
