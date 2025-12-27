import React, { useState, useEffect } from 'react';
import { AIAssistant } from './AIAssistant';
import { 
  Brain, 
  Cpu, 
  Activity, 
  GitBranch, 
  Zap, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight,
  RefreshCcw,
  Layers,
  Server,
  Shield,
  Timer
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictionChart = () => {
  const data = [
    { time: '00:00', confidence: 85 },
    { time: '04:00', confidence: 88 },
    { time: '08:00', confidence: 92 },
    { time: '12:00', confidence: 89 },
    { time: '16:00', confidence: 94 },
    { time: '20:00', confidence: 91 },
    { time: '24:00', confidence: 93 },
  ];

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0', borderRadius: '8px' }}
            itemStyle={{ color: '#a78bfa' }}
          />
          <Area type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorConf)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AIOpsCenter: React.FC = () => {
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Cache Flush - CDN Node JHB', status: 'completed', time: '2 min ago' },
    { id: 2, name: 'VLAN Tagging Correction', status: 'running', time: 'Running...' },
    { id: 3, name: 'Firewall Rule Optimization', status: 'pending', time: 'Queued' },
  ]);

  const [anomalies, setAnomalies] = useState([
    { id: 'a1', severity: 'high', device: 'Core-Router-01', issue: 'Memory Leak Prediction', confidence: 94 },
    { id: 'a2', severity: 'medium', device: 'DB-Cluster-Primary', issue: 'IOPS Saturation Risk', confidence: 78 },
  ]);

  // Simulation effect for automations
  useEffect(() => {
    const interval = setInterval(() => {
        setAutomations(prev => {
            const newAuto = [...prev];
            // Rotate statuses mock
            if (newAuto[1].status === 'running') {
                newAuto[1].status = 'completed';
                newAuto[1].time = 'Just now';
                newAuto[2].status = 'running';
                newAuto[2].time = 'Running...';
            } else if (newAuto[2].status === 'running') {
                newAuto[2].status = 'completed';
                newAuto[2].time = 'Just now';
                newAuto[0] = { id: Date.now(), name: 'SSL Cert Auto-Renew', status: 'running', time: 'Running...' };
            }
            return newAuto;
        });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 md:p-6 overflow-hidden">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Brain className="w-8 h-8 text-indigo-600" />
                AI Operations Center
            </h1>
            <p className="text-slate-500">Predictive Maintenance & Autonomous Remediation Engine</p>
        </div>
        <div className="flex gap-4 text-sm">
            <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-500">System Health:</span>
                <span className="font-bold text-slate-800">99.9%</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-slate-500">Auto-Fix Rate:</span>
                <span className="font-bold text-slate-800">84%</span>
            </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* LEFT COLUMN: PREDICTIVE INSIGHTS */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Prediction Card */}
            <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                        <GitBranch className="w-4 h-4 text-purple-400" />
                        Future State Prediction
                    </h3>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                        +48 HRS
                    </span>
                </div>
                <PredictionChart />
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-400">
                    <span>Model Confidence</span>
                    <span className="text-purple-300 font-bold">94.2%</span>
                </div>
            </div>

            {/* Anomalies List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4 text-red-500" />
                        Predicted Failures
                    </h3>
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{anomalies.length}</span>
                </div>
                <div className="p-3 space-y-3">
                    {anomalies.map(anomaly => (
                        <div key={anomaly.id} className="p-3 border border-slate-100 rounded-lg hover:border-red-200 transition-colors group bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-slate-700">{anomaly.device}</span>
                                <span className="text-[10px] font-mono text-red-500">{anomaly.confidence}% PROB</span>
                            </div>
                            <div className="text-xs text-slate-500 mb-2">{anomaly.issue}</div>
                            <button className="w-full text-xs py-1.5 bg-red-50 text-red-600 font-medium rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                                <RefreshCcw className="w-3 h-3" /> Pre-emptive Restart
                            </button>
                        </div>
                    ))}
                    <div className="p-3 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                        Analyzing telemetry streams...
                    </div>
                </div>
            </div>

        </div>

        {/* CENTER COLUMN: AI ASSISTANT (Expanded) */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Embed the existing AIAssistant but remove its outer padding/container for seamless fit */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-slate-50">
                         <div className="p-4 h-full">
                             <AIAssistant />
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE AUTOMATIONS */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pl-2 custom-scrollbar">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        Remediation Log
                    </h3>
                </div>
                <div className="flex-1 p-4 space-y-4">
                    {automations.map((auto) => (
                        <div key={auto.id} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:pb-0">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                                auto.status === 'completed' ? 'bg-emerald-500' : 
                                auto.status === 'running' ? 'bg-indigo-500' : 'bg-slate-300'
                            }`}>
                                {auto.status === 'running' && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-700">{auto.name}</div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                        auto.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                        auto.status === 'running' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {auto.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{auto.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-indigo-900 text-white mt-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-indigo-300" />
                        <span className="font-bold text-sm">Self-Healing Active</span>
                    </div>
                    <p className="text-xs text-indigo-200 leading-relaxed">
                        AI has autonomously resolved <span className="font-bold text-white">142</span> incidents this week, saving approximately <span className="font-bold text-white">48 engineering hours</span>.
                    </p>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};