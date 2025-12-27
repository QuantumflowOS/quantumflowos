import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from './Toast';
import { 
  MonitorSmartphone, 
  Check, 
  Shield, 
  Zap, 
  Briefcase, 
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lock,
  Server,
  Database,
  CheckCircle2
} from 'lucide-react';
import { PRICING_PLANS } from '../constants';
import { Client, User } from '../types';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addClient } = useData();
  const { addToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [provisioningState, setProvisioningState] = useState<string[]>([]);
  
  // Step 1: User & Company Info
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      companyName: '',
      industry: 'Logistics',
      phoneNumber: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Step 2: Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('managed');

  // Step 3: Payment
  const [cardData, setCardData] = useState({
      number: '',
      expiry: '',
      cvv: '',
      name: ''
  });

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) newErrors.number = 'Valid card number required';
    if (!cardData.expiry) newErrors.expiry = 'Required';
    if (!cardData.cvv || cardData.cvv.length < 3) newErrors.cvv = 'Required';
    if (!cardData.name) newErrors.name = 'Name on card required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
      if (step === 1) {
          if (!validateStep1()) return;
      }
      if (step === 2) {
          if (!selectedPlanId) {
              addToast('Please select a pricing plan.', 'error');
              return;
          }
      }
      setStep(prev => prev + 1);
      setErrors({});
  };

  const handleBack = () => setStep(prev => prev - 1);

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().substring(0, 19);
  };

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').trim().substring(0, 5);
  };

  const runProvisioningSequence = async (client: Client, user: User) => {
    const steps = [
        "Verifying payment details...",
        "Allocating secure tenant ID...",
        "Provisioning isolated database...",
        "Initializing AI diagnostic engine...",
        "Generating API keys...",
        "Finalizing setup..."
    ];

    for (const stepMsg of steps) {
        setProvisioningState(prev => [...prev, stepMsg]);
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    addClient(client);
    await signup(user);
    navigate('/customer');
    addToast('Welcome aboard! Your environment is ready.', 'success');
  };

  const handleComplete = async () => {
      if (!validateStep3()) return;

      setIsLoading(true);
      setStep(4); // Move to provisioning view

      // 1. Identify Plan
      const plan = PRICING_PLANS.find(p => p.id === selectedPlanId);
      if(!plan) return;

      // 2. Generate IDs
      const newClientId = `c-${Date.now()}`;
      const newUserId = `u-${Date.now()}`;

      // 3. Create Client Object (Onboarding)
      const newClient: Client = {
          id: newClientId,
          name: formData.companyName,
          industry: formData.industry,
          location: 'Remote (HQ)',
          status: 'Online',
          devices: 0,
          lastPing: 'Pending',
          connectionType: 'Pending Audit',
          slaTier: plan.slaTier,
          phoneNumber: formData.phoneNumber,
          outstandingBalance: 0,
          primaryContact: formData.fullName,
          email: formData.email,
          accountManager: 'Automated Agent',
          address: 'Address Pending Update'
      };

      // 4. Create User Object (Session)
      const newUser: User = {
          id: newUserId,
          name: formData.fullName,
          email: formData.email,
          role: 'customer',
          clientId: newClientId,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=6366f1&color=fff`
      };

      // Run simulation
      await runProvisioningSequence(newClient, newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Simple Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                    <MonitorSmartphone className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">NetServe SA</span>
            </div>
            {step < 4 && (
                <div className="text-sm text-slate-500 hidden sm:block">
                    Already have an account? <span onClick={() => navigate('/')} className="text-indigo-600 font-medium cursor-pointer hover:underline">Log in</span>
                </div>
            )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">
            
            {/* Progress Steps (Hidden during provisioning) */}
            {step < 4 && (
                <div className="flex items-center gap-4 mb-8">
                    {['Account', 'Plan', 'Payment'].map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = step >= stepNum;
                        const isCurrent = step === stepNum;
                        return (
                            <div key={label} className="flex items-center">
                                <div className={`flex items-center gap-2 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isActive ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-slate-300'
                                    }`}>
                                        {isActive ? (isCurrent ? stepNum : <Check className="w-4 h-4" />) : stepNum}
                                    </div>
                                    <span className={`text-sm font-medium hidden md:block ${isCurrent ? 'text-slate-900' : ''}`}>{label}</span>
                                </div>
                                {idx < 2 && <div className={`w-8 h-px mx-2 ${step > stepNum ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-500">
                
                {/* STEP 1: ACCOUNT */}
                {step === 1 && (
                    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's get started</h2>
                            <p className="text-slate-500 mb-8">Create your admin account to manage your network infrastructure.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                        placeholder="Jane Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Work Email</label>
                                    <input 
                                        type="email" 
                                        className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                        placeholder="jane@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                                    <input 
                                        type="text" 
                                        className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.companyName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                        placeholder="Acme Logistics"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    />
                                    {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Industry</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select 
                                            className="w-full border border-slate-200 rounded-lg p-3 pl-10 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                        >
                                            <option value="Logistics">Logistics & Supply Chain</option>
                                            <option value="Retail">Retail & E-commerce</option>
                                            <option value="Healthcare">Healthcare & Medical</option>
                                            <option value="Financial">Financial Services</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                        placeholder="+27 82 123 4567"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    />
                                    {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: PLAN */}
                {step === 2 && (
                    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                         <div className="text-center mb-10">
                             <h2 className="text-2xl font-bold text-slate-900 mb-4">Choose your plan</h2>
                             <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                                 <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                 >
                                     Monthly Billing
                                 </button>
                                 <button 
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                 >
                                     Yearly <span className="text-emerald-600 text-xs ml-1">(2 Months Free)</span>
                                 </button>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PRICING_PLANS.map(plan => {
                                const price = billingCycle === 'monthly' ? plan.price : Math.round(plan.price * 10 / 12);
                                const yearlyTotal = plan.price * 10;
                                
                                return (
                                    <div 
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${
                                            selectedPlanId === plan.id 
                                            ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' 
                                            : 'border-slate-100 bg-white hover:border-indigo-200'
                                        }`}
                                    >
                                        {plan.recommended && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                                Recommended
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                                            <div className="flex items-baseline mt-2">
                                                <span className="text-3xl font-bold text-slate-900">R{price.toLocaleString()}</span>
                                                <span className="text-slate-500 text-sm">/mo</span>
                                            </div>
                                            {billingCycle === 'yearly' && (
                                                <div className="text-xs text-emerald-600 font-medium mt-1">Billed R{yearlyTotal.toLocaleString()} yearly</div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3 mb-6">
                                            {plan.features.map((feat, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                                    <div className="mt-0.5 min-w-[16px]">
                                                        <Check className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <span className="leading-snug">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`mt-auto w-full py-2.5 rounded-lg text-sm font-bold text-center transition-colors ${
                                            selectedPlanId === plan.id 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}>
                                            {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                    </div>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 3 && (
                     <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure Payment</h2>
                                <p className="text-slate-500 mb-6">Complete your subscription to start onboarding. We use 256-bit encryption.</p>
                                
                                <div className="space-y-6">
                                    <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col gap-5 transition-shadow hover:shadow-md">
                                         <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                             <span className="font-semibold text-slate-900 flex items-center gap-2">
                                                 <CreditCard className="w-5 h-5 text-indigo-600" />
                                                 Credit / Debit Card
                                             </span>
                                             <div className="flex gap-2 opacity-60 grayscale">
                                                 <div className="w-8 h-5 bg-slate-300 rounded"></div>
                                                 <div className="w-8 h-5 bg-slate-300 rounded"></div>
                                             </div>
                                         </div>
                                         
                                         <div className="space-y-4">
                                             <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Card Number</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        className={`w-full border rounded-lg py-2.5 pl-4 pr-10 text-sm font-mono tracking-wide focus:ring-2 focus:ring-indigo-500 outline-none ${errors.number ? 'border-red-300' : 'border-slate-300'}`}
                                                        placeholder="0000 0000 0000 0000"
                                                        value={cardData.number}
                                                        maxLength={19}
                                                        onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        {cardData.number.length >= 16 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Lock className="w-4 h-4 text-slate-400" />}
                                                    </div>
                                                </div>
                                             </div>
                                             
                                             <div className="flex gap-4">
                                                 <div className="space-y-1.5 flex-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Expiry</label>
                                                    <input 
                                                        type="text" 
                                                        className={`w-full border rounded-lg py-2.5 px-4 text-sm font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none ${errors.expiry ? 'border-red-300' : 'border-slate-300'}`}
                                                        placeholder="MM/YY"
                                                        value={cardData.expiry}
                                                        onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                                                    />
                                                 </div>
                                                 <div className="space-y-1.5 flex-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CVV</label>
                                                    <input 
                                                        type="password" 
                                                        className={`w-full border rounded-lg py-2.5 px-4 text-sm font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none ${errors.cvv ? 'border-red-300' : 'border-slate-300'}`}
                                                        placeholder="123"
                                                        maxLength={4}
                                                        value={cardData.cvv}
                                                        onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                                                    />
                                                 </div>
                                             </div>
                                             
                                             <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cardholder Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`w-full border rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-300' : 'border-slate-300'}`}
                                                    placeholder="NAME ON CARD"
                                                    value={cardData.name}
                                                    onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                                                />
                                             </div>
                                         </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                                        <Shield className="w-3 h-3 text-emerald-600" />
                                        Your payment information is securely processed by Stripe.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-80 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Order Summary</h3>
                                <div className="space-y-4 pb-6 border-b border-slate-200 text-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-slate-900">{PRICING_PLANS.find(p => p.id === selectedPlanId)?.name}</div>
                                            <div className="text-xs text-slate-500 capitalize">{billingCycle} Plan</div>
                                        </div>
                                        <span className="font-medium">
                                            R{billingCycle === 'monthly' 
                                                ? PRICING_PLANS.find(p => p.id === selectedPlanId)?.price.toLocaleString() 
                                                : (PRICING_PLANS.find(p => p.id === selectedPlanId)!.price * 10).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Setup & Onboarding</span>
                                        <span className="font-medium text-emerald-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>VAT (15%)</span>
                                        <span>R{(billingCycle === 'monthly' ? (PRICING_PLANS.find(p => p.id === selectedPlanId)!.price * 0.15) : (PRICING_PLANS.find(p => p.id === selectedPlanId)!.price * 10 * 0.15)).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total Due</span>
                                    <span className="font-bold text-2xl text-indigo-600">
                                        R{((billingCycle === 'monthly' ? PRICING_PLANS.find(p => p.id === selectedPlanId)!.price : PRICING_PLANS.find(p => p.id === selectedPlanId)!.price * 10) * 1.15).toLocaleString(undefined, {maximumFractionDigits: 2})}
                                    </span>
                                </div>
                            </div>
                        </div>
                     </div>
                )}

                {/* STEP 4: PROVISIONING (Auto-runs) */}
                {step === 4 && (
                    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center animate-in fade-in zoom-in-95 duration-700">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
                                <Server className="w-10 h-10 text-indigo-600 animate-pulse" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Setting up your environment</h2>
                        <p className="text-slate-500 mb-8 max-w-md">Please wait while our automated systems provision your dedicated tenant and diagnostic tools.</p>

                        <div className="w-full max-w-md space-y-3">
                            {provisioningState.map((msg, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm animate-in slide-in-from-bottom-2 fade-in duration-300">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span className="text-slate-700 font-medium">{msg}</span>
                                </div>
                            ))}
                            {provisioningState.length < 6 && (
                                <div className="flex items-center gap-3 text-sm opacity-50">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                                    <span className="text-slate-400">Processing next step...</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Controls */}
                {step < 4 && (
                    <div className="p-6 border-t border-slate-100 flex justify-between bg-white">
                        {step > 1 ? (
                            <button 
                                onClick={handleBack}
                                disabled={isLoading}
                                className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-2 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <button 
                                onClick={handleNext}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:translate-x-1"
                            >
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-105"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                {isLoading ? 'Processing Payment...' : 'Pay & Initialize'}
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-slate-400 text-sm">
                © 2026 NetServe SA. All rights reserved.
            </div>
        </div>
    </div>
  );
};