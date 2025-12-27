import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  PlusCircle, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Wifi,
  Phone,
  Server,
  AlertTriangle,
  Star,
  MessageCircle,
  HelpCircle,
  ArrowUpCircle,
  ChevronRight,
  Activity,
  Play,
  Zap,
  RefreshCw,
  Power
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { TicketStatus, Ticket, Priority } from '../types';
import { useToast } from './Toast';
import { NetworkChart } from './NetworkChart';

// Health Gauge Component
const HealthGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
                <circle
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">{score}%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Health</span>
            </div>
        </div>
    );
};

export const CustomerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'billing' | 'support' | 'general'>('overview');
  const { clients, tickets, invoices, addTicket, escalateTicket, rateTicket } = useData();
  const { addToast } = useToast();
  
  // Simulating logged-in user: 'SwiftMove Logistics HQ' (c1)
  const CURRENT_CLIENT_ID = 'c1';
  const clientData = clients.find(c => c.id === CURRENT_CLIENT_ID);
  
  const clientInvoices = invoices.filter(i => i.clientId === CURRENT_CLIENT_ID);
  const clientTickets = tickets.filter(t => t.clientId === CURRENT_CLIENT_ID);

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  
  // Rating State
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // General Query State
  const [queryText, setQueryText] = useState('');

  // Speed Test State
  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
  const [speedResult, setSpeedResult] = useState<{dl: number, ul: number} | null>(null);

  // Health Calculation
  const openCritical = clientTickets.filter(t => t.priority === Priority.CRITICAL && t.status !== TicketStatus.RESOLVED).length;
  const openHigh = clientTickets.filter(t => t.priority === Priority.HIGH && t.status !== TicketStatus.RESOLVED).length;
  const offlineDevs = clientData?.status === 'Offline' ? 1 : 0; // Simplified
  const healthScore = Math.max(0, 100 - (openCritical * 20) - (openHigh * 10) - (offlineDevs * 30));

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `NET-${Math.floor(Math.random() * 10000)}`;
    addTicket({
      id,
      clientId: CURRENT_CLIENT_ID,
      clientName: clientData?.name || 'Unknown',
      clientSla: clientData?.slaTier || 'Bronze',
      title: newTicketSubject,
      description: newTicketDesc,
      status: TicketStatus.OPEN,
      priority: Priority.MEDIUM,
      createdAt: new Date().toISOString(),
      automationStatus: 'idle',
      type: 'Fault'
    });
    setShowNewTicketModal(false);
    addToast('Support ticket created successfully.', 'success');
    setNewTicketSubject('');
    setNewTicketDesc('');
  };

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `GEN-${Math.floor(Math.random() * 10000)}`;
    addTicket({
      id,
      clientId: CURRENT_CLIENT_ID,
      clientName: clientData?.name || 'Unknown',
      clientSla: clientData?.slaTier || 'Bronze',
      title: 'General Query',
      description: queryText,
      status: TicketStatus.OPEN,
      priority: Priority.LOW,
      createdAt: new Date().toISOString(),
      automationStatus: 'idle',
      type: 'General Query'
    });
    setQueryText('');
    addToast('Query sent to customer care.', 'success');
  };

  const handleEscalate = (id: string) => {
    if (window.confirm("Are you sure you want to escalate this ticket to a Manager?")) {
      escalateTicket(id, "Customer requested immediate manager attention via portal.");
      addToast("Ticket escalated to Management.", "error");
    }
  };

  const submitRating = () => {
    if (ratingId && selectedRating > 0) {
      rateTicket(ratingId, selectedRating, feedback);
      setRatingId(null);
      addToast("Thank you for your feedback!", "success");
      setFeedback('');
      setSelectedRating(0);
    }
  };

  const runSpeedTest = () => {
      setIsSpeedTesting(true);
      setSpeedResult(null);
      setTimeout(() => {
          setIsSpeedTesting(false);
          setSpeedResult({ dl: 945.2, ul: 890.5 });
      }, 3000);
  };

  const simulateQuickAction = (action: string) => {
      addToast(`Processing request: ${action}...`, 'info');
      setTimeout(() => addToast(`${action} completed successfully.`, 'success'), 2000);
  }

  if (!clientData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {clientData.name}</h1>
          <p className="text-slate-500">Customer Portal • {clientData.location}</p>
        </div>
        <div className="flex items-center gap-3">
             <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                clientData.slaTier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-100 text-slate-700 border-slate-200'
             }`}>
                {clientData.slaTier} SLA Active
             </span>
             <button onClick={() => setShowNewTicketModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                <PlusCircle className="w-4 h-4" /> Report New Fault
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Overview</button>
        <button onClick={() => setActiveTab('network')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'network' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>My Network</button>
        <button onClick={() => setActiveTab('billing')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'billing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Billing & Invoices</button>
        <button onClick={() => setActiveTab('support')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'support' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Support & Escalations</button>
        <button onClick={() => setActiveTab('general')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>General Queries</button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Health & Quick Actions Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">System Health</h3>
                            <p className="text-sm text-slate-500">Overall infrastructure status</p>
                            <div className="mt-4 text-xs text-slate-400">
                                {healthScore > 90 ? 'All systems nominal' : 'Attention required'}
                            </div>
                        </div>
                        <HealthGauge score={healthScore} />
                    </div>

                    <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" /> Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => simulateQuickAction('Reboot Router')} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col items-center gap-2 text-center group">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-100"><Power className="w-4 h-4" /></div>
                                <span className="text-xs font-medium text-slate-700">Reboot Router</span>
                            </button>
                            <button onClick={() => setActiveTab('network')} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col items-center gap-2 text-center group">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-100"><Activity className="w-4 h-4" /></div>
                                <span className="text-xs font-medium text-slate-700">Test Speed</span>
                            </button>
                            <button onClick={() => simulateQuickAction('Reset Port')} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col items-center gap-2 text-center group">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100"><RefreshCw className="w-4 h-4" /></div>
                                <span className="text-xs font-medium text-slate-700">Reset Port</span>
                            </button>
                            <button onClick={() => setActiveTab('billing')} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col items-center gap-2 text-center group">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-100"><FileText className="w-4 h-4" /></div>
                                <span className="text-xs font-medium text-slate-700">View Invoice</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Wifi className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Fiber Internet</div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">Operational <CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Cloud PBX</div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">Operational <CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Offsite Backup</div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">Maintenance <AlertTriangle className="w-4 h-4 text-amber-500" /></div>
                        </div>
                    </div>
                     <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Firewall Managed</div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">Secure <CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Account Summary */}
                     <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Account Summary</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <div className="text-sm text-slate-500 mb-1">Outstanding Balance</div>
                                <div className="text-2xl font-bold text-slate-900">R {clientData.outstandingBalance.toFixed(2)}</div>
                                <div className="text-xs text-emerald-600 mt-1">Next Invoice: 01 Nov</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 mb-1">Open Tickets</div>
                                <div className="text-2xl font-bold text-slate-900">{clientTickets.filter(t => t.status !== TicketStatus.RESOLVED).length}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 mb-1">Service Uptime</div>
                                <div className="text-2xl font-bold text-emerald-600">99.98%</div>
                                <div className="text-xs text-slate-400 mt-1">Last 30 Days</div>
                            </div>
                        </div>
                     </div>

                     {/* Announcements */}
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                         <h3 className="font-semibold text-slate-800 mb-4">Announcements</h3>
                         <div className="space-y-4">
                             <div className="p-3 bg-amber-50 rounded border border-amber-100 text-sm">
                                 <div className="font-medium text-amber-800 mb-1">Scheduled Maintenance</div>
                                 <p className="text-amber-700 text-xs">Core router firmware upgrade scheduled for Sunday, 02:00 AM - 04:00 AM.</p>
                             </div>
                             <div className="p-3 bg-indigo-50 rounded border border-indigo-100 text-sm">
                                 <div className="font-medium text-indigo-800 mb-1">New Feature Alert</div>
                                 <p className="text-indigo-700 text-xs">NetServe mobile app is now available. Download to manage faults on the go.</p>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        )}

        {/* NETWORK TAB (NEW) */}
        {activeTab === 'network' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Live Usage Chart */}
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-600" />
                                    Live Bandwidth Usage
                                </h3>
                                <p className="text-sm text-slate-500">Real-time traffic on Core Gateway</p>
                            </div>
                            <div className="flex gap-4 text-xs font-mono">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Download</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Upload</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <NetworkChart type="latency" color="#6366f1" />
                        </div>
                    </div>

                    {/* Speed Test Widget */}
                    <div className="w-full md:w-80 bg-slate-900 rounded-xl shadow-lg p-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-600/10 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-slate-900 to-slate-900 pointer-events-none"></div>
                        <h3 className="font-bold mb-6 relative z-10">Remote Speed Test</h3>
                        
                        <div className="relative mb-8">
                            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${isSpeedTesting ? 'border-emerald-500 animate-spin border-t-transparent' : 'border-slate-700'}`}>
                                {isSpeedTesting ? (
                                    <span className="text-emerald-400 font-mono animate-pulse">Running...</span>
                                ) : speedResult ? (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{speedResult.dl}</div>
                                        <div className="text-[10px] text-slate-400">Mbps</div>
                                    </div>
                                ) : (
                                    <Activity className="w-10 h-10 text-slate-500" />
                                )}
                            </div>
                        </div>

                        {speedResult && !isSpeedTesting && (
                            <div className="grid grid-cols-2 gap-4 w-full mb-6 text-center">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase">Download</div>
                                    <div className="font-bold text-emerald-400">{speedResult.dl} Mbps</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase">Upload</div>
                                    <div className="font-bold text-indigo-400">{speedResult.ul} Mbps</div>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={runSpeedTest}
                            disabled={isSpeedTesting}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                        >
                            {isSpeedTesting ? 'Testing...' : <><Play className="w-4 h-4" /> Start Test</>}
                        </button>
                    </div>
                </div>

                {/* Device Status List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Server className="w-5 h-5 text-slate-500" />
                            Your Onsite Devices
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Device Name</th>
                                    <th className="px-5 py-3 font-medium">Model</th>
                                    <th className="px-5 py-3 font-medium">IP Address</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Last Seen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-900">Core Router</td>
                                    <td className="px-5 py-3 text-slate-500">MikroTik CCR1036</td>
                                    <td className="px-5 py-3 font-mono text-slate-600">192.168.10.1</td>
                                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span></td>
                                    <td className="px-5 py-3 text-slate-500">Just now</td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-900">Warehouse Switch</td>
                                    <td className="px-5 py-3 text-slate-500">Ubiquiti EdgeSwitch 48</td>
                                    <td className="px-5 py-3 font-mono text-slate-600">192.168.10.2</td>
                                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span></td>
                                    <td className="px-5 py-3 text-slate-500">1 min ago</td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-900">Guest WiFi AP</td>
                                    <td className="px-5 py-3 text-slate-500">UniFi AC Pro</td>
                                    <td className="px-5 py-3 font-mono text-slate-600">192.168.20.5</td>
                                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Offline</span></td>
                                    <td className="px-5 py-3 text-slate-500">2 days ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Invoice History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 font-medium">Invoice #</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {clientInvoices.length > 0 ? clientInvoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-slate-600">{inv.id}</td>
                                    <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                                    <td className="px-6 py-4 text-slate-900">{inv.items.map(item => <div key={item}>{item}</div>)}</td>
                                    <td className="px-6 py-4 font-medium">R {inv.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                            inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                        }`}>{inv.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => addToast(`Downloading ${inv.id}`, 'info')} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto">
                                            <Download className="w-3 h-3" /> PDF
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No invoices found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-slate-400" /> Fault History & Escalations
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {clientTickets.length > 0 ? clientTickets.map(ticket => (
                        <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded font-mono">{ticket.id}</span>
                                    <h4 className="font-medium text-slate-900">{ticket.title}</h4>
                                    {ticket.isEscalated && (
                                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200 animate-pulse">
                                        ESCALATED
                                      </span>
                                    )}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    ticket.status === TicketStatus.RESOLVED ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>{ticket.status}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">{ticket.description}</p>
                            
                            {/* Action Buttons: Rating or Escalation */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                              {ticket.status === TicketStatus.RESOLVED ? (
                                <div className="flex items-center gap-2">
                                  {ticket.rating ? (
                                     <div className="flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
                                       <Star className="w-4 h-4 fill-current" /> {ticket.rating}/5 Rated
                                     </div>
                                  ) : (
                                     <button 
                                      onClick={() => setRatingId(ticket.id)}
                                      className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
                                     >
                                       <Star className="w-4 h-4" /> Rate Service
                                     </button>
                                  )}
                                </div>
                              ) : (
                                !ticket.isEscalated && (
                                  <button 
                                    onClick={() => handleEscalate(ticket.id)}
                                    className="text-xs flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded border border-red-200 hover:bg-red-100 font-medium transition-colors"
                                  >
                                    <ArrowUpCircle className="w-4 h-4" /> Escalate to Manager
                                  </button>
                                )
                              )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-500">No support history found. System running optimally.</div>
                    )}
                </div>
            </div>
        )}

        {/* GENERAL QUERIES TAB */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  General Enquiry
                </h3>
                <form onSubmit={handleSubmitQuery} className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Your Question</label>
                      <textarea 
                        required 
                        rows={4} 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Ask about billing, upgrades, or general service questions..."
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                      ></textarea>
                   </div>
                   <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 w-full">
                      Submit Query
                   </button>
                </form>
             </div>

             <div className="space-y-4">
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                       <HelpCircle className="w-5 h-5 text-indigo-600" />
                       Customer Care FAQ
                    </h3>
                    <div className="space-y-3">
                       <details className="group">
                          <summary className="flex cursor-pointer items-center justify-between font-medium text-slate-900 group-open:text-indigo-600">
                             How do I upgrade my SLA?
                             <span className="transition group-open:rotate-180">
                                <ChevronRight className="w-4 h-4" />
                             </span>
                          </summary>
                          <p className="mt-2 text-sm text-slate-500">You can request an SLA upgrade by submitting a general query or contacting your account manager directly.</p>
                       </details>
                       <details className="group">
                          <summary className="flex cursor-pointer items-center justify-between font-medium text-slate-900 group-open:text-indigo-600">
                             Where can I see my invoice?
                             <span className="transition group-open:rotate-180">
                                <ChevronRight className="w-4 h-4" />
                             </span>
                          </summary>
                          <p className="mt-2 text-sm text-slate-500">Invoices are available for download in the 'Billing & Invoices' tab of this portal.</p>
                       </details>
                    </div>
                 </div>
             </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in zoom-in-95">
                <form onSubmit={handleCreateTicket}>
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Report a Fault</h3>
                        <p className="text-sm text-slate-500">Describe the issue and our team will investigate.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Subject</label>
                            <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. No Internet in Warehouse" value={newTicketSubject} onChange={e => setNewTicketSubject(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                            <textarea required rows={4} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="When did it start? Which devices are affected?" value={newTicketDesc} onChange={e => setNewTicketDesc(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={() => setShowNewTicketModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Submit Ticket</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in zoom-in-95 p-6 text-center">
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Rate our Service</h3>
                 <p className="text-slate-500 mb-6">How was your experience with ticket {ratingId}?</p>
                 
                 <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSelectedRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                         <Star 
                          className={`w-8 h-8 ${star <= (hoverRating || selectedRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                         />
                      </button>
                    ))}
                 </div>
                 
                 <textarea 
                   className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                   rows={3}
                   placeholder="Any feedback for the technician?"
                   value={feedback}
                   onChange={(e) => setFeedback(e.target.value)}
                 ></textarea>

                 <div className="flex gap-3">
                    <button onClick={() => setRatingId(null)} className="flex-1 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                    <button onClick={submitRating} disabled={selectedRating === 0} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">Submit</button>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};