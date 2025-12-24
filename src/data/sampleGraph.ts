import type { Node, DijkstraEdge } from '../types';

export const initialNodes: Node[] = [
    { id: '1', label: 'Sensor A', x: 30, y: 175, type: 'source' },
    { id: '2', label: 'Aggregator (High BW)', x: 250, y: 100 },
    { id: '3', label: 'Real-Time Controller', x: 250, y: 250 },
    { id: '4', label: 'Storage', x: 520, y: 70 },
    { id: '5', label: 'Main Computer', x: 550, y: 250, type: 'target' },
    { id: '6', label: 'Wireless Backup', x: 200, y: 400 },
];

export const initialEdges: DijkstraEdge[] = [
    // Path 1 (Top): High Bandwidth (Cheap), High Latency, Good Reliability
    // Good when Alpha (Bandwidth importance) is HIGH.
    {
        id: 'e1-2', source: '1', target: '2',
        data: { bandwidth: 1000, latency: 40, reliability: 0.99 }
    },
    {
        id: 'e2-5', source: '2', target: '5',
        data: { bandwidth: 1000, latency: 40, reliability: 0.99 }
    },

    // Path 2 (Middle): Low Bandwidth (Expensive), Low Latency, Excellent Reliability
    // Good when Beta (Latency importance) is HIGH or Gamma (Reliability) is HIGH.
    {
        id: 'e1-3', source: '1', target: '3',
        data: { bandwidth: 10, latency: 5, reliability: 0.999 }
    },
    {
        id: 'e3-5', source: '3', target: '5',
        data: { bandwidth: 10, latency: 5, reliability: 0.999 }
    },

    // Path 3 (Bottom via 6): Medium Bandwidth, Medium Latency, Poor Reliability
    // Trap path: Looks okay-ish until you krank up Gamma.
    {
        id: 'e1-6', source: '1', target: '6',
        data: { bandwidth: 100, latency: 25, reliability: 0.7 }
    },
    {
        id: 'e6-5', source: '6', target: '5',
        data: { bandwidth: 100, latency: 25, reliability: 0.7 }
    },

    // Detour for complexity
    {
        id: 'e2-4', source: '2', target: '4',
        data: { bandwidth: 500, latency: 20, reliability: 0.9 }
    },
];
