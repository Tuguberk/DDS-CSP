import { useState, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import GraphCanvas from './components/GraphCanvas';
import ControlPanel from './components/ControlPanel';
import { initialNodes, initialEdges } from './data/sampleGraph';
import { findConstrainedPath } from './utils/algorithm';
import type { CostParams } from './types';

function App() {
  // State for QoS Coefficients
  const [params, setParams] = useState<CostParams>({
    alpha: 2000, // Prefers High Bandwidth slightly
    beta: 1.0,   // Moderate Latency penalty
    gamma: 1000, // Moderate Reliability penalty
  });

  // State for Constraint
  const [maxLatency, setMaxLatency] = useState<number>(50); // Default 50ms constraint

  // Graph Data
  const [nodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const selectedEdge = useMemo(() =>
    edges.find(e => e.id === selectedEdgeId) || null
    , [edges, selectedEdgeId]);

  const handleUpdateEdge = (edgeId: string, data: Partial<import('./types').EdgeData>) => {
    setEdges(prev => prev.map(e =>
      e.id === edgeId
        ? { ...e, data: { ...e.data, ...data } }
        : e
    ));
  };

  // Derive Path Result automatically when inputs change
  const startNodeId = '1';
  const targetNodeId = '5';

  const pathResult = useMemo(() => {
    return findConstrainedPath(
      nodes,
      edges,
      startNodeId,
      targetNodeId,
      maxLatency,
      params
    );
  }, [nodes, edges, startNodeId, targetNodeId, maxLatency, params]);

  return (
    <div className="flex w-screen h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar Controls */}
      <ControlPanel
        params={params}
        setParams={setParams}
        maxLatency={maxLatency}
        setMaxLatency={setMaxLatency}
        pathResult={pathResult}
        selectedEdge={selectedEdge}
        onUpdateEdge={handleUpdateEdge}
      />

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-gray-800/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm pointer-events-none">
          <h1 className="text-lg font-bold text-white">Weighted DDS Graph Routing</h1>
          <p className="text-xs text-gray-400">QoS-Constrained Shortest Path (CSP)</p>
        </div>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          path={pathResult.path}
          onEdgeClick={setSelectedEdgeId}
          selectedEdgeId={selectedEdgeId}
        />
      </div>
    </div>
  );
}

export default App;
