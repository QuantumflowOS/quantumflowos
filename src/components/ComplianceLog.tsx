import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Bot, 
  Lock,
  RefreshCw,
  Hash
} from 'lucide-react';
import { useToast } from './Toast';

const MOCK_LOGS = [
    { id: 'evt-9921', time: '10:45:22', actor: 'Admin (Juan-louw)', action: 'Config Change', resource: 'Firewall Rule #44', status: 'Success', hash: 'e2a...99f' },
    { id: 'evt-9920', time: '10:42:15', actor: 'System (AI)', action: 'Auto-Remediation', resource: 'Service Restart (Nginx)', status: 'Success', hash: 'a1b...33c' },
    { id: 'evt-9919', time: '10:38:00', actor: 'Technician (Thabo)', action: 'Ticket Update', resource: 'NET-1002', status: 'Success', hash: 'c4d...11e' },
    { id: 'evt-9918', time: '10:35:12', actor: 'Client (SwiftMove)', action: 'Login Attempt', resource: 'Portal Access', status: 'Failed', hash: 'f9e...22a' },
    { id: 'evt-9917', time: '10:30:00', actor: 'System (Cron)', action: 'Backup', resource: 'Daily DB Snapshot', status: 'Success', hash: 'b2b...88d' },
    { id: 'evt-9916', time: '10:15:45', actor: 'Admin (Juan-louw)', action: 'User Role Edit', resource: 'User: Sarah J.', status: 'Success', hash: 'd4d...77c' },
    { id: 'evt-9915', time: '09:55:10', actor: 'System (Security)', action: 'Threat Block', resource: 'IP 45.22.19.112', status: 'Blocked', hash: '99a...11b' },
];

export const ComplianceLog: React.FC = () => {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [filter, setFilter] = useState('All');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const { addToast } = useToast();

  const handleVerify = () => {
      setIsVerifying(true);
      setVerificationProgress(0);
      const interval = setInterval(() => {
          setVerificationProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setIsVerifying(false);
                  addToast('Ledger Integrity Verified. No tampering detected.', 'success');
                  return 100;
              }
              return prev + 5;
          });
      }, 100);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
      addToast(`Generating ${format.toUpperCase()} audit report...`, 'info');
      setTimeout(() => addToast('Report downloaded successfully.', 'success'), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    Compliance & Audit Ledger
                </h1>
                <p className="text-slate-500">Immutable record of all system activities for SOC-2 / ISO compliance.</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                    {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
                    {isVerifying ? `Verifying ${verificationProgress}%` : 'Verify Integrity'}
                </button>
                <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => handleExport('csv')} className="px-4 py-2 hover:bg-slate-50 border-r border-slate-200 text-sm font-medium text-slate-600">CSV</button>
                    <button onClick={() => handleExport('pdf')} className="px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-600">PDF</button>
                </div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Events (30 Days)</div>
                <div className="text-2xl font-bold text-slate-900">142,885</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Admin Actions</div>
                <div className="text-2xl font-bold text-indigo-600">1,204</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">System Automations</div>
                <div className="text-2xl font-bold text-emerald-600">89,442</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Security Alerts</div>
                <div className="text-2xl font-bold text-red-600">45</div>
            </div>
        </div>

        {/* Filters & Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search logs by actor, resource or ID..." 
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Admin', 'System', 'Security'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                filter === f 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Event ID</th>
                            <th className="px-6 py-3">Actor</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Resource</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Integrity Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-3 text-slate-500 whitespace-nowrap font-mono text-xs">{log.time}</td>
                                <td className="px-6 py-3 font-mono text-xs text-slate-400">{log.id}</td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        {log.actor.includes('Admin') ? <User className="w-4 h-4 text-indigo-500" /> : 
                                         log.actor.includes('System') ? <Bot className="w-4 h-4 text-emerald-500" /> :
                                         log.actor.includes('Client') ? <User className="w-4 h-4 text-slate-500" /> :
                                         <Lock className="w-4 h-4 text-red-500" />}
                                        <span className="font-medium text-slate-700">{log.actor}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 font-medium text-slate-800">{log.action}</td>
                                <td className="px-6 py-3 text-slate-500">{log.resource}</td>
                                <td className="px-6 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                                        log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' :
                                        log.status === 'Blocked' ? 'bg-indigo-50 text-indigo-700' :
                                        'bg-red-50 text-red-700'
                                    }`}>
                                        {log.status === 'Success' && <CheckCircle2 className="w-3 h-3" />}
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right font-mono text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">
                                    {log.hash}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                <span>Showing 7 of 142,885 events</span>
                <span>Last archived: 10 mins ago</span>
            </div>
        </div>
    </div>
  );
};