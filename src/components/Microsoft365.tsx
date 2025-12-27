import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  MoreHorizontal, 
  Plus, 
  Mail, 
  RefreshCcw,
  Trash2,
  Lock,
  Cloud,
  LayoutGrid
} from 'lucide-react';
import { MOCK_M365_USERS, MOCK_M365_HEALTH, MOCK_CLIENTS } from '../constants';
import { useToast } from './Toast';

export const Microsoft365: React.FC = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState(MOCK_M365_USERS);
  const [selectedClientId, setSelectedClientId] = useState(MOCK_CLIENTS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'licenses' | 'health'>('users');
  const [showAddUser, setShowAddUser] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', license: 'Microsoft 365 Business Basic' });

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.userPrincipalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      const name = `${newUser.firstName} ${newUser.lastName}`;
      const email = `${newUser.firstName.toLowerCase()}.${newUser.lastName.charAt(0).toLowerCase()}@swiftmove.co.za`;
      
      const newM365User = {
          id: `m-${Date.now()}`,
          displayName: name,
          userPrincipalName: email,
          licenses: [newUser.license],
          status: 'Active' as const,
          lastLogin: 'Never',
          department: 'General'
      };

      setUsers(prev => [newM365User, ...prev]);
      setShowAddUser(false);
      setNewUser({ firstName: '', lastName: '', license: 'Microsoft 365 Business Basic' });
      addToast(`User ${name} created in Azure AD successfully.`, 'success');
  };

  const handleResetPassword = (name: string) => {
      addToast(`Password reset link sent to secondary email for ${name}.`, 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="w-8 h-8 text-blue-600" /> Microsoft 365 Management
             </h1>
             <p className="text-slate-500">Manage users, licenses, and tenant health directly.</p>
          </div>
          <div className="flex gap-4 items-center">
              <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                  {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="h-8 w-px bg-slate-200"></div>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
                  <LayoutGrid className="w-4 h-4" /> Admin Center
              </button>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex border-b border-slate-200 mb-6">
           {['Users', 'Licenses', 'Health'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab.toLowerCase() as any)}
                 className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
               >
                   {tab}
               </button>
           ))}
       </div>

       {/* USERS TAB */}
       {activeTab === 'users' && (
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                   <div className="relative w-full max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         placeholder="Search users..." 
                         className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                   </div>
                   <button 
                     onClick={() => setShowAddUser(true)}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                   >
                       <Plus className="w-4 h-4" /> Add User
                   </button>
               </div>
               
               <div className="flex-1 overflow-auto">
                   <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                           <tr>
                               <th className="px-6 py-3 font-medium">Display Name</th>
                               <th className="px-6 py-3 font-medium">Username</th>
                               <th className="px-6 py-3 font-medium">Licenses</th>
                               <th className="px-6 py-3 font-medium">Status</th>
                               <th className="px-6 py-3 font-medium text-right">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {filteredUsers.map(user => (
                               <tr key={user.id} className="hover:bg-slate-50 group">
                                   <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                           {user.displayName.charAt(0)}
                                       </div>
                                       {user.displayName}
                                   </td>
                                   <td className="px-6 py-4 text-slate-500">{user.userPrincipalName}</td>
                                   <td className="px-6 py-4">
                                       {user.licenses.length > 0 ? (
                                           <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                               {user.licenses[0]}
                                           </span>
                                       ) : (
                                           <span className="text-slate-400 text-xs italic">Unlicensed</span>
                                       )}
                                   </td>
                                   <td className="px-6 py-4">
                                       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                           user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                       }`}>
                                           {user.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                                           {user.status}
                                       </span>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => handleResetPassword(user.displayName)} className="p-2 text-slate-400 hover:text-blue-600" title="Reset Password"><Lock className="w-4 h-4" /></button>
                                           <button className="p-2 text-slate-400 hover:text-red-600" title="Block User"><Trash2 className="w-4 h-4" /></button>
                                       </div>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       )}

       {/* HEALTH TAB */}
       {activeTab === 'health' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2">
               {MOCK_M365_HEALTH.map((h, i) => (
                   <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                           h.status === 'Healthy' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                       }`}>
                           {h.status === 'Healthy' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                       </div>
                       <h3 className="font-bold text-slate-900 mb-1">{h.service}</h3>
                       <span className={`text-xs font-bold px-2 py-1 rounded-full mb-4 ${
                           h.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                       }`}>
                           {h.status}
                       </span>
                       <div className="text-xs text-slate-400">Last updated: {h.lastUpdated}</div>
                   </div>
               ))}
           </div>
       )}

       {/* LICENSES TAB */}
       {activeTab === 'licenses' && (
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2">
               <h3 className="font-bold text-slate-900 mb-6">License Utilization</h3>
               <div className="space-y-6">
                   <div>
                       <div className="flex justify-between text-sm mb-2">
                           <span className="font-medium text-slate-700">Microsoft 365 Business Standard</span>
                           <span className="text-slate-500">18 / 20 Assigned</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2.5">
                           <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-sm mb-2">
                           <span className="font-medium text-slate-700">Microsoft 365 Business Basic</span>
                           <span className="text-slate-500">45 / 50 Assigned</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2.5">
                           <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-sm mb-2">
                           <span className="font-medium text-slate-700">Exchange Online (Plan 1)</span>
                           <div className="flex items-center gap-2">
                               <span className="text-slate-500">5 / 5 Assigned</span>
                               <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">FULL</span>
                           </div>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2.5">
                           <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                       </div>
                   </div>
               </div>
               <div className="mt-8 pt-6 border-t border-slate-100 text-right">
                   <button className="text-blue-600 font-medium text-sm hover:underline">Purchase more licenses via CSP Portal →</button>
               </div>
           </div>
       )}

       {/* Add User Modal */}
       {showAddUser && (
           <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in zoom-in-95">
                   <div className="p-6 border-b border-slate-100">
                       <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
                       <p className="text-sm text-slate-500">Create a user in Azure AD and assign licenses.</p>
                   </div>
                   <form onSubmit={handleAddUser}>
                       <div className="p-6 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                   <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2" value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                   <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2" value={newUser.lastName} onChange={e => setNewUser({...newUser, lastName: e.target.value})} />
                               </div>
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-slate-700 mb-1">License Assignment</label>
                               <select className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white" value={newUser.license} onChange={e => setNewUser({...newUser, license: e.target.value})}>
                                   <option>Microsoft 365 Business Basic</option>
                                   <option>Microsoft 365 Business Standard</option>
                                   <option>Exchange Online P1</option>
                               </select>
                           </div>
                           <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex items-start gap-2">
                               <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                               Temporary password will be emailed to the admin account ({MOCK_M365_USERS[0].userPrincipalName}).
                           </div>
                       </div>
                       <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end gap-3">
                           <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
                           <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Create User</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};