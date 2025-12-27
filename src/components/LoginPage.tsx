import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MonitorSmartphone, Lock, Mail, ChevronRight, UserCircle, Briefcase, ShieldCheck } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';
import { useToast } from './Toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'staff' | 'client'>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // We determine role based on tab for simple mock logic, though `login` function checks the user list
        // If staff tab, we might accept admin or technician
        const success = await login(email, activeTab === 'staff' ? 'admin' : 'customer'); // Role param is loose here as login checks DB
        
        if (success) {
            addToast('Login successful. Redirecting...', 'success');
        } else {
            addToast('Invalid credentials. Please check your email.', 'error');
        }
    } catch (error) {
        addToast('Login failed. Try again.', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const fillCredentials = (role: UserRole) => {
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) {
        setEmail(mockUser.email);
        setPassword('password123');
        setActiveTab(role === 'customer' ? 'client' : 'staff');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Left: Brand Side */}
            <div className="md:w-1/2 bg-slate-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-efc02570fbc9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <MonitorSmartphone className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">NetServe SA</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Your entire IT department, <span className="text-indigo-400">automated.</span></h2>
                    <p className="text-slate-400 text-lg">
                        Access real-time diagnostics, ticketing, and AI-driven network insights.
                    </p>
                </div>
                <div className="relative z-10 space-y-4">
                     <div className="flex items-center gap-3 text-sm text-slate-400">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span>SOC-2 Compliant Security</span>
                     </div>
                     <div className="text-xs text-slate-600">
                        © 2026 NetServe SA. All rights reserved.
                     </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Welcome back</h3>
                    <p className="text-slate-500">Please select your department to login.</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
                    <button 
                        onClick={() => setActiveTab('staff')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'staff' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase className="w-4 h-4" /> Staff Portal
                    </button>
                    <button 
                        onClick={() => setActiveTab('client')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'client' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <UserCircle className="w-4 h-4" /> Client Portal
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'} <ChevronRight className="w-4 h-4" />
                    </button>

                    {activeTab === 'client' && (
                        <div className="text-center text-sm">
                            <span className="text-slate-500">Don't have an account? </span>
                            <span 
                                onClick={() => navigate('/signup')} 
                                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                            >
                                Sign up now
                            </span>
                        </div>
                    )}
                </form>

                {/* Quick Demo Links */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Login (Demo)</p>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => fillCredentials('admin')} className="px-3 py-2 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Admin</button>
                        <button onClick={() => fillCredentials('technician')} className="px-3 py-2 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Technician</button>
                        <button onClick={() => fillCredentials('customer')} className="px-3 py-2 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Client</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};