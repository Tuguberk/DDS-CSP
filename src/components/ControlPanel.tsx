import React from 'react';
import type { CostParams, PathResult, DijkstraEdge, EdgeData } from '../types';
import { Settings, Activity, Clock, ShieldCheck, Network, Edit2 } from 'lucide-react';

interface ControlPanelProps {
    params: CostParams;
    setParams: (params: CostParams) => void;
    maxLatency: number;
    setMaxLatency: (val: number) => void;
    pathResult: PathResult;
    selectedEdge: DijkstraEdge | null;
    onUpdateEdge: (id: string, data: Partial<EdgeData>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    params,
    setParams,
    maxLatency,
    setMaxLatency,
    pathResult,
    selectedEdge,
    onUpdateEdge,
}) => {
    const handleChange = (key: keyof CostParams, value: number) => {
        setParams({ ...params, [key]: value });
    };

    return (
        <div className="w-80 h-full bg-gray-800 border-r border-gray-700 p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                    <Settings className="w-5 h-5 text-blue-400" />
                    Configuration
                </h2>
                <p className="text-gray-400 text-sm">Tune QoS weights and constraints.</p>
            </div>

            {/* Edge Editor */}
            {selectedEdge ? (
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg space-y-4">
                    <h3 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Link: {selectedEdge.id}
                    </h3>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Bandwidth (Mbps)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm font-mono focus:border-blue-500 outline-none"
                            value={selectedEdge.data.bandwidth}
                            onChange={(e) => onUpdateEdge(selectedEdge.id, { bandwidth: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Latency (ms)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm font-mono focus:border-blue-500 outline-none"
                            value={selectedEdge.data.latency}
                            onChange={(e) => onUpdateEdge(selectedEdge.id, { latency: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Reliability (0-1)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm font-mono focus:border-blue-500 outline-none"
                            value={selectedEdge.data.reliability}
                            onChange={(e) => onUpdateEdge(selectedEdge.id, { reliability: Math.min(1, Math.max(0, Number(e.target.value))) })}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800 border border-dashed border-gray-600 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Select an edge to edit properties</p>
                </div>
            )}

            <div className="border-t border-gray-700 my-2"></div>

            {/* QoS Weights */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Cost Coefficients</h3>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-blue-300 flex items-center gap-1">
                            <Network className="w-3 h-3" /> Alpha (Bandwidth)
                        </span>
                        <span>{params.alpha}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={params.alpha}
                        onChange={(e) => handleChange('alpha', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-green-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Beta (Latency)
                        </span>
                        <span>{params.beta}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.5"
                        value={params.beta}
                        onChange={(e) => handleChange('beta', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-purple-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Gamma (Reliability)
                        </span>
                        <span>{params.gamma}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={params.gamma}
                        onChange={(e) => handleChange('gamma', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </div>

            <div className="border-t border-gray-700 my-2"></div>

            {/* Constraints */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Constraints</h3>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-red-300 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Max Latency (ms)
                        </span>
                        <span className="font-mono">{maxLatency} ms</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={maxLatency}
                        onChange={(e) => setMaxLatency(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>
            </div>

            <div className="border-t border-gray-700 my-2"></div>

            {/* Results */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Routing Result</h3>

                {pathResult.path.length > 0 ? (
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="text-green-400 font-bold">Optimal Path Found</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Cost:</span>
                            <span className="font-mono">{pathResult.totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Latency:</span>
                            <span className={`font-mono ${pathResult.totalLatency > maxLatency ? 'text-red-500' : 'text-blue-300'}`}>
                                {pathResult.totalLatency} ms
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Hops:</span>
                            <span>{pathResult.path.length - 1}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-red-400 font-bold text-center py-2">
                        {pathResult.error || "No Path Found"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ControlPanel;
