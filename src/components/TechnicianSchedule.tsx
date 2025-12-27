import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  Wifi,
  Plus,
  Map as MapIcon,
  Calendar as CalendarIcon,
  MapPin,
  Sparkles,
  Loader2,
  CheckCircle2,
  Navigation,
  Battery,
  Gauge,
  User,
  Phone,
  Briefcase
} from 'lucide-react';
import { MOCK_SCHEDULE } from '../constants';
import { useToast } from './Toast';

const TECH_FLEET = [
    { id: 't1', name: 'Thabo M.', status: 'Driving', location: 'N1 North, Midrand', battery: 85, speed: 82, nextJob: 'MediCare Clinic', eta: '14m', coords: {x: 60, y: 40} },
    { id: 't2', name: 'Juan-louw G.', status: 'On-site', location: 'Connect24 HQ', battery: 42, speed: 0, nextJob: 'SwiftMove Logistics', eta: '1h 20m', coords: {x: 30, y: 70} },
    { id: 't3', name: 'Sarah J.', status: 'Idle', location: 'NetServe Depot', battery: 100, speed: 0, nextJob: 'Waiting...', eta: '-', coords: {x: 80, y: 20} },
];

const PENDING_JOBS = [
    { id: 'j1', client: 'Urban Mart', issue: 'POS Offline', priority: 'High', location: 'Sandton', coords: {x: 65, y: 45} },
    { id: 'j2', client: 'Dr. Nel', issue: 'Printer Config', priority: 'Low', location: 'Pretoria East', coords: {x: 55, y: 30} }
];

