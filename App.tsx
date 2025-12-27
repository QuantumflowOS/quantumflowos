import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  MonitorSmartphone, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  Sparkles,
  Zap,
  Phone,
  CreditCard,
  Briefcase,
  Calendar,
  LogOut,
  Mic,
  Loader2,
  Check,
  AlertCircle,
  Shield,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Book,
  Cloud,
  FileCode,
  Network
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIOpsCenter } from './components/AIOpsCenter';
import { TicketManager } from './components/TicketManager';
import { SettingsPage } from './components/SettingsPage';
import { InvoicingPage } from './components/Invoicing';
import { IVRConsole } from './components/IVRConsole';
import { useToast } from './components/Toast';
import { CustomerPortal } from './components/CustomerPortal';
import { ClientCRM } from './components/ClientCRM';
import { TechnicianSchedule } from './components/TechnicianSchedule';
import { CommandPalette } from './components/CommandPalette';
import { SecurityCenter } from './components/SecurityCenter';
import { ComplianceLog } from './components/ComplianceLog';
import { HardwareStore } from './components/HardwareStore';
import { AnalyticsEngine } from './components/AnalyticsEngine';
import { KnowledgeBase } from './components/KnowledgeBase'; 
import { Microsoft365 } from './components/Microsoft365'; 
import { ConfigManager } from './components/ConfigManager'; 
import { IPAM } from './components/IPAM'; // New Import
import { UserRole } from './types';
import { useData } from './context/DataContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const NotificationDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New Critical Ticket: VoIP Outage at Call Center', time: '2m ago', read: false, type: 'alert' },
        { id: 2, text: 'Payment Received: SwiftMove Logistics (R15,000)', time: '1h ago', read: false, type: 'success' },
        { id: 3, text: 'SLA Warning: MediCare Ticket approaching breach', time: '3h ago', read: true, type: 'warning' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const newNotif = {
                    id: Date.now(),
                    text: 'System Alert: High Latency on JHB Core',
                    time: 'Just now',
                    read: false,
                    type: 'alert'
                };
                setNotifications(prev => [newNotif, ...prev]);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => setNotifications([]);

    return (
        <>
            <div className="fixed inset-0 z-30" onClick={onClose}></div>
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                    {unreadCount > 0 && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">No notifications.</div>
                    ) : (
                        notifications.map(n => (
                            <div 
                                key={n.id} 
                                className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${n.read ? 'opacity-60' : 'bg-indigo-50/30'}`}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                <div>
                                    <p className="text-xs text-slate-800 font-medium leading-snug">{n.text}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                    <button onClick={clearAll} className="text-xs text-slate-500 hover:text-indigo-600 font-medium">Clear All</button>
                </div>
            </div>
        </>
    );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { searchGlobal } = useData();
  const { user, logout } = useAuth();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{clients: any[], tickets: any[]} | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Command Palette State
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      setSearchResults(searchGlobal(q));
    } else {
      setSearchResults(null);
    }
  };

  const handleMicClick = () => {
      if (isListening) return;
      setIsListening(true);
      setSearchQuery('');
      
      // Simulate Voice Input
      setTimeout(() => {
          setIsListening(false);
          const simulatedText = "Show me critical tickets";
          setSearchQuery(simulatedText);
          setIsCmdOpen(true); // Open command palette as if it understood
      }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return user?.role === 'customer' ? 'Customer Portal' : 'Dashboard';
      case '/crm': return 'Client Directory & Assets';
      case '/tickets': return 'Task Automation';
      case '/ivr': return 'Omnichannel Console';
      case '/schedule': return 'Dispatch Schedule';
      case '/invoicing': return 'Billing & Invoices';
      case '/ai-ops': return 'AI Operations';
      case '/security': return 'Security Center';
      case '/compliance': return 'Compliance Audit';
      case '/store': return 'Hardware Procurement';
      case '/analytics': return 'Business Intelligence';
      case '/wiki': return 'Knowledge Base';
      case '/m365': return 'Microsoft 365';
      case '/ncm': return 'Config Vault (NCM)';
      case '/ipam': return 'IP Address Manager';
      case '/settings': return 'Settings';
      case '/customer': return 'Customer Portal';
      default: return 'NetServe SA';
    }
  };

  if (!user) return null; // Should be handled by parent, but safe guard

  const userRole = user.role;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MonitorSmartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NetServe SA</span>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          
          {/* ADMIN & TECH NAVIGATION */}
          {(userRole === 'admin' || userRole === 'technician') && (
            <>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Operations</div>
               {userRole === 'admin' && <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />}
               <SidebarLink to="/crm" icon={Briefcase} label="Clients & Assets" />
               <SidebarLink to="/tickets" icon={Zap} label="Task Automation" />
               <SidebarLink to="/ivr" icon={Phone} label="Contact Center" />
               <SidebarLink to="/schedule" icon={Calendar} label="Schedule" />
               <SidebarLink to="/store" icon={ShoppingBag} label="Hardware Store" />
               <SidebarLink to="/security" icon={Shield} label="Security Center" />
               <SidebarLink to="/ai-ops" icon={Sparkles} label="AI Diagnostics" />
               <SidebarLink to="/m365" icon={Cloud} label="Microsoft 365" />
               <SidebarLink to="/ncm" icon={FileCode} label="Config Vault" />
               <SidebarLink to="/ipam" icon={Network} label="IPAM" />
               <SidebarLink to="/wiki" icon={Book} label="Knowledge Base" />
            </>
          )}

          {/* ADMIN ONLY NAVIGATION */}
          {userRole === 'admin' && (
            <>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 mt-6">Business</div>
               <SidebarLink to="/analytics" icon={TrendingUp} label="Analytics" />
               <SidebarLink to="/invoicing" icon={CreditCard} label="Invoicing" />
               <SidebarLink to="/compliance" icon={ShieldCheck} label="Compliance" />
               <SidebarLink to="/settings" icon={Settings} label="Settings" />
            </>
          )}

          {/* CUSTOMER NAVIGATION */}
          {userRole === 'customer' && (
             <>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">My Account</div>
               <SidebarLink to="/customer" icon={LayoutDashboard} label="Portal Home" />
               <SidebarLink to="/settings" icon={Settings} label="Preferences" />
             </>
          )}
        </nav>

        <div className="p-4 bg-slate-800/50 m-4 rounded-xl border border-slate-700/50 relative group">
          <div className="flex items-center gap-3 mb-1">
             <div className="relative">
                <img 
                    src={user.avatar || "https://picsum.photos/100/100"} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
             </div>
             <div className="overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-400 capitalize">{user.role}</div>
             </div>
          </div>
          <button 
             onClick={handleLogout}
             className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/20 rounded border border-transparent hover:border-red-900/30 transition-colors"
          >
             <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-500 hover:text-slate-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">{getPageTitle(location.pathname)}</h2>
          </div>

          <div className="flex items-center gap-4">
             {/* Command Palette Trigger */}
             <div className="flex items-center gap-2">
                 <div 
                   onClick={() => setIsCmdOpen(true)}
                   className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 cursor-pointer transition-colors text-slate-500 text-sm w-48"
                 >
                    {isListening ? (
                        <div className="flex items-center gap-2 text-indigo-600 font-medium">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
                            Listening...
                        </div>
                    ) : (
                        <>
                            <Search className="w-3.5 h-3.5" />
                            <span className="truncate">{searchQuery || "Search..."}</span>
                        </>
                    )}
                 </div>
                 
                 <button 
                    onClick={handleMicClick}
                    className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                    {isListening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                 </button>
             </div>

             <div className="h-6 w-px bg-slate-200 mx-1"></div>

             <div className="relative">
                 <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                     <Bell className="w-5 h-5" />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                 </button>
                 <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50">
           <Routes>
              {/* ADMIN ROUTES */}
              <Route path="/" element={userRole === 'customer' ? <Navigate to="/customer" /> : <Dashboard />} />
              <Route path="/invoicing" element={userRole === 'admin' ? <InvoicingPage /> : <Navigate to="/" />} />
              <Route path="/settings" element={<SettingsPage role={userRole} />} />
              <Route path="/compliance" element={userRole === 'admin' ? <ComplianceLog /> : <Navigate to="/" />} />
              <Route path="/analytics" element={userRole === 'admin' ? <AnalyticsEngine /> : <Navigate to="/" />} />

              {/* SHARED ADMIN/TECH ROUTES */}
              <Route path="/crm" element={(userRole === 'admin' || userRole === 'technician') ? <ClientCRM /> : <Navigate to="/" />} />
              <Route path="/tickets" element={(userRole === 'admin' || userRole === 'technician') ? <TicketManager /> : <Navigate to="/" />} />
              <Route path="/ivr" element={(userRole === 'admin' || userRole === 'technician') ? <IVRConsole /> : <Navigate to="/" />} />
              <Route path="/schedule" element={(userRole === 'admin' || userRole === 'technician') ? <TechnicianSchedule /> : <Navigate to="/" />} />
              <Route path="/store" element={(userRole === 'admin' || userRole === 'technician') ? <HardwareStore /> : <Navigate to="/" />} />
              <Route path="/ai-ops" element={(userRole === 'admin' || userRole === 'technician') ? <AIOpsCenter /> : <Navigate to="/" />} />
              <Route path="/security" element={(userRole === 'admin' || userRole === 'technician') ? <SecurityCenter /> : <Navigate to="/" />} />
              <Route path="/wiki" element={(userRole === 'admin' || userRole === 'technician') ? <KnowledgeBase /> : <Navigate to="/" />} />
              <Route path="/m365" element={(userRole === 'admin' || userRole === 'technician') ? <Microsoft365 /> : <Navigate to="/" />} />
              <Route path="/ncm" element={(userRole === 'admin' || userRole === 'technician') ? <ConfigManager /> : <Navigate to="/" />} />
              <Route path="/ipam" element={(userRole === 'admin' || userRole === 'technician') ? <IPAM /> : <Navigate to="/" />} />

              {/* CUSTOMER ROUTES */}
              <Route path="/customer" element={userRole === 'customer' ? <CustomerPortal /> : <Navigate to="/" />} />
              
              <Route path="*" element={<Navigate to="/" />} />
           </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Loading NetServe...</div>;
  }

  return (
    <Router>
        <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/*" element={
                isAuthenticated ? <Layout /> : <LoginPage />
            } />
        </Routes>
    </Router>
  );
};

export default App;