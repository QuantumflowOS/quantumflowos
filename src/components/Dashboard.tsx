import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Wifi, 
  WifiOff, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Zap,
  ShieldAlert,
  MapPin,
  Terminal,
  Cpu,
  Globe,
  MoreHorizontal,
  Shield,
  DollarSign,
  ShieldCheck,
  Grid
} from 'lucide-react';
import { NetworkChart } from './NetworkChart';
import { TicketStatus } from '../types';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { clients, tickets } = useData();
  
  const activeTickets = tickets.filter(t => t.status !== TicketStatus.RESOLVED);
  const criticalTickets = tickets.filter(t => t.priority === 'Critical' && t.status !== TicketStatus.RESOLVED);
  const offlineClients = clients.filter(c => c.status === 'Offline');
  
  // Simulated Live Logs
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info' | 'warn' | 'error' | 'success'}[]>([
      { time: '10:42:01', msg: 'System initialization complete.', type: 'info' },
      { time: '10:42:05', msg: 'NMS polling started for distributed nodes.', type: 'info' }
  ]);

  // Network Matrix State
  const [matrixNodes, setMatrixNodes] = useState(Array(50).fill(null).map((_, i) => ({
      id: i,
      status: Math.random() > 0.95 ? 'down' : Math.random() > 0.8 ? 'warn' : 'up',
      load: Math.floor(Math.random() * 100)
  })));

  useEffect(() => {
      const interval = setInterval(() => {
          // Log Rotation
          const events = [
              { msg: 'Heartbeat received from JHB-CORE-01', type: 'info' as const },
              { msg: 'Latency spike detected on CPT-EDGE-04 (150ms)', type: 'warn' as const },
              { msg: 'Automated backup completed for MediCare DB', type: 'success' as const },
              { msg: 'Packet loss > 2% on Retail_VLAN_40', type: 'warn' as const },
              { msg: 'User login: Juan-louw G. (Admin)', type: 'info' as const },
              { msg: 'CRITICAL: Port Flapping on Switch-A2', type: 'error' as const },
              { msg: 'AI Auto-Fix: Restarted service "nginx" on SRV-09', type: 'success' as const },
              { msg: 'New device detected: Ubiquiti U6-Lite', type: 'info' as const }
          ];
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          const newLog = { 
              time: new Date().toLocaleTimeString('en-GB'), 
              msg: randomEvent.msg, 
              type: randomEvent.type 
          };
          setLogs(prev => [newLog, ...prev].slice(0, 12)); 

          // Matrix Animation
          setMatrixNodes(prev => prev.map(node => ({
              ...node,
              status: Math.random() > 0.99 ? (node.status === 'up' ? 'warn' : 'up') : node.status,
              load: Math.min(100, Math.max(0, node.load + (Math.random() * 10 - 5)))
          })));

      }, 2500);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network Operations Center</h1>
          <p className="text-slate-500">NetServe SA • Global Infrastructure Overview</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Status</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Operational
                    </span>
                </div>
             </div>
        </div>
      </div>

      {/* Live Threat Ticker */}
      <div className="bg-slate-900 text-white rounded-lg p-2 flex items-center gap-4 overflow-hidden shadow-md">
          <div className="flex items-center gap-2 px-2 shrink-0 border-r border-slate-700 pr-4">
              <Shield className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Live Threats</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-6">
              <div className="absolute whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-8 items-center text-xs font-mono text-slate-300">
                  <span>[BLOCKED] 192.168.4.22 tried SSH brute-force on Gateway-01</span>
                  <span>•</span>
                  <span>[MITIGATED] DDOS attack detected on Port 80 (CPT-EDGE)</span>
                  <span>•</span>
                  <span>[ALERT] Suspicious outbound traffic from workstation ADMIN-PC</span>
                  <span>•</span>
                  <span>[BLOCKED] Malware signature matched in email attachment (Client: SwiftMove)</span>
                  <span>•</span>
                  <span>[INFO] Automated firewall rule applied: Block Country CN on Port 22</span>
              </div>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-5">
             <Zap className="w-24 h-24" />
          </div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 relative">124</div>
          <div className="text-sm text-slate-500 relative">AI Auto-Fixes (This Month)</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-5">
             <ShieldAlert className="w-24 h-24 text-red-600" />
          </div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            {criticalTickets.length > 0 && (
                 <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 animate-pulse">
                 Action Required
               </span>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 relative">{criticalTickets.length}</div>
          <div className="text-sm text-slate-500 relative">Critical Incidents</div>
        </div>

        <Link to="/compliance" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-5">
             <ShieldCheck className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              ISO 27001 Ready
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 relative">100%</div>
          <div className="text-sm text-slate-500 relative">Audit Compliance Score</div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>

        {/* Network Health Matrix */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
              <Grid className="w-6 h-6" />
            </div>
            <div className="text-right">
                <div className="text-sm font-bold text-white">Node Health</div>
                <div className="text-[10px] text-slate-400">Live Matrix</div>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1.5 relative z-10">
             {matrixNodes.map((node) => (
                 <div 
                    key={node.id} 
                    className={`w-full aspect-square rounded-sm transition-all duration-1000 group relative cursor-pointer ${
                        node.status === 'down' ? 'bg-red-500 animate-pulse' : 
                        node.status === 'warn' ? 'bg-amber-500' : 'bg-emerald-500/80 hover:bg-emerald-400'
                    }`}
                 >
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[9px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                         Node {node.id + 1} | Load: {node.load}%
                     </div>
                 </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Latency & Regional Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Latency Index
                  </h3>
                  <div className="text-xs font-mono text-slate-400">REAL-TIME</div>
                </div>
                <NetworkChart type="latency" color="#6366f1" />
              </div>

             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4 relative z-10">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  National Backbone Status
                </h3>
                <div className="flex-1 bg-slate-900 rounded-lg p-4 relative overflow-hidden group">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                    </div>

                    {/* Nodes */}
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                        <div className="text-[10px] font-bold text-white mt-1 bg-slate-900/80 px-1 rounded backdrop-blur-sm">JHB-CORE</div>
                    </div>

                    <div className="absolute bottom-1/4 left-1/4 flex flex-col items-center z-10">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                        <div className="text-[10px] font-bold text-white mt-1 bg-slate-900/80 px-1 rounded backdrop-blur-sm">CPT-EDGE</div>
                    </div>

                    <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center z-10">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
                        <div className="text-[10px] font-bold text-white mt-1 bg-slate-900/80 px-1 rounded backdrop-blur-sm">DBN-POP</div>
                    </div>

                    {/* Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <line x1="50%" y1="33%" x2="25%" y2="75%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                        <line x1="50%" y1="33%" x2="75%" y2="66%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="25%" y1="75%" x2="75%" y2="66%" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
                    </svg>
                </div>
             </div>
          </div>
          
           {/* Detailed Client Status Grid */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" /> Client Infrastructure Health
                </h3>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Degraded</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> Offline</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-5 py-3 font-medium">Client Entity</th>
                            <th className="px-5 py-3 font-medium">Connectivity</th>
                            <th className="px-5 py-3 font-medium">SLA</th>
                            <th className="px-5 py-3 font-medium">Devices</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium text-right">Ping</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {clients.map(client => (
                            <tr key={client.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="px-5 py-3">
                                    <div className="font-medium text-slate-900 flex items-center gap-2">
                                        {client.name}
                                        {client.id.startsWith('c-') && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">NEW</span>}
                                    </div>
                                    <div className="text-xs text-slate-400 font-normal flex items-center gap-1">
                                        {client.industry} <span className="text-slate-300">•</span> {client.location}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-slate-600">
                                   <div className="flex items-center gap-2 text-xs bg-slate-100 px-2 py-1 rounded w-fit border border-slate-200">
                                     <Server className="w-3 h-3" /> {client.connectionType}
                                   </div>
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                        client.slaTier === 'Platinum' ? 'bg-slate-800 text-white border-slate-900' :
                                        client.slaTier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        client.slaTier === 'Silver' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                                        'bg-orange-50 text-orange-700 border-orange-200'
                                    }`}>
                                        {client.slaTier}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-slate-500">
                                    {client.devices} Nodes
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                        client.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        client.status === 'Offline' ? 'bg-red-50 text-red-700 border-red-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {client.status === 'Online' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                        {client.status === 'Offline' && <WifiOff className="w-3 h-3 mr-1" />}
                                        {client.status === 'Degraded' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right font-mono text-slate-600 text-xs">{client.lastPing}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
           </div>
        </div>

        {/* Right Column: AI Ops & Tickets */}
        <div className="space-y-6">
            {/* AI Ops Feed */}
            <div className="bg-slate-900 text-slate-300 rounded-xl border border-slate-800 shadow-xl flex flex-col h-[400px] overflow-hidden relative">
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        AI Operations Feed
                    </h3>
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </div>
                
                <div className="flex-1 overflow-hidden relative bg-slate-900/50">
                    <div className="absolute inset-0 overflow-y-auto p-4 space-y-3 custom-scrollbar font-mono text-xs">
                         {logs.map((log, idx) => (
                             <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2 fade-in duration-300 border-l-2 border-slate-800 pl-3 hover:border-slate-700 hover:bg-slate-800/50 rounded-r transition-colors p-1">
                                 <span className="text-slate-500 shrink-0 select-none">{log.time}</span>
                                 <span className={`${
                                     log.type === 'error' ? 'text-red-400 font-bold' : 
                                     log.type === 'warn' ? 'text-amber-400' : 
                                     log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                                 }`}>
                                     {log.msg}
                                 </span>
                             </div>
                         ))}
                         <div className="animate-pulse text-emerald-500">_</div>
                    </div>
                </div>
            </div>

            {/* Critical Tickets */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[500px]">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        Active Incidents
                    </h3>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{activeTickets.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {activeTickets.length > 0 ? activeTickets.map(ticket => (
                        <div key={ticket.id} className="p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                ticket.priority === 'Critical' ? 'bg-red-500' :
                                ticket.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}></div>
                            
                            <div className="pl-3">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-mono text-slate-400">{ticket.id}</span>
                                    <span className="text-xs text-slate-400 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" /> 
                                        {new Date(ticket.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors text-sm truncate">{ticket.title}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-slate-500 truncate max-w-[120px]">{ticket.clientName}</div>
                                    <div className="flex gap-1">
                                        {ticket.automationStatus !== 'idle' && (
                                            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        )}
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                            ticket.status === 'Open' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                        }`}>{ticket.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-200" />
                            <p className="text-sm">All systems nominal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes dash {
            to {
                stroke-dashoffset: -100;
            }
        }
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};