export const TechnicianSchedule: React.FC = () => {
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'calendar' | 'map'>('map');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<{saved: string, distance: string} | null>(null);
  
  // Map State
  const [selectedTechId, setSelectedTechId] = useState<string | null>('t1');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [dispatchRoute, setDispatchRoute] = useState<{from: {x:number, y:number}, to: {x:number, y:number}} | null>(null);
  const [pendingJobs, setPendingJobs] = useState(PENDING_JOBS);

  const activeTech = TECH_FLEET.find(t => t.id === selectedTechId);
  const activeJob = pendingJobs.find(j => j.id === selectedJobId);

  // Helper to get day name
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const getEventsForDay = (dayOffset: number, hour: string) => {
    if (dayOffset === 4 && hour === '08:00') return MOCK_SCHEDULE[0]; // Friday 8am
    if (dayOffset === 4 && hour === '11:00') return MOCK_SCHEDULE[2]; // Friday 11am
    if (dayOffset === 5 && hour === '14:00') return MOCK_SCHEDULE[1]; // Saturday/Fri for demo
    return null;
  };

  const handleOptimizeRoute = () => {
      setIsOptimizing(true);
      setOptimizationStats(null);
      setTimeout(() => {
          setIsOptimizing(false);
          setOptimizationStats({ saved: '45 mins', distance: '12 km' });
          addToast('Route optimized based on historical traffic patterns.', 'success');
      }, 2500);
  };

  const handleJobSelect = (job: any) => {
      setSelectedJobId(job.id);
      // Find nearest tech (Mock logic: just pick Thabo)
      setSelectedTechId('t1');
      setDispatchRoute(null); // Reset route
  };

  const handleDispatch = () => {
      if (!activeJob || !activeTech) return;
      
      setDispatchRoute({
          from: activeTech.coords,
          to: activeJob.coords
      });

      addToast(`Dispatching ${activeTech.name} to ${activeJob.client}...`, 'info');
      
      setTimeout(() => {
          addToast('Job Assigned. Route updated on Technician App.', 'success');
          setPendingJobs(prev => prev.filter(j => j.id !== activeJob.id));
          setSelectedJobId(null);
          setDispatchRoute(null);
      }, 3000);
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-7xl mx-auto">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Dispatch Schedule</h1>
             <p className="text-slate-500">Manage technician onsite visits and remote maintenance windows.</p>
          </div>
          <div className="flex items-center gap-4">
             {optimizationStats && (
                 <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-right-4">
                     <CheckCircle2 className="w-4 h-4" />
                     <div className="text-xs font-medium">
                         Saved <span className="font-bold">{optimizationStats.saved}</span> & <span className="font-bold">{optimizationStats.distance}</span>
                     </div>
                 </div>
             )}
             
             <button 
                onClick={handleOptimizeRoute}
                disabled={isOptimizing}
                className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
             >
                {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isOptimizing ? 'Optimizing...' : 'AI Optimize Route'}
             </button>

             <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button 
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'calendar' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <CalendarIcon className="w-4 h-4" /> Calendar
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <MapIcon className="w-4 h-4" /> Route Map
                </button>
             </div>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Job
             </button>
          </div>
       </div>

       <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden relative">
          
          {viewMode === 'calendar' ? (
              <>
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                     <div className="flex items-center gap-4">
                        <button className="p-1 hover:bg-slate-200 rounded"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
                        <h2 className="font-semibold text-slate-800 text-lg">Oct 21 - Oct 25, 2024</h2>
                        <button className="p-1 hover:bg-slate-200 rounded"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
                     </div>
                     <div className="flex gap-4 text-sm">
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Onsite
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Remote
                         </div>
                     </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="flex-1 overflow-y-auto">
                     <div className="grid grid-cols-6 min-w-[800px]">
                        {/* Time Column */}
                        <div className="border-r border-slate-100 bg-slate-50/30">
                           <div className="h-12 border-b border-slate-100"></div> {/* Header spacer */}
                           {times.map(time => (
                              <div key={time} className="h-24 border-b border-slate-100 px-2 py-2 text-xs text-slate-400 text-right">
                                 {time}
                              </div>
                           ))}
                        </div>

                        {/* Days Columns */}
                        {days.map((day, dayIndex) => (
                           <div key={day} className="border-r border-slate-100 relative group">
                              <div className="h-12 border-b border-slate-100 flex flex-col items-center justify-center bg-slate-50">
                                 <span className="text-xs font-semibold text-slate-500 uppercase">{day}</span>
                                 <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mt-1 ${dayIndex === 4 ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                                     {21 + dayIndex}
                                 </span>
                              </div>
                              
                              {times.map(time => {
                                 const event = getEventsForDay(dayIndex, time);
                                 return (
                                    <div key={`${day}-${time}`} className="h-24 border-b border-slate-100 p-1 relative">
                                       {event && (
                                          <div 
                                            onClick={() => addToast(`Opening job: ${event.title}`, 'info')}
                                            className={`absolute inset-x-1 top-1 bottom-1 rounded-lg p-2 border cursor-pointer hover:shadow-md transition-all ${
                                               event.type === 'Onsite' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                                               event.type === 'Maintenance' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'
                                            }`}
                                          >
                                              <div className="flex items-center gap-1 mb-1">
                                                  {event.type === 'Onsite' ? <Truck className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                                                  <div className="text-[10px] font-bold uppercase opacity-70">{event.type}</div>
                                              </div>
                                              <div className="text-xs font-bold truncate leading-tight">{event.title}</div>
                                              <div className="text-[10px] mt-1 truncate font-medium text-slate-600">{event.clientName}</div>
                                          </div>
                                       )}
                                       {!event && (
                                          <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
                                              <button className="opacity-0 group-hover:opacity-100 bg-indigo-50 text-indigo-600 rounded p-1 hover:bg-indigo-100 transition-opacity">
                                                 <Plus className="w-4 h-4" />
                                              </button>
                                          </div>
                                       )}
                                    </div>
                                 );
                              })}
                           </div>
                        ))}
                     </div>
                  </div>
              </>
          ) : (
              <div className="flex h-full relative">
                  {/* Sidebar Fleet List */}
                  <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 shadow-xl">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              <Truck className="w-5 h-5 text-indigo-600" /> Fleet Status
                          </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {TECH_FLEET.map(tech => (
                              <div 
                                key={tech.id}
                                onClick={() => setSelectedTechId(tech.id)}
                                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${selectedTechId === tech.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                              >
                                  <div className="flex justify-between items-start mb-1">
                                      <div className="font-bold text-slate-900">{tech.name}</div>
                                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                          tech.status === 'Driving' ? 'bg-emerald-100 text-emerald-700' :
                                          tech.status === 'On-site' ? 'bg-blue-100 text-blue-700' :
                                          'bg-slate-200 text-slate-600'
                                      }`}>
                                          {tech.status}
                                      </span>
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                                      <MapPin className="w-3 h-3" /> {tech.location}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-slate-400">
                                      <span className="flex items-center gap-1"><Battery className="w-3 h-3" /> {tech.battery}%</span>
                                      {tech.status === 'Driving' && (
                                          <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {tech.speed} km/h</span>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Main Map Area */}
                  <div className="flex-1 relative bg-slate-900 overflow-hidden group">
                      {/* Map Simulation */}
                      <div className="absolute inset-0 opacity-40" 
                        style={{
                            backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Map_of_Pretoria_and_surroundings.svg/2000px-Map_of_Pretoria_and_surroundings.svg.png")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'invert(1) grayscale(100%) brightness(0.8)'
                        }}
                      ></div>
                      
                      {/* Overlay Grid */}
                      <div className="absolute inset-0" 
                        style={{backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.1}}>
                      </div>

                      {/* Tech Markers */}
                      {TECH_FLEET.map(tech => (
                          <div 
                            key={tech.id} 
                            className="absolute flex flex-col items-center transition-all duration-1000"
                            style={{ top: `${tech.coords.y}%`, left: `${tech.coords.x}%` }}
                          >
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg cursor-pointer ${
                                  selectedTechId === tech.id ? 'bg-indigo-600 border-white z-20 scale-125' : 'bg-slate-700 border-slate-500 z-10 hover:scale-110'
                              }`} onClick={() => setSelectedTechId(tech.id)}>
                                  <Navigation className={`w-4 h-4 ${selectedTechId === tech.id ? 'text-white' : 'text-slate-300'}`} />
                              </div>
                              {selectedTechId === tech.id && (
                                  <div className="mt-1 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur font-bold whitespace-nowrap">
                                      {tech.name}
                                  </div>
                              )}
                          </div>
                      ))}

                      {/* Job Markers */}
                      {pendingJobs.map(job => (
                          <div 
                            key={job.id} 
                            className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform z-10"
                            style={{ top: `${job.coords.y}%`, left: `${job.coords.x}%` }}
                            onClick={() => handleJobSelect(job)}
                          >
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg ${selectedJobId === job.id ? 'bg-white border-red-500 animate-bounce' : 'bg-red-500 border-white'}`}>
                                  <Briefcase className={`w-4 h-4 ${selectedJobId === job.id ? 'text-red-500' : 'text-white'}`} />
                              </div>
                          </div>
                      ))}

                      {/* Route Line */}
                      {dispatchRoute && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                              <line 
                                x1={`${dispatchRoute.from.x}%`} 
                                y1={`${dispatchRoute.from.y}%`} 
                                x2={`${dispatchRoute.to.x}%`} 
                                y2={`${dispatchRoute.to.y}%`} 
                                stroke="#6366f1" 
                                strokeWidth="3" 
                                strokeDasharray="5,5" 
                                className="animate-[dash_1s_linear_infinite]"
                              />
                          </svg>
                      )}

                      {/* Active Tech Telemetry Card */}
                      {activeTech && !activeJob && (
                          <div className="absolute top-4 right-4 w-72 bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-slate-200 p-0 overflow-hidden animate-in slide-in-from-right-10 z-30">
                              <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                                  <h3 className="font-bold flex items-center gap-2">
                                      <User className="w-4 h-4 text-indigo-400" /> {activeTech.name}
                                  </h3>
                                  <button className="p-1 hover:bg-slate-700 rounded-full transition-colors" onClick={() => addToast(`Calling ${activeTech.name}...`, 'info')}>
                                      <Phone className="w-4 h-4 text-emerald-400" />
                                  </button>
                              </div>
                              <div className="p-4">
                                  <div className="grid grid-cols-2 gap-3 mb-4">
                                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                          <div className="text-xs text-slate-500 mb-1">ETA</div>
                                          <div className="font-bold text-lg text-indigo-600">{activeTech.eta}</div>
                                      </div>
                                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                          <div className="text-xs text-slate-500 mb-1">Speed</div>
                                          <div className="font-bold text-lg text-slate-800">{activeTech.speed} <span className="text-xs font-normal text-slate-400">km/h</span></div>
                                      </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                      <div>
                                          <div className="flex justify-between text-xs mb-1">
                                              <span className="text-slate-500">Destination</span>
                                              <span className="font-semibold text-slate-700">{activeTech.nextJob}</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                              <div className="h-full bg-indigo-500 w-2/3 animate-pulse"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Dispatch Action Panel */}
                      {activeJob && (
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-in slide-in-from-bottom-10 z-40">
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <h3 className="font-bold text-slate-900">{activeJob.client}</h3>
                                      <p className="text-xs text-slate-500">{activeJob.issue}</p>
                                  </div>
                                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">{activeJob.priority} Priority</span>
                              </div>
                              
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                      <Navigation className="w-4 h-4 text-indigo-600" />
                                      <div className="text-xs">
                                          <span className="block text-slate-500">Nearest Tech</span>
                                          <span className="font-bold text-slate-800">{activeTech?.name} (8km)</span>
                                      </div>
                                  </div>
                                  <div className="text-right text-xs">
                                      <span className="block text-slate-500">Est. Arrival</span>
                                      <span className="font-bold text-emerald-600">12 mins</span>
                                  </div>
                              </div>

                              <div className="flex gap-3">
                                  <button onClick={() => setSelectedJobId(null)} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                                  <button onClick={handleDispatch} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2">
                                      <Truck className="w-4 h-4" /> Dispatch Now
                                  </button>
                              </div>
                          </div>
                      )}

                      {/* Unassigned Job Queue */}
                      {!activeJob && pendingJobs.length > 0 && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 p-3 w-64 z-30">
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                  <Briefcase className="w-3 h-3" /> Pending Jobs ({pendingJobs.length})
                              </h4>
                              <div className="space-y-2">
                                  {pendingJobs.map(job => (
                                      <div 
                                        key={job.id} 
                                        onClick={() => handleJobSelect(job)}
                                        className="p-2 bg-white rounded border border-slate-200 hover:border-indigo-300 cursor-pointer shadow-sm transition-all"
                                      >
                                          <div className="flex justify-between items-start">
                                              <span className="font-bold text-xs text-slate-800">{job.client}</span>
                                              <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500">{job.priority}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-500 mt-1">{job.issue}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          )}

       </div>
       <style>{`
        @keyframes dash {
            to { stroke-dashoffset: -20; }
        }
       `}</style>
    </div>
  );
};