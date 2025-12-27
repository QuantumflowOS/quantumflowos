import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Globe, 
  Lock, 
  Unlock, 
  AlertOctagon, 
  Activity, 
  Search, 
  Terminal, 
  Wifi, 
  Server,
  Eye,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from './Toast';

const THREAT_LOGS = [
    { id: 1, ip: '45.22.19.112', country: 'CN', type: 'SSH Brute Force', status: 'Blocked', time: '10:42:05' },
    { id: 2, ip: '89.11.05.22', country: 'RU', type: 'SQL Injection', status: 'Blocked', time: '10:41:55' },
    { id: 3, ip: '102.33.12.01', country: 'US', type: 'Port Scan', status: 'Mitigated', time: '10:40:12' },
    { id: 4, ip: '192.168.1.45', country: 'ZA', type: 'Malware Beacon', status: 'Quarantined', time: '10:38:00' },
];

export const SecurityCenter: React.FC = () => {
  const [logs, setLogs] = useState(THREAT_LOGS);
  const [lockdown, setLockdown] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
        const ips = ['112.44.22.11', '88.12.43.11', '99.21.33.12', '10.0.0.55'];
        const countries = ['CN', 'RU', 'BR', 'KP'];
        const types = ['DDoS Attempt', 'XSS Attack', 'Ransomware Sig', 'Botnet Join'];
        
        const newLog = {
            id: Date.now(),
            ip: ips[Math.floor(Math.random() * ips.length)],
            country: countries[Math.floor(Math.random() * countries.length)],
            type: types[Math.floor(Math.random() * types.length)],
            status: 'Blocked',
            time: new Date().toLocaleTimeString('en-GB')
        };
        setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const toggleLockdown = () => {
      if (lockdown) {
          setLockdown(false);
          addToast('System Lockdown Lifted. Traffic normalized.', 'success');
      } else {
          setLockdown(true);
          addToast('EMERGENCY LOCKDOWN INITIATED. All non-essential ports closed.', 'error');
      }
  };

  const runScan = () => {
      setScanning(true);
      setTimeout(() => {
          setScanning(false);
          addToast('Vulnerability Scan Complete: 0 Critical Issues.', 'success');
      }, 3000);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    Security Operations Center (SOC)
                </h1>
                <p className="text-slate-400">Real-time threat intelligence and perimeter defense.</p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={runScan}
                    disabled={scanning}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-medium transition-all"
                >
                    {scanning ? <Activity className="w-4 h-4 animate-spin text-emerald-500" /> : <Search className="w-4 h-4" />}
                    {scanning ? 'Scanning Assets...' : 'Run Vulnerability Scan'}
                </button>
                <button 
                    onClick={toggleLockdown}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${lockdown ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                    {lockdown ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    {lockdown ? 'LIFT LOCKDOWN' : 'INITIATE LOCKDOWN'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Live Attack Map */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-300">
                        <Globe className="w-4 h-4 text-indigo-500" /> Global Threat Map
                    </h3>
                    <div className="flex gap-4 text-xs font-mono">
                        <span className="text-red-400">● Attack Source</span>
                        <span className="text-emerald-400">● Protected Node</span>
                    </div>
                </div>
                
                <div className="flex-1 relative">
                    {/* Simplified World Map Background */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{
                            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
                            backgroundSize: '20px 20px'
                        }}
                    ></div>
                    
                    {/* SA Node */}
                    <div className="absolute top-[60%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse"></div>
                        <div className="w-24 h-24 border border-emerald-500/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[ping_3s_linear_infinite]"></div>
                    </div>

                    {/* Simulated Attacks */}
                    <div className="absolute top-[30%] left-[20%] z-10"> {/* US */}
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="absolute w-[400px] h-[200px] border-t-2 border-r-2 border-red-500/20 rounded-tr-full top-0 left-0 animate-[pulse_2s_infinite]"></div>
                    </div>
                    
                    <div className="absolute top-[25%] left-[70%] z-10"> {/* RU/CN */}
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <svg className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none overflow-visible">
                             <path d="M 0 0 Q -100 200 -200 280" stroke="#ef4444" strokeWidth="1" fill="none" strokeDasharray="5,5" className="animate-[dash_3s_linear_infinite]" />
                        </svg>
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-4">
                        <div className="bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-800">
                            <div className="text-xs text-slate-500 mb-1">Attacks / Sec</div>
                            <div className="text-xl font-mono font-bold text-white">42</div>
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-800">
                            <div className="text-xs text-slate-500 mb-1">Blocked IPs</div>
                            <div className="text-xl font-mono font-bold text-red-400">14,203</div>
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-800">
                            <div className="text-xs text-slate-500 mb-1">Bandwidth</div>
                            <div className="text-xl font-mono font-bold text-indigo-400">4.2 Gbps</div>
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-800">
                            <div className="text-xs text-slate-500 mb-1">Threat Level</div>
                            <div className="text-xl font-mono font-bold text-amber-400">MODERATE</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Logs & Endpoints */}
            <div className="flex flex-col gap-6 h-full min-h-0">
                
                {/* Active Threats */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col flex-1 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-300">
                            <Terminal className="w-4 h-4 text-red-500" /> Intrusion Logs
                        </h3>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-xs">
                        {logs.map(log => (
                            <div key={log.id} className="p-3 rounded border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors group">
                                <div className="flex justify-between mb-1">
                                    <span className="text-red-400 font-bold">{log.type}</span>
                                    <span className="text-slate-500">{log.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-300">{log.ip} <span className="text-slate-600">({log.country})</span></span>
                                    <span className="text-emerald-500 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Endpoint Status */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-1/3 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-300">
                            <Server className="w-4 h-4 text-emerald-500" /> Endpoint Health
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="flex items-center justify-between p-2 hover:bg-slate-900 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm text-slate-300">HQ Firewall (FortiGate)</span>
                            </div>
                            <span className="text-xs text-emerald-500">Secure</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-slate-900 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm text-slate-300">Backup Server</span>
                            </div>
                            <span className="text-xs text-emerald-500">Secure</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-slate-900 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-slate-300">Guest WiFi Controller</span>
                            </div>
                            <span className="text-xs text-amber-500">Patch Available</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <style>{`
            @keyframes dash {
                to { stroke-dashoffset: -50; }
            }
        `}</style>
    </div>
  );
};