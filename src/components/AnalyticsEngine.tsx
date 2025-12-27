import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FileText, 
  Calendar, 
  Download, 
  Share2, 
  Filter, 
  PieChart as PieIcon, 
  TrendingUp,
  Activity,
  Users
} from 'lucide-react';
import { useToast } from './Toast';

const TICKET_DATA = [
  { name: 'Jan', faults: 65, requests: 40 },
  { name: 'Feb', faults: 59, requests: 45 },
  { name: 'Mar', faults: 80, requests: 35 },
  { name: 'Apr', faults: 81, requests: 50 },
  { name: 'May', faults: 56, requests: 60 },
  { name: 'Jun', faults: 55, requests: 70 },
  { name: 'Jul', faults: 40, requests: 80 },
];

const SLA_DATA = [
  { name: 'Met SLA', value: 850, color: '#10b981' },
  { name: 'Breached', value: 45, color: '#ef4444' },
  { name: 'Near Breach', value: 120, color: '#f59e0b' },
];

const TECH_PERFORMANCE = [
  { name: 'Thabo M.', tickets: 145, rating: 4.8 },
  { name: 'Juan-louw', tickets: 132, rating: 4.9 },
  { name: 'Sarah J.', tickets: 98, rating: 4.6 },
  { name: 'Mike R.', tickets: 110, rating: 4.2 },
];

export const AnalyticsEngine: React.FC = () => {
  const { addToast } = useToast();
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          addToast('Report generated: Executive_Summary_Oct.pdf', 'success');
      }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-indigo-600" /> Business Intelligence
             </h1>
             <p className="text-slate-500">Service performance analytics and executive reporting.</p>
          </div>
          <div className="flex gap-3">
              <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last Quarter</option>
                      <option>Year to Date</option>
                  </select>
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleExport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
              >
                  {isGenerating ? 'Generating...' : <><Download className="w-4 h-4" /> Export Report</>}
              </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
           {/* Ticket Volume Trends */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-indigo-500" /> Ticket Volume Trends
               </h3>
               <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={TICKET_DATA}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} />
                           <YAxis axisLine={false} tickLine={false} />
                           <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Legend />
                           <Bar dataKey="faults" name="Faults" fill="#ef4444" radius={[4, 4, 0, 0]} />
                           <Bar dataKey="requests" name="Service Requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* SLA Compliance */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <PieIcon className="w-5 h-5 text-indigo-500" /> SLA Compliance Status
               </h3>
               <div className="h-64 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                           <Pie
                               data={SLA_DATA}
                               cx="50%"
                               cy="50%"
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                           >
                               {SLA_DATA.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                           </Pie>
                           <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Legend verticalAlign="middle" align="right" layout="vertical" />
                       </PieChart>
                   </ResponsiveContainer>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6">
           {/* Technician Performance */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Users className="w-5 h-5 text-indigo-500" /> Technician Performance Leaderboard
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {TECH_PERFORMANCE.map((tech, i) => (
                       <div key={i} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex flex-col items-center text-center">
                           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-indigo-600 shadow-sm mb-3 border border-indigo-100">
                               {tech.name.charAt(0)}
                           </div>
                           <div className="font-bold text-slate-900">{tech.name}</div>
                           <div className="text-sm text-slate-500 mb-3">{tech.tickets} Tickets Closed</div>
                           <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200">
                               <span className="text-yellow-500">★</span>
                               <span className="font-bold text-slate-700">{tech.rating}</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </div>
  );
};