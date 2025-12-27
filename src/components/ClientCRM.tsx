import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Server,
  FileText,
  ShieldCheck,
  Globe,
  Plus,
  ArrowRight,
  Terminal,
  StickyNote,
  Lock,
  Eye,
  Trash2,
  Share2,
  Router,
  Wifi,
  Laptop,
  Check,
  Activity,
  Cpu,
  Thermometer,
  Power,
  X,
  Maximize2,
  Scan,
  Zap,
  Globe2,
  Briefcase,
  ExternalLink,
  Copy
} from 'lucide-react';
import { MOCK_ASSETS, MOCK_CONTACTS, MOCK_DOCS, MOCK_THIRD_PARTY_SERVICES } from '../constants';
import { useData } from '../context/DataContext';
import { useToast } from './Toast';
import { RouterInterface } from './RouterInterface';

export const ClientCRM: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'topology' | 'third-party' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isNotePrivate, setIsNotePrivate] = useState(true);
  
  // Topology Interaction State
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  // Network Discovery State
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredNodes, setDiscoveredNodes] = useState<string[]>([]);

  // Router Interface State
  const [routerInterface, setRouterInterface] = useState<{name: string, ip: string, model: string} | null>(null);

  const { clients, notes, addNote } = useData();
  const { addToast } = useToast();

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientAssets = MOCK_ASSETS.filter(a => a.clientId === selectedClientId);
  const clientContacts = MOCK_CONTACTS.filter(c => c.clientId === selectedClientId);
  const clientDocs = MOCK_DOCS.filter(d => d.clientId === selectedClientId);
  const clientNotes = notes.filter(n => n.parentId === selectedClientId);
  const clientThirdParty = MOCK_THIRD_PARTY_SERVICES.filter(s => s.clientId === selectedClientId);

  useEffect(() => {
      if (showTerminal && terminalEndRef.current) {
          terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [terminalLines, showTerminal]);

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedClientId) return;
    addNote({
      id: Date.now().toString(),
      parentId: selectedClientId,
      author: 'Admin', // In real app, current user
      content: newNote,
      timestamp: new Date().toISOString(),
      isPrivate: isNotePrivate
    });
    setNewNote('');
    addToast('Note added successfully', 'success');
  };

  const handleNodeClick = (nodeType: string, name: string, ip: string, status: string) => {
      setSelectedNode({ type: nodeType, name, ip, status });
  };

  const handleRebootNode = () => {
      addToast(`Command sent: Reboot ${selectedNode.name}`, 'info');
      setTimeout(() => addToast(`${selectedNode.name} is restarting...`, 'success'), 1000);
  };

  const openTerminal = () => {
      setShowTerminal(true);
      setTerminalLines([
          `Connecting to ${selectedNode.ip} via SSH...`,
          `Authenticating as admin...`,
          `Welcome to NetServe OS (v2.4.1)`,
          `Last login: ${new Date().toLocaleString()} from 10.0.0.5`,
          `Type 'help' for available commands.`
      ]);
  };

  const openRouterInterface = (name: string, ip: string, model: string) => {
      setRouterInterface({ name, ip, model });
  };

  const runNetworkScan = () => {
      setIsScanning(true);
      setDiscoveredNodes([]);
      addToast('Initiating Layer 2/3 Discovery Scan...', 'info');
      
      setTimeout(() => {
          setDiscoveredNodes(prev => [...prev, 'Printer-HP-LaserJet']);
      }, 1500);
      
      setTimeout(() => {
          setDiscoveredNodes(prev => [...prev, 'Unknown-IoT-Device']);
      }, 3000);

      setTimeout(() => {
          setIsScanning(false);
          addToast('Scan Complete. 2 New Devices Found.', 'success');
      }, 4500);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!terminalInput.trim()) return;
      
      const cmd = terminalInput.trim().toLowerCase();
      const newLines = [`admin@${selectedNode.name.split(' ')[0].toLowerCase()}:~$ ${terminalInput}`];
      
      if (cmd === 'help') {
          newLines.push('Available commands: ping, status, uptime, reboot, exit, clear');
      } else if (cmd === 'clear') {
          setTerminalLines([]);
          setTerminalInput('');
          return;
      } else if (cmd === 'exit') {
          setShowTerminal(false);
          setTerminalInput('');
          return;
      } else if (cmd.startsWith('ping')) {
          newLines.push('PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.');
          newLines.push('64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms');
          newLines.push('64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=14.1 ms');
      } else if (cmd === 'status') {
          newLines.push(`Device: ${selectedNode.name}`);
          newLines.push(`Status: ${selectedNode.status}`);
          newLines.push('Load Average: 0.14, 0.10, 0.05');
      } else if (cmd === 'uptime') {
          newLines.push(' 10:23:44 up 45 days, 12:10,  1 user,  load average: 0.14, 0.10, 0.05');
      } else if (cmd === 'reboot') {
          newLines.push('System is going down for reboot NOW!');
          setTimeout(() => setShowTerminal(false), 2000);
      } else {
          newLines.push(`bash: ${cmd}: command not found`);
      }

      setTerminalLines(prev => [...prev, ...newLines]);
      setTerminalInput('');
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      addToast('Copied to clipboard', 'info');
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden relative">
      {/* LEFT: Client List (Directory) */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col h-full ${selectedClientId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 shrink-0">
           <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Users className="w-5 h-5 text-indigo-600" /> Client Directory
           </h2>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
           {filteredClients.map(client => (
             <div 
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group ${selectedClientId === client.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
             >
                <div className="flex justify-between items-start mb-1">
                   <h3 className={`font-semibold text-sm ${selectedClientId === client.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                     {client.name}
                     {client.id.startsWith('c-') && <span className="ml-2 text-[10px] bg-indigo-200 text-indigo-800 px-1 rounded">NEW</span>}
                   </h3>
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                     client.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 
                     client.status === 'Offline' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     {client.status}
                   </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mb-2 group-hover:text-slate-700">
                   <MapPin className="w-3 h-3" /> {client.location}
                </div>
                <div className="flex items-center gap-2">
                   <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      client.slaTier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                   }`}>
                     {client.slaTier} SLA
                   </span>
                </div>
             </div>
           ))}
           {filteredClients.length === 0 && (
             <div className="p-8 text-center text-slate-400 text-sm">No clients found matching your search.</div>
           )}
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
           <button 
             onClick={() => addToast('Opening Onboarding Wizard...', 'info')}
             className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors shadow-sm"
           >
              <Plus className="w-4 h-4" /> Onboard New Client
           </button>
        </div>
      </div>

      {/* RIGHT: Detailed CRM View */}
      <div className={`flex-1 flex-col overflow-hidden h-full ${selectedClientId ? 'flex' : 'hidden md:flex'}`}>
         {selectedClient ? (
           <>
             {/* Header */}
             <div className="bg-white border-b border-slate-200 p-6 shadow-sm shrink-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                        <button 
                            onClick={() => setSelectedClientId(null)}
                            className="md:hidden text-xs text-slate-500 mb-2 flex items-center gap-1 hover:text-indigo-600"
                        >
                            ← Back to List
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                                {selectedClient.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{selectedClient.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1">
                                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {selectedClient.industry}</span>
                                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Mgr: {selectedClient.accountManager}</span>
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full text-xs font-mono">ID: {selectedClient.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            Edit Profile
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create Ticket
                        </button>
                    </div>
                </div>
                   
                <div className="flex gap-1 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: FileText },
                        { id: 'assets', label: 'Assets & Docs', icon: Server },
                        { id: 'topology', label: 'Network Topology', icon: Share2 },
                        { id: 'third-party', label: '3rd Party', icon: Briefcase, count: clientThirdParty.length },
                        { id: 'notes', label: 'Notes', icon: StickyNote, count: clientNotes.length }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)} 
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div className="max-w-6xl mx-auto space-y-6">
                
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Contact Details</h3>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-50 rounded-lg"><Phone className="w-4 h-4 text-slate-500" /></div>
                              <span className="text-sm font-medium text-slate-700">{selectedClient.phoneNumber}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-4 h-4 text-slate-500" /></div>
                              <a href={`mailto:${selectedClient.email}`} className="text-sm font-medium text-indigo-600 hover:underline">{selectedClient.email}</a>
                           </div>
                           <div className="flex items-start gap-3">
                              <div className="p-2 bg-slate-50 rounded-lg"><MapPin className="w-4 h-4 text-slate-500" /></div>
                              <span className="text-sm font-medium text-slate-700">{selectedClient.address}</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Service Level Agreement</h3>
                        <div className="flex items-center justify-between mb-6">
                           <span className="text-sm text-slate-600">Current Tier</span>
                           <span className={`px-3 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${
                              selectedClient.slaTier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                              selectedClient.slaTier === 'Platinum' ? 'bg-slate-800 text-white border-slate-900' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                           }`}>
                               {selectedClient.slaTier === 'Gold' && <Check className="w-3 h-3" />}
                               {selectedClient.slaTier}
                           </span>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Response Time</span>
                              <span className="font-semibold text-slate-900">
                                 {selectedClient.slaTier === 'Platinum' ? '15 Mins' : selectedClient.slaTier === 'Gold' ? '1 Hour' : '4 Hours'}
                              </span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Uptime Guarantee</span>
                              <span className="font-semibold text-slate-900">
                                 {selectedClient.slaTier === 'Platinum' ? '99.99%' : '99.9%'}
                              </span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                               <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '98%'}}></div>
                           </div>
                           <div className="text-[10px] text-right text-slate-400">Current Month Uptime</div>
                        </div>
                     </div>
                     
                     <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                             <Users className="w-5 h-5 text-indigo-600" /> Stakeholders
                        </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {clientContacts.map(contact => (
                              <div key={contact.id} className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:shadow-sm transition-all bg-slate-50/50">
                                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm">
                                    {contact.name.charAt(0)}
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-slate-900">{contact.name}</div>
                                    <div className="text-xs text-slate-500 mb-0.5">{contact.role}</div>
                                    <div className="text-[10px] text-indigo-600">{contact.email}</div>
                                 </div>
                              </div>
                           ))}
                           <button className="flex items-center justify-center gap-2 p-4 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all">
                               <Plus className="w-4 h-4" /> Add Contact
                           </button>
                         </div>
                     </div>
                  </div>
                )}

                {activeTab === 'assets' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                             <Server className="w-5 h-5 text-indigo-600" />
                             Configuration Management DB (CMDB)
                          </h3>
                       </div>
                       <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Device Name</th>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 font-medium">IP / MAC</th>
                                    <th className="px-6 py-3 font-medium">Firmware</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Remote Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clientAssets.length > 0 ? clientAssets.map(asset => (
                                    <tr key={asset.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{asset.name}</div>
                                        <div className="text-xs text-slate-400">{asset.model}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            {asset.type === 'Router' ? <Router className="w-4 h-4" /> : 
                                            asset.type === 'Switch' ? <Server className="w-4 h-4" /> :
                                            <Wifi className="w-4 h-4" />}
                                            {asset.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                                        <div className="select-all">{asset.ipAddress}</div>
                                        <div className="text-slate-400 select-all">{asset.macAddress}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{asset.firmware}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                                            asset.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 
                                            asset.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Online' ? 'bg-emerald-500' : asset.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={() => openRouterInterface(asset.name, asset.ipAddress, asset.model)}
                                                className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded hover:bg-indigo-100 flex items-center gap-1 shadow-sm transition-colors"
                                            >
                                                <Globe2 className="w-3 h-3" /> Web Config
                                            </button>
                                            <button 
                                                onClick={() => addToast(`Initiating SSH session to ${asset.ipAddress}...`, 'info')}
                                                className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700 flex items-center gap-1 shadow-sm transition-colors"
                                            >
                                                <Terminal className="w-3 h-3" /> SSH
                                            </button>
                                        </div>
                                    </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="p-8 text-center text-slate-500 italic">No network assets discovered.</td></tr>
                                )}
                            </tbody>
                        </table>
                       </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-5 border-b border-slate-200 bg-slate-50">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                             <FileText className="w-5 h-5 text-indigo-600" /> Documents & Contracts
                          </h3>
                       </div>
                       <div className="p-4 space-y-3">
                          {clientDocs.map(doc => (
                             <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-indigo-100 transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                      {doc.type === 'Contract' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                   </div>
                                   <div>
                                      <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                                      <div className="text-xs text-slate-500 mt-0.5">{doc.type} • {doc.uploadDate} • {doc.size}</div>
                                   </div>
                                </div>
                                <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50"><ArrowRight className="w-4 h-4" /></button>
                             </div>
                          ))}
                          {clientDocs.length === 0 && <div className="text-center text-sm text-slate-400 py-6">No documents uploaded.</div>}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'topology' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-2 relative">
                        {/* Topology Content (Same as before) */}
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center relative z-10">
                             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-indigo-600" /> Live Network Topology
                             </h3>
                             <div className="flex gap-4 items-center">
                                 <button 
                                    onClick={runNetworkScan} 
                                    disabled={isScanning}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isScanning ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
                                 >
                                     {isScanning ? <Scan className="w-3 h-3 animate-spin" /> : <Scan className="w-3 h-3" />}
                                     {isScanning ? 'Scanning...' : 'Scan Network'}
                                 </button>
                                 <div className="flex gap-2">
                                    <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Online</span>
                                    <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 bg-slate-300 rounded-full"></span> Offline</span>
                                 </div>
                             </div>
                        </div>
                        <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center p-10">
                            {/* Simulated Topology Graph */}
                            <div className="relative w-full max-w-3xl h-full flex flex-col items-center justify-center">
                                {isScanning && (
                                    <div className="absolute inset-0 bg-slate-50/80 z-20 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="font-bold text-indigo-900">Discovering Neighbors...</p>
                                            <p className="text-xs text-slate-500 mt-1">LLDP / CDP Probing Active</p>
                                        </div>
                                    </div>
                                )}
                                {/* Core Router (Gateway) */}
                                <div 
                                    className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer"
                                    onClick={() => handleNodeClick('Router', 'Gateway (192.168.1.1)', '192.168.1.1', 'Online')}
                                >
                                     <div className={`w-16 h-16 bg-white rounded-full border-4 shadow-lg flex items-center justify-center z-20 transition-all hover:scale-110 ${selectedNode?.name === 'Gateway (192.168.1.1)' ? 'border-indigo-600 ring-4 ring-indigo-100' : 'border-emerald-500'}`}>
                                        <Router className="w-8 h-8 text-slate-700" />
                                     </div>
                                     <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 text-xs font-bold text-slate-800 z-20">
                                        Gateway (192.168.1.1)
                                     </div>
                                </div>
                                {/* Switches Layer */}
                                <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-around z-10">
                                    <div 
                                        className="flex flex-col items-center group relative cursor-pointer"
                                        onClick={() => handleNodeClick('Switch', 'Core Switch', '192.168.1.2', 'Online')}
                                    >
                                        <div className={`w-12 h-12 bg-white rounded-lg border-2 shadow-md flex items-center justify-center z-10 transition-all hover:scale-110 ${selectedNode?.name === 'Core Switch' ? 'border-indigo-600 ring-4 ring-indigo-100' : 'border-emerald-500'}`}>
                                            <Server className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div className="mt-2 text-xs font-medium text-slate-600">Core Switch</div>
                                         {/* Lines to Gateway */}
                                        <svg className="absolute -top-32 left-1/2 w-1 h-32 -translate-x-1/2 overflow-visible pointer-events-none">
                                            <path d="M 0 0 L 0 -100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                                            <circle r="3" fill="#6366f1" className="animate-[moveDown_3s_infinite]">
                                                <animateMotion path="M 0 -100 L 0 0" dur="3s" repeatCount="indefinite" />
                                            </circle>
                                        </svg>
                                    </div>
                                    <div 
                                        className="flex flex-col items-center group relative cursor-pointer"
                                        onClick={() => handleNodeClick('Switch', 'PoE Switch (Warehouse)', '192.168.1.3', 'Warning')}
                                    >
                                        <div className={`w-12 h-12 bg-white rounded-lg border-2 shadow-md flex items-center justify-center z-10 transition-all hover:scale-110 ${selectedNode?.name === 'PoE Switch (Warehouse)' ? 'border-indigo-600 ring-4 ring-indigo-100' : 'border-amber-500'}`}>
                                            <Server className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div className="mt-2 text-xs font-medium text-slate-600">PoE Switch (Warehouse)</div>
                                         <svg className="absolute -top-32 left-1/2 w-full h-32 -translate-x-1/2 overflow-visible pointer-events-none">
                                            <path d="M 0 0 L -150 -120" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Endpoints Layer */}
                                <div className="absolute bottom-10 w-full flex justify-around px-20">
                                     <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" onClick={() => handleNodeClick('Access Point', 'Office WiFi', '192.168.1.10', 'Online')}>
                                         <div className="w-10 h-10 bg-white rounded-full border border-slate-300 flex items-center justify-center shadow-sm">
                                            <Wifi className="w-5 h-5 text-emerald-500" />
                                         </div>
                                         <div className="mt-1 text-[10px] text-slate-500">Office WiFi</div>
                                     </div>
                                     <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" onClick={() => handleNodeClick('Workstation', 'Admin PC', '192.168.1.55', 'Offline')}>
                                         <div className="w-10 h-10 bg-white rounded-full border border-slate-300 flex items-center justify-center shadow-sm">
                                            <Laptop className="w-5 h-5 text-slate-400" />
                                         </div>
                                         <div className="mt-1 text-[10px] text-slate-500">Admin PC</div>
                                     </div>
                                     <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" onClick={() => handleNodeClick('Access Point', 'Guest WiFi', '192.168.2.10', 'Offline')}>
                                         <div className="w-10 h-10 bg-white rounded-full border border-slate-300 flex items-center justify-center shadow-sm">
                                            <Wifi className="w-5 h-5 text-red-500" />
                                         </div>
                                         <div className="mt-1 text-[10px] text-slate-500">Guest WiFi (Offline)</div>
                                     </div>
                                </div>
                                {/* Newly Discovered Nodes */}
                                {discoveredNodes.map((node, i) => (
                                    <div key={i} className="absolute top-[60%] right-[10%] flex flex-col items-center animate-in zoom-in slide-in-from-top-10 duration-700">
                                        <div className="w-10 h-10 bg-white rounded-lg border-2 border-indigo-400 border-dashed flex items-center justify-center shadow-sm">
                                            <Zap className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div className="mt-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">{node}</div>
                                        <svg className="absolute -top-32 left-1/2 w-1 h-32 overflow-visible pointer-events-none -z-10">
                                            <path d="M 0 0 L -80 -80" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 4" />
                                        </svg>
                                    </div>
                                ))}
                                {/* SVG Lines Layer */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                    <line x1="25%" y1="50%" x2="15%" y2="85%" stroke="#cbd5e1" strokeWidth="1" />
                                    <line x1="25%" y1="50%" x2="50%" y2="85%" stroke="#cbd5e1" strokeWidth="1" />
                                    <line x1="75%" y1="50%" x2="85%" y2="85%" stroke="#cbd5e1" strokeWidth="1" />
                                </svg>
                            </div>
                        </div>
                        {/* Interactive Node Details Overlay */}
                        {selectedNode && (
                            <div className="absolute right-4 top-20 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-0 animate-in slide-in-from-right-10 overflow-hidden z-30">
                                <div className="p-4 bg-slate-900 text-white flex justify-between items-start">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{selectedNode.type}</div>
                                        <h3 className="font-bold text-lg leading-tight">{selectedNode.name}</h3>
                                    </div>
                                    <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Status</div>
                                            <div className={`font-bold text-sm ${selectedNode.status === 'Online' ? 'text-emerald-600' : selectedNode.status === 'Warning' ? 'text-amber-600' : 'text-red-600'}`}>
                                                {selectedNode.status}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3" /> Load</div>
                                            <div className="font-bold text-sm text-slate-700">12%</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>IP Address</span>
                                            <span className="font-mono">{selectedNode.ip}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Uptime</span>
                                            <span className="font-mono">45d 12h 10m</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Temperature</span>
                                            <span className="font-mono flex items-center gap-1"><Thermometer className="w-3 h-3" /> 42°C</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                                        <button onClick={openTerminal} className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-xs font-bold transition-colors">
                                            <Terminal className="w-3 h-3" /> Console
                                        </button>
                                        <button onClick={handleRebootNode} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-xs font-bold transition-colors">
                                            <Power className="w-3 h-3" /> Reboot
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'third-party' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    Vendor Vault
                                </h3>
                                <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-1 shadow-sm transition-colors">
                                    <Plus className="w-3 h-3" /> Add Service
                                </button>
                            </div>
                            
                            {clientThirdParty.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                    {clientThirdParty.map(service => (
                                        <div key={service.id} className="border border-slate-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow group relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-1 h-full ${
                                                service.category === 'ISP' ? 'bg-emerald-500' :
                                                service.category === 'VoIP' ? 'bg-purple-500' : 
                                                service.category === 'Security' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}></div>
                                            
                                            <div className="flex justify-between items-start mb-3 pl-3">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{service.category}</div>
                                                    <h4 className="font-bold text-slate-900 text-lg">{service.serviceName}</h4>
                                                    <p className="text-sm text-slate-500">{service.provider}</p>
                                                </div>
                                                {service.portalUrl && (
                                                    <a href={service.portalUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-full border border-slate-100 hover:border-indigo-100 transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="space-y-3 pl-3">
                                                <div className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                                    <span className="text-slate-500">Account #</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-slate-700">{service.accountNumber}</span>
                                                        <button onClick={() => copyToClipboard(service.accountNumber)} className="text-slate-400 hover:text-indigo-600"><Copy className="w-3 h-3" /></button>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                                    <span className="text-slate-500">Support</span>
                                                    <span className="font-medium text-indigo-600">{service.supportContact}</span>
                                                </div>

                                                {service.notes && (
                                                    <div className="text-xs text-slate-500 italic mt-2 border-t border-slate-100 pt-2">
                                                        "{service.notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-slate-400">
                                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No third-party services documented.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                       <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <StickyNote className="w-5 h-5 text-indigo-600" />
                          Add Internal Note
                       </h3>
                       <div className="space-y-3">
                          <textarea 
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                            rows={3}
                            placeholder="Type session notes, access codes, or important updates..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          ></textarea>
                          <div className="flex items-center justify-between">
                             <button 
                               onClick={() => setIsNotePrivate(!isNotePrivate)}
                               className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-colors font-medium border ${isNotePrivate ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}
                             >
                                {isNotePrivate ? <Lock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {isNotePrivate ? 'Internal Team Only' : 'Visible to Client'}
                             </button>
                             <button 
                               onClick={handleAddNote}
                               className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
                             >
                                Save Note
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       {clientNotes.length > 0 ? clientNotes.map(note => (
                          <div key={note.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-colors">
                             <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                      {note.author.charAt(0)}
                                   </div>
                                   <span className="font-semibold text-sm text-slate-800">{note.author}</span>
                                   <span className="text-xs text-slate-400">• {new Date(note.timestamp).toLocaleString()}</span>
                                </div>
                                {note.isPrivate && (
                                    <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                        <Lock className="w-3 h-3" /> Internal
                                    </span>
                                )}
                             </div>
                             <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
                             <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       )) : (
                          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                             <StickyNote className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                             <p className="text-slate-400 text-sm">No notes recorded for this client yet.</p>
                          </div>
                       )}
                    </div>
                  </div>
                )}

                </div>
             </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <Users className="w-10 h-10 text-indigo-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Client</h3>
              <p className="text-sm max-w-xs text-center leading-relaxed">Choose a client from the directory on the left to view their profile, assets, and network topology.</p>
           </div>
         )}
      </div>

      {/* Router Interface Modal */}
      {routerInterface && (
          <RouterInterface 
            assetName={routerInterface.name}
            ipAddress={routerInterface.ip}
            model={routerInterface.model}
            onClose={() => setRouterInterface(null)}
          />
      )}
    </div>
  );
};