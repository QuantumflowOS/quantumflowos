import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Moon, 
  Save, 
  Check,
  Mail,
  Slack,
  CreditCard
} from 'lucide-react';
import { UserRole } from '../types';
import { useToast } from './Toast';

interface SettingsPageProps {
    role?: UserRole; // Optional prop to determine view, defaults to Admin in App
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ role = 'admin' }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'system' | 'billing'>('profile');
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();

  const handleSave = () => {
    setSaved(true);
    addToast("Settings updated successfully.", "success");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your {role} profile and preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm shadow-indigo-200"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'profile' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" /> Profile Details
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'notifications' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          
          {role === 'admin' && (
            <button
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'system' 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
                <Shield className="w-4 h-4" /> Security & System
            </button>
          )}

          {role === 'customer' && (
             <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'billing' 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
                <CreditCard className="w-4 h-4" /> Payment Methods
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Personal Details</h2>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src="https://picsum.photos/100/100" alt="Profile" className="w-20 h-20 rounded-full border-4 border-slate-50" />
                  <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 border-2 border-white">
                     <User className="w-3 h-3" />
                  </button>
                </div>
                <div>
                   <h3 className="font-medium text-slate-900">{role === 'admin' ? 'Thabo Moloi' : 'SwiftMove Logistics Admin'}</h3>
                   <p className="text-sm text-slate-500 capitalize">{role} Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" defaultValue={role === 'admin' ? "Thabo Moloi" : "Sarah Jenkins"} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" defaultValue={role === 'admin' ? "thabo.m@netserve.co.za" : "ops@swiftmove.co.za"} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                {role !== 'customer' && (
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Shift Schedule</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>08:00 - 17:00 (Standard)</option>
                        <option>16:00 - 00:00 (Swing)</option>
                        <option>00:00 - 08:00 (Night)</option>
                    </select>
                    </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Alert Preferences</h2>
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded">
                           <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="font-medium text-slate-900">Critical SMS Alerts</div>
                           <div className="text-xs text-slate-500">Receive SMS for Priority 1 outages</div>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded">
                           <Mail className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="font-medium text-slate-900">Weekly Summary Email</div>
                           <div className="text-xs text-slate-500">Digest of {role === 'customer' ? 'tickets and usage' : 'resolved tickets'}</div>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                     </label>
                  </div>

                  {role !== 'customer' && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded">
                            <Slack className="w-5 h-5" />
                            </div>
                            <div>
                            <div className="font-medium text-slate-900">Slack Integration</div>
                            <div className="text-xs text-slate-500">Post ticket updates to #ops-alerts</div>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                  )}
               </div>
            </div>
          )}
          
           {activeTab === 'system' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">System Config</h2>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                   Admin access required to modify global system parameters.
                </div>
                <div className="space-y-4 opacity-75 grayscale pointer-events-none">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">NMS Polling Interval (seconds)</label>
                      <input type="number" defaultValue="60" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Gemini API Key</label>
                      <input type="password" value="************************" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" readOnly />
                    </div>
                </div>
             </div>
           )}

           {activeTab === 'billing' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Payment Methods</h2>
                <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-slate-700" />
                        <div>
                            <div className="font-medium text-slate-900">•••• •••• •••• 4242</div>
                            <div className="text-xs text-slate-500">Expires 12/25</div>
                        </div>
                    </div>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Default</span>
                </div>
                <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                    + Add New Card
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};