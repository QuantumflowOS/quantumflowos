import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Plus, 
  Settings, 
  Server, 
  Smartphone, 
  Printer, 
  Laptop, 
  Wifi, 
  Info,
  Calculator,
  RefreshCw,
  Trash2,
  Edit2
} from 'lucide-react';
import { MOCK_SUBNETS, MOCK_CLIENTS } from '../constants';
import { Subnet, IPNode } from '../types';
import { useToast } from './Toast';

export const IPAM: React.FC = () => {
  const { addToast } = useToast();
  const [subnets, setSubnets] = useState(MOCK_SUBNETS);
  const [selectedSubnetId, setSelectedSubnetId] = useState(MOCK_SUBNETS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Details Panel State
  const [selectedIP, setSelectedIP] = useState<IPNode | null>(null);

  const selectedSubnet = subnets.find(s => s.id === selectedSubnetId);

  // Generate Mock IPs based on subnet
  const generateIPs = (subnet: Subnet): IPNode[] => {
      const ips: IPNode[] = [];
      const baseIP = subnet.cidr.split('.')[0] + '.' + subnet.cidr.split('.')[1] + '.' + subnet.cidr.split('.')[2];
      
      for (let i = 0; i < 256; i++) {
          const currentIP = `${baseIP}.${i}`;
          let status: IPNode['status'] = 'Available';
          let deviceName = '';
          let deviceId = '';

          // Mock Rules
          if (i === 0) status = 'Broadcast'; // Network ID really but simplifying
          else if (i === 1) status = 'Gateway';
          else if (i === 255) status = 'Broadcast';
          else if (i < 10) { status = 'Reserved'; deviceName = 'Static Infrastructure'; }
          else if (i > 100 && i < 100 + (subnet.utilization * 2.56 * 0.5)) { 
              status = 'DHCP'; 
              deviceName = `Desktop-${100+i}`; 
          }
          else if (i === 50) { status = 'Assigned'; deviceName = 'Network Printer'; }

          ips.push({
              ip: currentIP,
              status,
              deviceName: status !== 'Available' ? deviceName : undefined,
              mac: status !== 'Available' ? `00:1A:2B:3C:4D:${i.toString(16).toUpperCase().padStart(2,'0')}` : undefined,
              lastSeen: status !== 'Available' ? 'Active' : undefined
          });
      }
      return ips;
  };

  const currentIPs = selectedSubnet ? generateIPs(selectedSubnet) : [];

  const handleIPClick = (node: IPNode) => {
      setSelectedIP(node);
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'Gateway': return 'bg-purple-500 border-purple-600';
          case 'Reserved': return 'bg-amber-500 border-amber-600';
          case 'Assigned': return 'bg-indigo-600 border-indigo-700';
          case 'DHCP': return 'bg-blue-400 border-blue-500';
          case 'Broadcast': return 'bg-slate-400 border-slate-500';
          default: return 'bg-white border-slate-200 hover:border-indigo-300';
      }
  };

  // Calculator Logic (Mocked output)
  const [calcInput, setCalcInput] = useState('192.168.1.0/24');
  const [calcResult, setCalcResult] = useState<any>(null);

  const calculateSubnet = () => {
      // Mock logic
      setCalcResult({
          network: '192.168.1.0',
          mask: '255.255.255.0',
          first: '192.168.1.1',
          last: '192.168.1.254',
          broadcast: '192.168.1.255',
          hosts: 254
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Network className="w-8 h-8 text-indigo-600" /> IP Address Manager
             </h1>
             <p className="text-slate-500">Visualize subnets, track assignments, and manage VLANs.</p>
          </div>
          <div className="flex gap-3">
              <button 
                onClick={() => setShowCalculator(!showCalculator)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showCalculator ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                  <Calculator className="w-4 h-4" /> Subnet Calculator
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Add Subnet
              </button>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
           {/* Sidebar: Subnet List */}
           <div className="w-full lg:w-72 bg-white rounded-xl border border-slate-200 flex flex-col shrink-0 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <div className="relative mb-3">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         placeholder="Filter subnets..." 
                         className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       />
                   </div>
                   <div className="flex justify-between text-xs text-slate-500">
                       <span>{subnets.length} Subnets</span>
                       <span>85% Global Util</span>
                   </div>
               </div>
               <div className="flex-1 overflow-y-auto">
                   {subnets.map(subnet => (
                       <div 
                         key={subnet.id}
                         onClick={() => setSelectedSubnetId(subnet.id)}
                         className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedSubnetId === subnet.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                       >
                           <div className="flex justify-between items-start mb-1">
                               <div className="font-bold text-slate-900 text-sm">{subnet.cidr}</div>
                               <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                   subnet.type === 'Voice' ? 'bg-purple-100 text-purple-700' :
                                   subnet.type === 'DMZ' ? 'bg-orange-100 text-orange-700' :
                                   'bg-blue-100 text-blue-700'
                               }`}>{subnet.type}</span>
                           </div>
                           <div className="text-xs text-slate-500 mb-2 truncate">{subnet.name}</div>
                           
                           <div className="flex items-center gap-2">
                               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div 
                                     className={`h-full rounded-full ${subnet.utilization > 90 ? 'bg-red-500' : subnet.utilization > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                     style={{width: `${subnet.utilization}%`}}
                                   ></div>
                               </div>
                               <span className="text-[10px] font-mono text-slate-400">{subnet.utilization}%</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           {/* Main Content */}
           <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
               
               {/* Subnet Header */}
               {selectedSubnet && (
                   <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                       <div>
                           <h2 className="font-bold text-lg text-slate-800">{selectedSubnet.cidr} <span className="text-slate-400 font-normal">({selectedSubnet.name})</span></h2>
                           <div className="flex gap-4 text-xs text-slate-500 mt-1">
                               <span className="flex items-center gap-1"><Server className="w-3 h-3" /> VLAN {selectedSubnet.vlanId}</span>
                               <span className="flex items-center gap-1"><Network className="w-3 h-3" /> GW: {selectedSubnet.gateway}</span>
                               <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {selectedSubnet.location}</span>
                           </div>
                       </div>
                       <div className="flex gap-3 text-xs">
                           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Gateway</div>
                           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> Static</div>
                           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> DHCP</div>
                           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> Reserved</div>
                       </div>
                   </div>
               )}

               {/* IP Grid */}
               <div className="flex-1 overflow-y-auto p-6">
                   <div className="grid grid-cols-16 gap-2">
                       {currentIPs.map((node, i) => (
                           <div 
                             key={i}
                             onClick={() => handleIPClick(node)}
                             className={`aspect-square rounded border flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all hover:scale-110 hover:shadow-md hover:z-10 relative group ${getStatusColor(node.status)} ${node.status === 'Available' ? 'text-slate-300' : 'text-white font-bold'}`}
                             title={`${node.ip} - ${node.status}`}
                           >
                               {i}
                               {/* Tooltip on Hover */}
                               <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-20">
                                   <div className="font-bold">{node.ip}</div>
                                   <div className="text-[10px] font-normal text-slate-300">{node.status}</div>
                                   {node.deviceName && <div className="text-[10px] text-indigo-300">{node.deviceName}</div>}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>

               {/* Slide-over Details Panel */}
               {selectedIP && (
                   <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-slate-200 p-6 animate-in slide-in-from-right duration-200 z-30">
                       <div className="flex justify-between items-start mb-6">
                           <h3 className="font-bold text-xl text-slate-900">{selectedIP.ip}</h3>
                           <button onClick={() => setSelectedIP(null)} className="p-1 hover:bg-slate-100 rounded-full">
                               <Plus className="w-5 h-5 rotate-45 text-slate-500" />
                           </button>
                       </div>

                       <div className="space-y-6">
                           <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Status</div>
                               <div className={`font-bold ${selectedIP.status === 'Available' ? 'text-emerald-600' : 'text-slate-800'}`}>{selectedIP.status}</div>
                           </div>

                           {selectedIP.status !== 'Available' && (
                               <>
                                   <div>
                                       <div className="text-xs text-slate-500 mb-1">Device Name</div>
                                       <div className="font-medium text-slate-800">{selectedIP.deviceName || 'Unknown'}</div>
                                   </div>
                                   <div>
                                       <div className="text-xs text-slate-500 mb-1">MAC Address</div>
                                       <div className="font-mono text-sm text-slate-600">{selectedIP.mac || '-'}</div>
                                   </div>
                                   <div>
                                       <div className="text-xs text-slate-500 mb-1">Last Seen</div>
                                       <div className="font-medium text-slate-800">{selectedIP.lastSeen}</div>
                                   </div>
                               </>
                           )}

                           <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
                               {selectedIP.status === 'Available' ? (
                                   <button onClick={() => addToast(`IP ${selectedIP.ip} assigned.`, 'success')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
                                       Assign IP
                                   </button>
                               ) : (
                                   <>
                                       <button className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                           <Edit2 className="w-4 h-4" /> Edit Details
                                       </button>
                                       <button className="w-full py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                           <Trash2 className="w-4 h-4" /> Release IP
                                       </button>
                                   </>
                               )}
                               <button className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
                                   Ping Check
                               </button>
                           </div>
                       </div>
                   </div>
               )}

               {/* Calculator Modal Overlay */}
               {showCalculator && (
                   <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                       <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-slate-200 animate-in zoom-in-95">
                           <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                   <Calculator className="w-4 h-4 text-indigo-500" /> Subnet Calc
                               </h3>
                               <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-slate-600">
                                   <Plus className="w-5 h-5 rotate-45" />
                               </button>
                           </div>
                           <div className="p-4 space-y-4">
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase">CIDR Block</label>
                                   <div className="flex gap-2 mt-1">
                                       <input 
                                         type="text" 
                                         className="flex-1 border border-slate-300 rounded p-2 text-sm font-mono" 
                                         value={calcInput}
                                         onChange={(e) => setCalcInput(e.target.value)}
                                       />
                                       <button onClick={calculateSubnet} className="bg-indigo-600 text-white px-3 rounded text-sm">Calc</button>
                                   </div>
                               </div>
                               {calcResult && (
                                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-sm">
                                       <div className="flex justify-between"><span className="text-slate-500">Network:</span> <span className="font-mono">{calcResult.network}</span></div>
                                       <div className="flex justify-between"><span className="text-slate-500">Netmask:</span> <span className="font-mono">{calcResult.mask}</span></div>
                                       <div className="flex justify-between"><span className="text-slate-500">First IP:</span> <span className="font-mono">{calcResult.first}</span></div>
                                       <div className="flex justify-between"><span className="text-slate-500">Last IP:</span> <span className="font-mono">{calcResult.last}</span></div>
                                       <div className="flex justify-between"><span className="text-slate-500">Broadcast:</span> <span className="font-mono">{calcResult.broadcast}</span></div>
                                       <div className="flex justify-between border-t border-slate-200 pt-2"><span className="font-bold text-slate-700">Usable Hosts:</span> <span className="font-bold text-indigo-600">{calcResult.hosts}</span></div>
                                   </div>
                               )}
                           </div>
                       </div>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};