import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  CreditCard, 
  Users, 
  Zap, 
  Calendar, 
  LayoutDashboard, 
  Phone, 
  Settings, 
  Plus, 
  ArrowRight,
  Shield,
  Server,
  Lock,
  Wifi,
  ShoppingBag,
  TrendingUp,
  Book,
  ShieldCheck,
  Cloud,
  FileCode,
  Network
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from './Toast';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { clients } = useData();
  const { addToast } = useToast();

  // Navigation Items
  const pages = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Client CRM', icon: Users, path: '/crm' },
    { name: 'Ticket Manager', icon: Zap, path: '/tickets' },
    { name: 'Dispatch Schedule', icon: Calendar, path: '/schedule' },
    { name: 'IVR Console', icon: Phone, path: '/ivr' },
    { name: 'Invoicing', icon: CreditCard, path: '/invoicing' },
    { name: 'Security Center', icon: Shield, path: '/security' },
    { name: 'Hardware Store', icon: ShoppingBag, path: '/store' },
    { name: 'Analytics Engine', icon: TrendingUp, path: '/analytics' },
    { name: 'Knowledge Base', icon: Book, path: '/wiki' },
    { name: 'Compliance Log', icon: ShieldCheck, path: '/compliance' },
    { name: 'Microsoft 365', icon: Cloud, path: '/m365' },
    { name: 'Config Vault (NCM)', icon: FileCode, path: '/ncm' },
    { name: 'IP Address Manager', icon: Network, path: '/ipam' },
  ];

  // Action Items
  const actions = [
      { name: 'Create New Fault Ticket', icon: Plus, path: '/tickets', action: 'create' },
      { name: 'Run Global Security Scan', icon: Shield, action: 'scan' },
      { name: 'Restart Core Router (JHB)', icon: Server, action: 'restart' },
      { name: 'Flush DNS Cache', icon: Wifi, action: 'flush' },
      { name: 'Emergency Lockdown', icon: Lock, action: 'lockdown' },
  ];

  // Combine Data
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredActions = actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  
  const allOptions = [
    ...filteredPages.map(p => ({ type: 'page', ...p })),
    ...filteredActions.map(a => ({ type: 'action', ...a })),
    ...filteredClients.map(c => ({ type: 'client', name: c.name, icon: Users, path: '/crm', id: c.id })),
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        setQuery('');
        setActiveIndex(0);
    }
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % allOptions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + allOptions.length) % allOptions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSelect(allOptions[activeIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, allOptions, navigate]);

  const handleSelect = (option: any) => {
      onClose();
      if (option.type === 'client') {
          navigate('/crm'); // In real app: navigate(`/crm/${option.id}`)
          addToast(`Viewing ${option.name}`, 'info');
      } else if (option.type === 'action') {
          if (option.path) navigate(option.path);
          if (option.action === 'scan') addToast('Global Security Scan Initiated...', 'success');
          if (option.action === 'restart') addToast('Reboot signal sent to Core Router.', 'warning');
          if (option.action === 'flush') addToast('DNS Cache Flushed.', 'success');
          if (option.action === 'lockdown') addToast('INITIATING LOCKDOWN PROTOCOL', 'error');
      } else {
          navigate(option.path);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                    ref={inputRef}
                    className="flex-1 text-lg outline-none placeholder:text-slate-400 text-slate-800"
                    placeholder="Search clients, pages, or run commands..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                />
                <div className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">ESC</div>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
                {allOptions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No results found.</div>
                ) : (
                    <div className="space-y-1">
                        {allOptions.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(option)}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-colors ${
                                    idx === activeIndex ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                                onMouseEnter={() => setActiveIndex(idx)}
                            >
                                <div className="flex items-center gap-3">
                                    <option.icon className={`w-5 h-5 ${idx === activeIndex ? 'text-white' : 'text-slate-400'}`} />
                                    <div>
                                        <div className="font-medium">{option.name}</div>
                                        {option.type === 'client' && <div className={`text-xs ${idx === activeIndex ? 'text-indigo-200' : 'text-slate-400'}`}>Jump to Client Profile</div>}
                                        {option.type === 'page' && <div className={`text-xs ${idx === activeIndex ? 'text-indigo-200' : 'text-slate-400'}`}>Navigate</div>}
                                        {option.type === 'action' && <div className={`text-xs ${idx === activeIndex ? 'text-indigo-200' : 'text-slate-400'}`}>Run Command</div>}
                                    </div>
                                </div>
                                {idx === activeIndex && <ArrowRight className="w-4 h-4 opacity-50" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between px-4">
                <span>NetServe OS v2.4</span>
                <div className="flex gap-3">
                    <span><strong className="font-medium">↑↓</strong> to navigate</span>
                    <span><strong className="font-medium">↵</strong> to select</span>
                </div>
            </div>
        </div>
    </div>
  );
};