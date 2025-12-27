import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Settings, 
  Wifi, 
  Shield, 
  RefreshCcw, 
  LogOut,
  Menu,
  Server,
  Network
} from 'lucide-react';
import { NetworkChart } from './NetworkChart';

interface RouterInterfaceProps {
  assetName: string;
  ipAddress: string;
  model: string;
  onClose: () => void;
}

export const RouterInterface: React.FC<RouterInterfaceProps> = ({ assetName, ipAddress, model, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMikrotik, setIsMikrotik] = useState(model.toLowerCase().includes('mikrotik'));

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <h3 className="font-bold text-slate-900">Connecting to {ipAddress}...</h3>
                  <p className="text-sm text-slate-500">Establishing secure tunnel</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
        {/* Browser Frame Simulation */}
        <div className="w-full h-full max-w-7xl bg-slate-100 rounded-lg overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Fake Browser Toolbar */}
            <div className="bg-slate-200 px-4 py-2 flex items-center justify-between border-b border-slate-300">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 cursor-pointer hover:bg-red-500" onClick={onClose}></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white px-4 py-1 rounded-md text-xs text-slate-500 flex items-center gap-2 w-1/2 justify-center shadow-inner">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    https://{ipAddress}/webfig/
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X className="w-5 h-5" /></button>
            </div>

            {/* Router UI Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className={`w-64 ${isMikrotik ? 'bg-[#333]' : 'bg-slate-900'} text-white flex flex-col`}>
                    <div className="p-4 border-b border-white/10">
                        <h2 className="font-bold text-lg">{isMikrotik ? 'RouterOS' : model}</h2>
                        <p className="text-xs text-white/50">{assetName}</p>
                    </div>
                    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                        {['Dashboard', 'Interfaces', 'Wireless', 'Bridge', 'IP', 'Routing', 'System', 'Logs', 'Tools'].map(item => (
                            <button 
                                key={item}
                                onClick={() => setActiveTab(item.toLowerCase())}
                                className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === item.toLowerCase() ? 'bg-indigo-600 text-white' : 'text-white/70 hover:bg-white/10'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-white/10">
                        <button onClick={onClose} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-slate-50 overflow-y-auto p-6">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold text-slate-800">System Dashboard</h1>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50">
                                    <RefreshCcw className="w-4 h-4" /> Refresh
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">CPU Load</div>
                                    <div className="text-2xl font-bold text-indigo-600">12%</div>
                                    <div className="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full w-[12%]"></div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Memory</div>
                                    <div className="text-2xl font-bold text-emerald-600">248 MB</div>
                                    <div className="text-xs text-slate-400">Free of 1024 MB</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Uptime</div>
                                    <div className="text-2xl font-bold text-slate-800">45d 12h</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Board Temp</div>
                                    <div className="text-2xl font-bold text-amber-600">42°C</div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4">Traffic (ether1-gateway)</h3>
                                <div className="h-48 bg-slate-50 rounded border border-slate-100 p-2">
                                    <NetworkChart type="latency" color="#3b82f6" />
                                </div>
                            </div>

                            <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">DHCP Leases</div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3">IP Address</th>
                                            <th className="px-6 py-3">MAC Address</th>
                                            <th className="px-6 py-3">Host Name</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-6 py-3 font-mono">192.168.88.254</td>
                                            <td className="px-6 py-3 font-mono text-slate-500">A4:B1:C2:DD:EE:FF</td>
                                            <td className="px-6 py-3">Admin-PC</td>
                                            <td className="px-6 py-3 text-emerald-600 font-bold">bound</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-mono">192.168.88.253</td>
                                            <td className="px-6 py-3 font-mono text-slate-500">B2:C3:D4:11:22:33</td>
                                            <td className="px-6 py-3">iPhone-13</td>
                                            <td className="px-6 py-3 text-emerald-600 font-bold">bound</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-mono">192.168.88.252</td>
                                            <td className="px-6 py-3 font-mono text-slate-500">C3:D4:E5:44:55:66</td>
                                            <td className="px-6 py-3">Printer-HP</td>
                                            <td className="px-6 py-3 text-emerald-600 font-bold">bound</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'dashboard' && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Settings className="w-12 h-12 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-slate-600">Module Configuration</h3>
                            <p className="text-sm">Detailed settings for {activeTab} would appear here in the full simulation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};