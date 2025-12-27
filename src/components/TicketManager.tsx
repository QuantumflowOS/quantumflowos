import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  Cpu, 
  Terminal,
  RefreshCw,
  Search,
  Filter,
  ShieldAlert,
  Plus,
  ChevronDown,
  ChevronUp,
  Activity,
  Wifi,
  Power,
  MessageSquare,
  Send,
  Loader2,
  Server,
  AlertTriangle,
  Play,
  Network,
  Layout,
  List,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  MapPin,
  History,
  Router,
  Copy,
  ExternalLink,
  FileCode,
  ShieldCheck,
  Database,
  Lock
} from 'lucide-react';
import { Ticket, TicketStatus, Priority, AutomationStatus, SLATier } from '../types';
import { MOCK_TICKETS, MOCK_CLIENTS, MOCK_ASSETS } from '../constants';
import { analyzeTicketWithAI, generateClientResponse } from '../services/geminiService';
import { useToast } from './Toast';

const SLAProgress: React.FC<{ createdAt: string, tier: SLATier }> = ({ createdAt, tier }) => {
    const slaHours = {
        'Platinum': 0.25,
        'Gold': 1,
        'Silver': 4,
        'Bronze': 24
    };

    const targetTime = new Date(createdAt).getTime() + (slaHours[tier] * 60 * 60 * 1000);
    const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = targetTime - Date.now();
            setTimeLeft(remaining);
        }, 60000);
        return () => clearInterval(interval);
    }, [targetTime]);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    const isBreached = timeLeft < 0;
    const isCritical = timeLeft < (1000 * 60 * 15) && !isBreached;

    return (
        <div className={`flex items-center gap-2 text-xs font-mono font-bold px-2 py-1 rounded border ${
            isBreached ? 'bg-red-100 text-red-700 border-red-200' :
            isCritical ? 'bg-amber-100 text-amber-700 border-amber-200' :
            'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
            <Clock className="w-3 h-3" />
            {isBreached ? 'SLA BREACHED' : `${hours}h ${mins}m`}
        </div>
    );
};

interface PlaybookStep {
    id: string;
    label: string;
    icon: any;
    status: 'pending' | 'running' | 'completed' | 'failed';
    log: string[];
}

export const TicketManager: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [filter, setFilter] = useState<'all' | 'critical' | 'automated'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const { addToast } = useToast();

  // New Ticket Form State
  const [newClientId, setNewClientId] = useState(MOCK_CLIENTS[0].id);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
  const [newDesc, setNewDesc] = useState('');

  // Diagnostic Console State
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunningCommand, setIsRunningCommand] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Playbook State
  const [playbookSteps, setPlaybookSteps] = useState<PlaybookStep[]>([]);
  const [isPlaybookRunning, setIsPlaybookRunning] = useState(false);

  // Client Communication State
  const [draftEmail, setDraftEmail] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState<'tech' | 'context' | 'topology' | 'comms'>('tech');

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  const toggleTicket = (id: string) => {
    if (expandedTicketId === id) {
      setExpandedTicketId(null);
      setConsoleOutput([]);
      setDraftEmail('');
      setPlaybookSteps([]);
      setActiveTab('tech');
    } else {
      setExpandedTicketId(id);
      setConsoleOutput([
          `> Initializing Secure Shell (SSH) connection...`, 
          `> Authenticating as admin@netserve-ops...`,
          `> Connection established to Gateway: 192.168.10.1`,
          `> Loading system telemetry...`
      ]);
    }
  };

  const runDiagnostic = (type: 'ping' | 'status' | 'reboot' | 'speed' | 'clear-arp' | 'check-dns') => {
    if (isRunningCommand) return;
    setIsRunningCommand(true);

    let steps: string[] = [];
    switch (type) {
      case 'ping':
        steps = [
          '> ping 8.8.8.8 count=4',
          'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.',
          '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms',
          '64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8 ms',
          '64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=14.1 ms',
          '--- 8.8.8.8 ping statistics ---',
          '3 packets transmitted, 3 received, 0% packet loss'
        ];
        break;
      case 'status':
        steps = [
          '> show interface status',
          'Interface    Status    Protocol    Description',
          'Gi0/1        up        up          WAN_UPLINK',
          'Gi0/2        up        up          LAN_MAIN',
          'Gi0/3        down      down        BACKUP_LINK',
          'Te0/1        up        up          FIBER_RING'
        ];
        break;
      case 'reboot':
        steps = [
          '> reload',
          'Proceed with reload? [confirm]',
          'System shutting down...',
          '..',
          'System restart initiated.'
        ];
        break;
      case 'speed':
        steps = [
            '> running speedtest-cli',
            'Retrieving speedtest.net configuration...',
            'Testing download speed....................',
            'Download: 942.50 Mbit/s',
            'Testing upload speed......................',
            'Upload: 880.22 Mbit/s'
        ];
        break;
      case 'clear-arp':
          steps = [
              '> clear arp-cache',
              'Flushing ARP entries...',
              'ARP cache cleared.',
              'Rebuilding neighbor table...'
          ];
          break;
      case 'check-dns':
          steps = [
              '> dig google.com',
              ';; QUESTION SECTION:',
              ';google.com. IN A',
              ';; ANSWER SECTION:',
              'google.com. 250 IN A 142.250.180.206',
              ';; Query time: 12 msec',
              ';; SERVER: 1.1.1.1#53(1.1.1.1)'
          ];
          break;
    }

    let delay = 0;
    steps.forEach((step, index) => {
      delay += 400 + Math.random() * 400;
      setTimeout(() => {
        setConsoleOutput(prev => [...prev, step]);
        if (index === steps.length - 1) setIsRunningCommand(false);
      }, delay);
    });
  };

  const handleAutoFix = async (ticketId: string) => {
    updateTicketStatus(ticketId, 'analyzing');
    setConsoleOutput(prev => [...prev, '> AI Analysis initiated...']);
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setTimeout(async () => {
        setConsoleOutput(prev => [...prev, '> Pulling logs from Splunk...', '> Analyzing pattern deviations...']);
        
        const result = await analyzeTicketWithAI(ticket);
        
        setConsoleOutput(prev => [
            ...prev, 
            `> Root Cause Identified: ${result.analysis}`,
            `> Suggested Action: ${result.action}`,
            `> Status: PENDING TECHNICIAN APPROVAL`
        ]);

        setTickets(prev => prev.map(t => 
          t.id === ticketId 
            ? { 
                ...t, 
                aiAnalysis: result.analysis, 
                suggestedAction: result.action, 
                automationStatus: 'completed',
                status: TicketStatus.PENDING 
              } 
            : t
        ));
    }, 1500);
  };

  const runRemediationPlaybook = (ticketId: string) => {
      setIsPlaybookRunning(true);
      const steps: PlaybookStep[] = [
          { id: '1', label: 'Snapshot Configuration', icon: Database, status: 'pending', log: [] },
          { id: '2', label: 'Isolate Traffic', icon: Lock, status: 'pending', log: [] },
          { id: '3', label: 'Apply Remediation', icon: Terminal, status: 'pending', log: [] },
          { id: '4', label: 'Verify Health', icon: ShieldCheck, status: 'pending', log: [] },
      ];
      setPlaybookSteps(steps);

      // Simulation of sequential execution
      let currentStepIndex = 0;

      const executeStep = (index: number) => {
          if (index >= steps.length) {
              setIsPlaybookRunning(false);
              addToast('Remediation Playbook Completed Successfully.', 'success');
              updateTicketStatus(ticketId, 'completed');
              setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: TicketStatus.RESOLVED } : t));
              return;
          }

          setPlaybookSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'running' } : s));

          // Simulate work for this step
          setTimeout(() => {
              setPlaybookSteps(prev => prev.map((s, i) => i === index ? { 
                  ...s, 
                  status: 'completed',
                  log: [`Executed action ${s.id}`, `Status: OK`] 
              } : s));
              setConsoleOutput(prev => [...prev, `> Playbook Step ${index + 1}: Completed successfully.`]);
              executeStep(index + 1);
          }, 1500);
      };

      executeStep(0);
  };

  const handleDraftResponse = async (ticket: Ticket) => {
    setIsDrafting(true);
    const analysis = ticket.aiAnalysis || ticket.description;
    const response = await generateClientResponse(ticket, analysis);
    setDraftEmail(response);
    setIsDrafting(false);
  };

  const handleSendEmail = () => {
    addToast('Client update email sent successfully.', 'success');
    setDraftEmail('');
  };

  const updateTicketStatus = (id: string, status: AutomationStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, automationStatus: status } : t));
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const client = MOCK_CLIENTS.find(c => c.id === newClientId);
    const newTicket: Ticket = {
        id: `NET-${Math.floor(Math.random() * 9000) + 1000}`,
        clientId: newClientId,
        clientName: client?.name || 'Unknown',
        clientSla: client?.slaTier || 'Bronze',
        title: newTitle,
        description: newDesc,
        status: TicketStatus.OPEN,
        priority: newPriority,
        createdAt: new Date().toISOString(),
        automationStatus: 'idle',
        assignedTo: 'Manual Entry'
    };
    setTickets(prev => [newTicket, ...prev]);
    setShowCreateModal(false);
    addToast('New fault ticket created successfully', 'success');
    setNewTitle('');
    setNewDesc('');
    setNewPriority(Priority.MEDIUM);
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === 'critical') return t.priority === Priority.CRITICAL;
    if (filter === 'automated') return t.automationStatus !== 'idle';
    return true;
  });

  const columns = [
      { id: TicketStatus.OPEN, label: 'Open Faults', color: 'border-red-500', bg: 'bg-red-50' },
      { id: TicketStatus.IN_PROGRESS, label: 'In Progress', color: 'border-blue-500', bg: 'bg-blue-50' },
      { id: TicketStatus.PENDING, label: 'Pending Vendor', color: 'border-amber-500', bg: 'bg-amber-50' },
      { id: TicketStatus.RESOLVED, label: 'Resolved', color: 'border-emerald-500', bg: 'bg-emerald-50' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Automation Center</h1>
          <p className="text-slate-500">Technician Workspace & Automated Operations</p>
        </div>
        <div className="flex gap-2">
            <div className="flex bg-white border border-slate-200 rounded-lg p-1 mr-2">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <List className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setViewMode('board')}
                    className={`p-2 rounded transition-colors ${viewMode === 'board' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Layout className="w-4 h-4" />
                </button>
            </div>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>All Tasks</button>
            <button onClick={() => setFilter('critical')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'critical' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>Critical</button>
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> Create Fault
            </button>
        </div>
      </div>

      {viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex gap-4 items-center bg-slate-50">
            <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search tickets by ID, client or description..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Sort: Priority
            </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-4 bg-slate-50/50">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white border border-slate-200 rounded-lg transition-all relative overflow-hidden group shadow-sm hover:shadow-md">
                        {ticket.automationStatus === 'analyzing' && (
                            <div className="absolute top-0 left-0 h-1 bg-indigo-500 animate-[loading_2s_ease-in-out_infinite] w-full"></div>
                        )}
                        
                        {/* Ticket Header (Always Visible) */}
                        <div className="p-5 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleTicket(ticket.id)}>
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{ticket.id}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                            ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                            ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                        }`}>{ticket.priority}</span>
                                        {ticket.status !== TicketStatus.RESOLVED && (
                                            <SLAProgress createdAt={ticket.createdAt} tier={ticket.clientSla} />
                                        )}
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                        {ticket.title}
                                        <span className="text-xs font-normal text-slate-400">for</span>
                                        <span className="text-sm font-medium text-slate-700">{ticket.clientName}</span>
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-1">{ticket.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 mb-1">Status</div>
                                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1 justify-end">
                                            {ticket.status === TicketStatus.RESOLVED && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                            {ticket.status}
                                        </div>
                                    </div>
                                    <div className="p-2 text-slate-400 hover:text-slate-600">
                                        {expandedTicketId === ticket.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Technician Workspace */}
                        {expandedTicketId === ticket.id && (
                            <div className="border-t border-slate-200 bg-slate-50 p-5 animate-in slide-in-from-top-2">
                                {/* Tabs for Workspace */}
                                <div className="flex gap-4 mb-4 border-b border-slate-200 pb-2">
                                    <button 
                                        onClick={() => setActiveTab('tech')}
                                        className={`text-sm font-medium pb-1 flex items-center gap-2 transition-colors ${activeTab === 'tech' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Terminal className="w-4 h-4" /> Technical Console
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('context')}
                                        className={`text-sm font-medium pb-1 flex items-center gap-2 transition-colors ${activeTab === 'context' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <User className="w-4 h-4" /> Client Context
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('topology')}
                                        className={`text-sm font-medium pb-1 flex items-center gap-2 transition-colors ${activeTab === 'topology' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Network className="w-4 h-4" /> Impact Topology
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('comms')}
                                        className={`text-sm font-medium pb-1 flex items-center gap-2 transition-colors ${activeTab === 'comms' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <MessageSquare className="w-4 h-4" /> Client Communication
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                                    {/* Left: Context / Tools (Switches based on tab) */}
                                    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
                                        
                                        {/* TECHNICAL TAB LEFT PANE */}
                                        {(activeTab === 'tech' || activeTab === 'topology' || activeTab === 'comms') && (
                                            <>
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm shrink-0">
                                                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                                                        <Cpu className="w-4 h-4 text-indigo-500" /> AI Root Cause Analysis
                                                        {ticket.aiAnalysis && <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">94% Confidence</span>}
                                                    </h4>
                                                    {ticket.aiAnalysis ? (
                                                        <div className="text-sm space-y-3">
                                                            <div className="p-2 bg-indigo-50 text-indigo-800 rounded border border-indigo-100">
                                                                <span className="font-bold block text-xs uppercase text-indigo-400 mb-1">Diagnosis</span> 
                                                                {ticket.aiAnalysis}
                                                            </div>
                                                            {!playbookSteps.length ? (
                                                                <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
                                                                    <span className="font-bold block text-xs uppercase text-emerald-400 mb-1">Recommended Action</span> 
                                                                    {ticket.suggestedAction}
                                                                    <button 
                                                                        onClick={() => runRemediationPlaybook(ticket.id)}
                                                                        className="mt-2 text-xs bg-emerald-600 text-white px-2 py-1.5 rounded hover:bg-emerald-700 flex items-center gap-1 w-full justify-center transition-all shadow-sm"
                                                                    >
                                                                        <Play className="w-3 h-3" /> Initiate Remediation Playbook
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-slate-50 border border-slate-200 rounded p-2">
                                                                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Playbook Status</div>
                                                                    <div className="space-y-2">
                                                                        {playbookSteps.map(step => (
                                                                            <div key={step.id} className="flex items-center gap-2 text-xs">
                                                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                                                                    step.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                                                    step.status === 'running' ? 'border-indigo-500 text-indigo-500' : 'border-slate-300 text-slate-300'
                                                                                }`}>
                                                                                    {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                                                                     step.status === 'running' ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                                                                                     <step.icon className="w-3 h-3" />}
                                                                                </div>
                                                                                <span className={`${step.status === 'running' ? 'font-bold text-indigo-700' : step.status === 'completed' ? 'text-slate-700' : 'text-slate-400'}`}>
                                                                                    {step.label}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <p className="text-sm text-slate-500 mb-3">No analysis data available yet.</p>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleAutoFix(ticket.id); }}
                                                                disabled={ticket.automationStatus === 'analyzing'}
                                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2 mx-auto shadow-sm"
                                                            >
                                                                <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Run AI Analysis
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Quick Actions Grid */}
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
                                                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                                                        <Activity className="w-4 h-4 text-indigo-500" /> Diagnostic Toolkit
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button onClick={() => runDiagnostic('ping')} disabled={isRunningCommand} className="flex items-center justify-start gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 text-left">
                                                            <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Ping Gateway
                                                        </button>
                                                        <button onClick={() => runDiagnostic('status')} disabled={isRunningCommand} className="flex items-center justify-start gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 text-left">
                                                            <Activity className="w-3.5 h-3.5 text-blue-500" /> Interface Status
                                                        </button>
                                                        <button onClick={() => runDiagnostic('check-dns')} disabled={isRunningCommand} className="flex items-center justify-start gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 text-left">
                                                            <Search className="w-3.5 h-3.5 text-purple-500" /> Verify DNS
                                                        </button>
                                                        <button onClick={() => runDiagnostic('clear-arp')} disabled={isRunningCommand} className="flex items-center justify-start gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 text-left">
                                                            <RefreshCw className="w-3.5 h-3.5 text-orange-500" /> Clear ARP
                                                        </button>
                                                        <button onClick={() => runDiagnostic('speed')} disabled={isRunningCommand} className="flex items-center justify-start gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 text-left">
                                                            <Zap className="w-3.5 h-3.5 text-amber-500" /> Speedtest
                                                        </button>
                                                        <button onClick={() => runDiagnostic('reboot')} disabled={isRunningCommand} className="flex items-center justify-start gap-2 px-3 py-2 border border-red-100 rounded hover:bg-red-50 text-xs font-medium text-red-600 text-left">
                                                            <Power className="w-3.5 h-3.5" /> Force Reboot
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* CLIENT CONTEXT TAB LEFT PANE */}
                                        {activeTab === 'context' && (() => {
                                            const clientData = MOCK_CLIENTS.find(c => c.id === ticket.clientId);
                                            return (
                                                <div className="flex flex-col gap-4 h-full">
                                                    {/* Contact Card */}
                                                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                                                                <User className="w-4 h-4 text-indigo-500" /> Point of Contact
                                                            </h4>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                                                                clientData?.slaTier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                                'bg-slate-50 text-slate-600 border-slate-200'
                                                            }`}>
                                                                {clientData?.slaTier} SLA
                                                            </span>
                                                        </div>
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                                                {clientData?.primaryContact?.charAt(0) || 'U'}
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <div>
                                                                    <div className="font-bold text-slate-900">{clientData?.primaryContact || 'Unknown'}</div>
                                                                    <div className="text-xs text-slate-500">Primary Administrator</div>
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Mail className="w-3 h-3" /> {clientData?.email}
                                                                        </div>
                                                                        <button onClick={() => addToast('Email copied', 'info')} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded"><Copy className="w-3 h-3" /></button>
                                                                    </div>
                                                                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Phone className="w-3 h-3" /> {clientData?.phoneNumber}
                                                                        </div>
                                                                        <button onClick={() => addToast('Number copied', 'info')} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded"><Copy className="w-3 h-3" /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                                            <div className="text-xs text-slate-500 mb-1">Account Manager</div>
                                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                                                                    {clientData?.accountManager?.charAt(0)}
                                                                </div>
                                                                {clientData?.accountManager}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Location / Access */}
                                                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex-1">
                                                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                                            <MapPin className="w-4 h-4 text-indigo-500" /> Site Details
                                                        </h4>
                                                        <div className="space-y-3 text-sm">
                                                            <div>
                                                                <span className="block text-xs text-slate-500 mb-1">Physical Address</span>
                                                                <div className="font-medium text-slate-800">{clientData?.address || 'No address on file'}</div>
                                                            </div>
                                                            <div>
                                                                <span className="block text-xs text-slate-500 mb-1">Access Notes</span>
                                                                <div className="p-2 bg-amber-50 text-amber-800 border border-amber-100 rounded text-xs leading-relaxed">
                                                                    <span className="font-bold">⚠ Gate Code: </span> 1234# <br/>
                                                                    <span className="font-bold">⚠ Hours: </span> 08:00 - 17:00 Only
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Right: Dynamic Content Panel */}
                                    <div className="h-full">
                                        {activeTab === 'tech' && (
                                            <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 h-full overflow-y-auto border border-slate-800 shadow-inner flex flex-col">
                                                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 sticky top-0 bg-slate-900 z-10">
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                                                        {playbookSteps.length ? 'Secure Remote Terminal (Playbook Active)' : 'Secure Remote Terminal (SSH)'}
                                                    </span>
                                                    <div className="flex gap-1.5">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    {consoleOutput.map((line, i) => (
                                                        <div key={i} className={`${line.startsWith('>') ? 'text-indigo-400 font-bold' : line.includes('Error') || line.includes('down') ? 'text-red-400' : 'text-slate-300'}`}>
                                                            {line}
                                                        </div>
                                                    ))}
                                                    {isRunningCommand && <div className="animate-pulse">_</div>}
                                                    <div ref={consoleEndRef} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'context' && (() => {
                                            const clientAssets = MOCK_ASSETS.filter(a => a.clientId === ticket.clientId);
                                            const clientHistory = tickets.filter(t => t.clientId === ticket.clientId && t.id !== ticket.id).slice(0, 3);
                                            const clientData = MOCK_CLIENTS.find(c => c.id === ticket.clientId);

                                            // Mock Config Status
                                            const configStatus = {
                                                lastChange: '2 days ago',
                                                changedBy: 'System Auto-Fix',
                                                wanIp: '197.221.43.12',
                                                ipChanged: false
                                            };

                                            return (
                                                <div className="flex flex-col gap-4 h-full">
                                                    {/* Live Infrastructure State */}
                                                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                                            <Activity className="w-4 h-4 text-indigo-500" /> Live Infrastructure State
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                                                <div className="text-xs text-slate-500 mb-1">Connection Type</div>
                                                                <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                                                    <Router className="w-3 h-3 text-slate-400" /> {clientData?.connectionType}
                                                                </div>
                                                            </div>
                                                            <div className="p-3 bg-slate-50 rounded border border-slate-100 relative overflow-hidden">
                                                                <div className="text-xs text-slate-500 mb-1">Primary WAN IP</div>
                                                                <div className="font-mono text-indigo-600 text-sm font-medium">{configStatus.wanIp}</div>
                                                                {configStatus.ipChanged && <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[9px] px-1">CHANGED</div>}
                                                            </div>
                                                            <div className="p-3 bg-slate-50 rounded border border-slate-100 col-span-2 flex justify-between items-center">
                                                                <div>
                                                                    <div className="text-xs text-slate-500 mb-0.5">Last Config Change</div>
                                                                    <div className="text-xs font-medium text-slate-700">{configStatus.lastChange} by {configStatus.changedBy}</div>
                                                                </div>
                                                                <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                                                                    <CheckCircle2 className="w-3 h-3" /> Config Synced
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="border-t border-slate-100 pt-3">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div className="text-xs text-slate-500">Device Health</div>
                                                                <div className="text-xs text-slate-400">{clientAssets.length} Devices Monitored</div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {clientAssets.slice(0,4).map(asset => (
                                                                    <div key={asset.id} className={`flex-1 p-2 rounded text-center border ${asset.status === 'Online' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                                                        <div className={`text-[10px] font-bold ${asset.status === 'Online' ? 'text-emerald-700' : 'text-red-700'}`}>{asset.status}</div>
                                                                        <div className="text-[10px] text-slate-500 truncate" title={asset.name}>{asset.name}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Recent Fault History */}
                                                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
                                                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                                            <History className="w-4 h-4 text-indigo-500" /> Recent Fault History
                                                        </h4>
                                                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                                            {clientHistory.length > 0 ? clientHistory.map(hist => (
                                                                <div key={hist.id} className="p-3 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100 transition-colors group">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`w-2 h-2 rounded-full ${hist.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                                            <span className="font-medium text-slate-800 text-sm">{hist.title}</span>
                                                                        </div>
                                                                        <span className="text-[10px] text-slate-400">{new Date(hist.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">{hist.description}</p>
                                                                    {/* Previous technical resolution info if available */}
                                                                    {hist.aiAnalysis && (
                                                                        <div className="text-[10px] bg-white p-2 rounded border border-slate-200 text-slate-600 flex gap-1">
                                                                            <span className="font-bold text-slate-400 uppercase whitespace-nowrap">ROOT CAUSE:</span>
                                                                            <span className="truncate">{hist.aiAnalysis}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )) : (
                                                                <div className="text-center text-slate-400 text-xs py-4">No recent history available.</div>
                                                            )}
                                                        </div>
                                                        <button className="w-full mt-3 text-xs text-indigo-600 font-medium hover:underline flex items-center justify-center gap-1">
                                                            View Full History <ExternalLink className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {activeTab === 'topology' && (
                                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-full flex flex-col relative overflow-hidden">
                                                <div className="absolute inset-0 bg-slate-50" 
                                                        style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                                                </div>
                                                <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded border border-slate-200 text-xs shadow-sm">
                                                    <span className="font-bold text-slate-700">Impact Radius:</span> {ticket.priority === 'Critical' ? 'Branch Wide' : 'Single Endpoint'}
                                                </div>

                                                {/* Topology Visualization */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    {/* Connecting Lines */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                        <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="#94a3b8" strokeWidth="2" />
                                                        <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#94a3b8" strokeWidth="2" />
                                                        <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                                                    </svg>

                                                    {/* Gateway */}
                                                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                                                        <div className="w-10 h-10 bg-white rounded-lg border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                                                            <Server className="w-5 h-5 text-slate-700" />
                                                        </div>
                                                        <span className="text-[10px] font-bold mt-1 bg-white px-1">Gateway</span>
                                                    </div>

                                                    {/* Switch */}
                                                    <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                                                        <div className="w-10 h-10 bg-white rounded-lg border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                                                            <Network className="w-5 h-5 text-slate-700" />
                                                        </div>
                                                        <span className="text-[10px] font-bold mt-1 bg-white px-1">Core Switch</span>
                                                    </div>

                                                    {/* Endpoint 1 (OK) */}
                                                    <div className="absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                                                        <div className="w-8 h-8 bg-white rounded-full border border-slate-300 flex items-center justify-center shadow-sm">
                                                            <Wifi className="w-4 h-4 text-emerald-500" />
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 mt-1">Admin WiFi</span>
                                                    </div>

                                                    {/* Endpoint 2 (Affected) */}
                                                    <div className="absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                                                        <div className="w-8 h-8 bg-red-50 rounded-full border-2 border-red-500 flex items-center justify-center shadow-md animate-pulse">
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-red-600 mt-1 bg-white px-1">Sales VoIP</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'comms' && (
                                            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm h-full flex flex-col">
                                                <h4 className="font-semibold text-slate-800 mb-2 flex items-center justify-between text-sm">
                                                    <span>Client Email Draft</span>
                                                    <button 
                                                        onClick={() => handleDraftResponse(ticket)}
                                                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 flex items-center gap-1"
                                                        disabled={isDrafting}
                                                    >
                                                        {isDrafting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                                        AI Draft
                                                    </button>
                                                </h4>
                                                <textarea 
                                                    className="flex-1 w-full border border-slate-200 rounded p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-3 bg-slate-50"
                                                    placeholder="Generate draft to have AI write a client update based on technical findings..."
                                                    value={draftEmail}
                                                    onChange={(e) => setDraftEmail(e.target.value)}
                                                ></textarea>
                                                <div className="flex justify-end">
                                                    <button 
                                                        onClick={handleSendEmail}
                                                        disabled={!draftEmail}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                                    >
                                                        <Send className="w-4 h-4" /> Send Update
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
      ) : (
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex h-full gap-4 min-w-[1000px]">
                  {columns.map(col => (
                      <div key={col.id} className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                          <div className={`p-3 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center ${col.bg}`}>
                              <span>{col.label}</span>
                              <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">
                                  {tickets.filter(t => t.status === col.id).length}
                              </span>
                          </div>
                          <div className="p-3 flex-1 overflow-y-auto space-y-3">
                              {tickets.filter(t => t.status === col.id).map(ticket => (
                                  <div key={ticket.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-indigo-200" onClick={() => { setViewMode('list'); toggleTicket(ticket.id); }}>
                                      <div className="flex justify-between items-start mb-2">
                                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                              ticket.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                              ticket.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                              'bg-blue-50 text-blue-700 border-blue-100'
                                          }`}>
                                              {ticket.priority}
                                          </span>
                                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                      </div>
                                      <h4 className="text-sm font-semibold text-slate-800 leading-snug mb-1 line-clamp-2">{ticket.title}</h4>
                                      <p className="text-xs text-slate-500 mb-2">{ticket.clientName}</p>
                                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-50">
                                          <span className="text-slate-400 font-mono">{ticket.id}</span>
                                          <div className="flex items-center gap-1 text-slate-500">
                                              <Clock className="w-3 h-3" />
                                              {new Date(ticket.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

       {/* Create Modal */}
       {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in zoom-in-95">
                <form onSubmit={handleCreateTicket}>
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Create New Fault</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                            <select className="w-full border border-slate-200 rounded-lg px-3 py-2" value={newClientId} onChange={e => setNewClientId(e.target.value)}>
                                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select className="w-full border border-slate-200 rounded-lg px-3 py-2" value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea required className="w-full border border-slate-200 rounded-lg px-3 py-2" rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create</button>
                    </div>
                </form>
            </div>
        </div>
       )}
      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};