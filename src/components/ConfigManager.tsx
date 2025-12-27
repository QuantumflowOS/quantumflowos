import React, { useState } from 'react';
import { 
  FileCode, 
  History, 
  GitCommit, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  Search, 
  Server,
  ArrowLeftRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { MOCK_ASSETS, MOCK_BACKUPS } from '../constants';
import { useToast } from './Toast';

export const ConfigManager: React.FC = () => {
  const { addToast } = useToast();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(MOCK_ASSETS[0].id);
  const [selectedBackupId, setSelectedBackupId] = useState<string>(MOCK_BACKUPS[0].id);
  const [viewMode, setViewMode] = useState<'content' | 'diff'>('content');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const deviceAssets = MOCK_ASSETS.filter(a => ['Router', 'Switch', 'Firewall'].includes(a.type));
  const deviceBackups = MOCK_BACKUPS.filter(b => b.deviceId === selectedDeviceId);
  const selectedBackup = MOCK_BACKUPS.find(b => b.id === selectedBackupId);
  const previousBackup = MOCK_BACKUPS.find(b => b.id !== selectedBackupId && b.deviceId === selectedDeviceId);

  const handleBackupNow = () => {
      setIsBackingUp(true);
      setTimeout(() => {
          setIsBackingUp(false);
          addToast('Configuration backup completed successfully.', 'success');
      }, 2000);
  };

  const handleRollback = () => {
      if(window.confirm('Are you sure you want to rollback this device to the selected configuration? This will cause a reboot.')) {
          addToast('Rollback sequence initiated...', 'info');
          setTimeout(() => addToast('Device rebooting with restored config.', 'success'), 2500);
      }
  };

  // Simple diff logic for display (mocked highlighting)
  const renderDiff = () => {
      if (!selectedBackup || !previousBackup) return <div className="text-slate-400 p-4">Select two backups to compare.</div>;
      
      const currentLines = selectedBackup.content.split('\n');
      const prevLines = previousBackup.content.split('\n');

      return (
          <div className="flex font-mono text-xs h-full">
              {/* Previous Version */}
              <div className="flex-1 border-r border-slate-200 bg-red-50/10 overflow-auto p-4">
                  <div className="text-slate-500 font-bold mb-2 uppercase text-[10px]">Previous ({previousBackup.timestamp})</div>
                  {prevLines.map((line, i) => (
                      <div key={i} className={`whitespace-pre ${!currentLines.includes(line) ? 'bg-red-100 text-red-700' : 'text-slate-600'}`}>
                          <span className="inline-block w-6 text-slate-300 text-[10px] select-none text-right mr-2">{i+1}</span>
                          {line}
                      </div>
                  ))}
              </div>
              {/* Current Version */}
              <div className="flex-1 bg-green-50/10 overflow-auto p-4">
                  <div className="text-slate-500 font-bold mb-2 uppercase text-[10px]">Selected ({selectedBackup.timestamp})</div>
                  {currentLines.map((line, i) => (
                      <div key={i} className={`whitespace-pre ${!prevLines.includes(line) ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600'}`}>
                          <span className="inline-block w-6 text-slate-300 text-[10px] select-none text-right mr-2">{i+1}</span>
                          {line}
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-8 h-8 text-indigo-600" /> Config Vault (NCM)
             </h1>
             <p className="text-slate-500">Automated configuration backups, change tracking, and compliance auditing.</p>
          </div>
          <div className="flex gap-3">
              <button 
                onClick={handleBackupNow}
                disabled={isBackingUp}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                  {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isBackingUp ? 'Backing up...' : 'Backup Now'}
              </button>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
           {/* Sidebar: Devices */}
           <div className="w-full lg:w-72 bg-white rounded-xl border border-slate-200 flex flex-col shrink-0 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         placeholder="Filter devices..." 
                         className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       />
                   </div>
               </div>
               <div className="flex-1 overflow-y-auto">
                   {deviceAssets.map(device => (
                       <div 
                         key={device.id}
                         onClick={() => setSelectedDeviceId(device.id)}
                         className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedDeviceId === device.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                       >
                           <div className="font-bold text-slate-900 text-sm">{device.name}</div>
                           <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                               <Server className="w-3 h-3" /> {device.model}
                           </div>
                           <div className="text-xs text-slate-400 mt-1">{device.ipAddress}</div>
                       </div>
                   ))}
               </div>
           </div>

           {/* Main Content */}
           <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               {/* Toolbar */}
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                   <div className="flex gap-2">
                       <button 
                         onClick={() => setViewMode('content')}
                         className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'content' ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-200'}`}
                       >
                           <FileCode className="w-4 h-4" /> Config View
                       </button>
                       <button 
                         onClick={() => setViewMode('diff')}
                         className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'diff' ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-200'}`}
                       >
                           <ArrowLeftRight className="w-4 h-4" /> Diff Comparison
                       </button>
                   </div>
                   
                   {selectedBackup && (
                       <div className="flex items-center gap-4 text-sm">
                           <div className="flex items-center gap-1 text-slate-500">
                               <History className="w-4 h-4" />
                               <span>{selectedBackup.timestamp}</span>
                           </div>
                           <div className="flex items-center gap-1 text-slate-500">
                               <GitCommit className="w-4 h-4" />
                               <span>{selectedBackup.author}</span>
                           </div>
                           <button onClick={handleRollback} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition-colors border border-transparent hover:border-red-200">
                               <RotateCcw className="w-3 h-3" /> Rollback
                           </button>
                       </div>
                   )}
               </div>

               {/* Timeline & View */}
               <div className="flex flex-1 min-h-0">
                   {/* Backup Timeline */}
                   <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto p-4">
                       <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 pl-2">History</h3>
                       <div className="space-y-3">
                           {deviceBackups.map(backup => (
                               <div 
                                 key={backup.id}
                                 onClick={() => setSelectedBackupId(backup.id)}
                                 className={`relative pl-4 cursor-pointer group ${selectedBackupId === backup.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                               >
                                   <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${selectedBackupId === backup.id ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                   <div className="text-sm font-medium text-slate-800">{backup.timestamp}</div>
                                   <div className="text-xs text-slate-500">{backup.author}</div>
                                   {backup.changes > 0 && (
                                       <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded mt-1 inline-block">
                                           {backup.changes} lines changed
                                       </span>
                                   )}
                               </div>
                           ))}
                           {deviceBackups.length === 0 && <div className="text-sm text-slate-400 pl-2">No backups found.</div>}
                       </div>
                   </div>

                   {/* Viewer */}
                   <div className="flex-1 bg-white overflow-hidden relative">
                       {viewMode === 'content' ? (
                           selectedBackup ? (
                               <div className="h-full overflow-auto p-6 font-mono text-sm text-slate-700 bg-slate-50/30">
                                   {/* Mock Compliance Warning */}
                                   <div className="mb-4 bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-3">
                                       <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                                       <div>
                                           <h4 className="text-sm font-bold text-amber-800">Compliance Warning</h4>
                                           <p className="text-xs text-amber-700 mt-1">
                                               Detected 'ip nat outside' on unsecured interface without ACL.
                                           </p>
                                       </div>
                                   </div>
                                   <pre>{selectedBackup.content}</pre>
                               </div>
                           ) : (
                               <div className="flex items-center justify-center h-full text-slate-400">Select a backup to view content.</div>
                           )
                       ) : (
                           renderDiff()
                       )}
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};