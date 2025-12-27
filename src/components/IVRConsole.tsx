import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  UserPlus, 
  CreditCard, 
  Bot, 
  MessageCircle, 
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
  PhoneIncoming,
  Building,
  MapPin,
  Save,
  Mic,
  Smile,
  Meh,
  Frown,
  Volume2,
  FileText,
  Clock,
  History,
  Activity,
  MessageSquare
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_TICKETS } from '../constants';
import { Client, Ticket } from '../types';
import { getAIDiagnosis } from '../services/geminiService';
import { useToast } from './Toast';

export const IVRConsole: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channel, setChannel] = useState<'voice' | 'whatsapp'>('voice');
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'on-hold' | 'ended'>('idle');
  const [ivrStage, setIvrStage] = useState<'identifying' | 'main-menu' | 'tech-support' | 'finance' | 'agent'>('identifying');
  const [identifiedClient, setIdentifiedClient] = useState<Client | null>(null);
  const [clientTickets, setClientTickets] = useState<Ticket[]>([]);
  
  // AI Agent State
  const [aiTranscript, setAiTranscript] = useState<{sender: 'caller' | 'agent', text: string}[]>([]);
  const [currentSentiment, setCurrentSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [agentGuidance, setAgentGuidance] = useState<string>('Waiting for call...');
  const [callDuration, setCallDuration] = useState(0);

  const { addToast } = useToast();
  
  // Timer for call duration
  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
        interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
        setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const simulateIncomingCall = () => {
    if (!phoneNumber) return;
    setCallState('ringing');
    
    setTimeout(() => {
        setCallState('connected');
        setIvrStage('identifying');
        handleIdentification();
    }, 2000);
  };

  const handleIdentification = () => {
     // Simulate Lookup
     setTimeout(() => {
         const client = MOCK_CLIENTS.find(c => c.phoneNumber.replace(/\s/g,'') === phoneNumber.replace(/\s/g,''));
         if (client) {
             setIdentifiedClient(client);
             setClientTickets(MOCK_TICKETS.filter(t => t.clientId === client.id));
             setIvrStage('main-menu');
             const greeting = channel === 'voice' 
                ? `Welcome back to NetServe, ${client.name}. I see you have ${clientTickets.length} open tickets.`
                : `🤖 *NetServe Bot*: Hi ${client.name}! How can we help you on WhatsApp today?`;
             
             addTranscript('agent', greeting);
             setAgentGuidance(channel === 'voice' ? 'Client Identified. Greet by name and verify security pin.' : 'WhatsApp Session Active. Use predefined templates for quick replies.');
         } else {
             setIvrStage('agent'); // Fallback to unknown
             const greeting = channel === 'voice' 
                ? 'Welcome to NetServe. I do not recognize this number. Are you a new client?'
                : '🤖 *NetServe Bot*: Welcome! Please reply with your Account ID to link this WhatsApp number.';
             
             addTranscript('agent', greeting);
             setAgentGuidance('Unknown Caller. Request Company Name and Account Number.');
         }
     }, 1500);
  };

  const addTranscript = (sender: 'caller' | 'agent', text: string) => {
      setAiTranscript(prev => [...prev, { sender, text }]);
  };

  const simulateCallerResponse = (responseType: 'tech' | 'billing' | 'angry' | 'happy') => {
      let text = '';
      if (responseType === 'tech') {
          text = "I'm having huge latency issues at the warehouse today.";
          setCurrentSentiment('neutral');
          setAgentGuidance('Tech Issue Detected. Open "Network Diagnostics" panel and ask for specific error messages.');
      } else if (responseType === 'billing') {
          text = "Why was I charged double this month? This is unacceptable.";
          setCurrentSentiment('negative');
          setAgentGuidance('Billing Dispute. Remain calm. Open latest invoice INV-2023-001. Check for SLA overages.');
      } else if (responseType === 'angry') {
          text = "This service is terrible! I want to speak to a manager now!";
          setCurrentSentiment('negative');
          setAgentGuidance('Escalation Requested. Attempt de-escalation: "I can help you right now," otherwise transfer to Tier 2.');
      } else {
          text = "Thanks, that fixed it! You guys are great.";
          setCurrentSentiment('positive');
          setAgentGuidance('Resolution Confirmed. Ask if there is anything else, then close ticket.');
      }
      
      addTranscript('caller', text);
      
      // Auto-reply simulation
      setTimeout(async () => {
          const aiReply = await getAIDiagnosis(`Caller said: "${text}". Suggest a professional support response.`);
          addTranscript('agent', aiReply);
      }, 1000);
  };

  const endCall = () => {
      setCallState('ended');
      setIdentifiedClient(null);
      setAiTranscript([]);
      setTimeout(() => setCallState('idle'), 2000);
  };

  return (
    <div className="h-full max-w-[1600px] mx-auto p-6 flex flex-col gap-6">
       {/* Top Bar: Status */}
       <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div>
               <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   {channel === 'voice' ? <PhoneIncoming className="w-6 h-6 text-indigo-600" /> : <MessageCircle className="w-6 h-6 text-emerald-600" />}
                   Omnichannel Contact Center
               </h1>
               <p className="text-sm text-slate-500">Agent: Juan-louw Greyling (Tier 2) • Status: <span className="text-emerald-600 font-bold">Online</span></p>
           </div>
           <div className="flex items-center gap-6">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setChannel('voice')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${channel === 'voice' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                    >
                        <Phone className="w-4 h-4" /> Voice
                    </button>
                    <button 
                        onClick={() => setChannel('whatsapp')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${channel === 'whatsapp' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                    >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                </div>
               <div className="flex flex-col items-end">
                   <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Avg Handle Time</span>
                   <span className="text-lg font-bold text-slate-700">4m 12s</span>
               </div>
               <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Sentiment Score</span>
                    <span className="text-lg font-bold text-emerald-600">4.8/5</span>
               </div>
           </div>
       </div>

       <div className="flex-1 grid grid-cols-12 gap-6 min-h-[500px]">
           
           {/* LEFT COLUMN: ACTIVE CALL CONTROLS (4 Cols) */}
           <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
               {/* Phone/Chat Simulator Card */}
               <div className={`rounded-2xl p-6 text-white shadow-xl relative overflow-hidden min-h-[400px] flex flex-col transition-colors duration-500 ${channel === 'whatsapp' ? 'bg-emerald-900' : 'bg-slate-900'}`}>
                   {channel === 'whatsapp' && (
                       <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-10"></div>
                   )}
                   <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${channel === 'whatsapp' ? 'from-emerald-400 to-emerald-600' : 'from-blue-500 to-purple-600'}`}></div>
                   
                   {/* Call Status Header */}
                   <div className="flex justify-between items-center mb-8 relative z-10">
                       <div className="flex items-center gap-2">
                           <div className={`w-3 h-3 rounded-full ${callState === 'connected' ? 'bg-emerald-500 animate-pulse' : callState === 'ringing' ? 'bg-yellow-500 animate-bounce' : 'bg-red-500'}`}></div>
                           <span className="font-mono text-sm uppercase">{channel === 'whatsapp' ? (callState === 'connected' ? 'Active Chat' : 'Offline') : callState}</span>
                       </div>
                       <div className="font-mono text-xl">{formatTime(callDuration)}</div>
                   </div>

                   {/* Main Caller Display */}
                   <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                       {callState === 'idle' ? (
                           <>
                               <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 border-white/10 ${channel === 'whatsapp' ? 'bg-emerald-800' : 'bg-slate-800'}`}>
                                   {channel === 'whatsapp' ? <MessageCircle className="w-8 h-8 text-emerald-200" /> : <Phone className="w-8 h-8 text-slate-500" />}
                               </div>
                               <input 
                                  type="text" 
                                  placeholder="Simulate: +27..."
                                  className="bg-white/10 border-none rounded-lg px-4 py-2 text-center text-white placeholder-white/30 focus:ring-2 focus:ring-white/50 mb-4 w-full max-w-[200px]"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                               />
                               <button 
                                  onClick={simulateIncomingCall}
                                  disabled={!phoneNumber}
                                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                               >
                                   Simulate {channel === 'whatsapp' ? 'Chat' : 'Call'}
                               </button>
                           </>
                       ) : (
                           <>
                               <div className="relative mb-6">
                                   <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-white/10 ${channel === 'whatsapp' ? 'bg-emerald-800' : 'bg-slate-800'}`}>
                                       <User className="w-10 h-10 text-white" />
                                   </div>
                                   {identifiedClient && (
                                       <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-xs px-2 py-1 rounded-full border-2 border-slate-900">
                                           {identifiedClient.slaTier}
                                       </div>
                                   )}
                               </div>
                               <h2 className="text-2xl font-bold mb-1">{identifiedClient ? identifiedClient.name : phoneNumber}</h2>
                               <p className="text-white/60 text-sm mb-6">{identifiedClient ? identifiedClient.location : 'Unknown Location'}</p>
                               
                               <div className="flex gap-4 w-full max-w-xs">
                                   <button onClick={endCall} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                       <XCircle className="w-5 h-5" /> End Session
                                   </button>
                                   {channel === 'voice' && (
                                       <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                           <Mic className="w-5 h-5" /> Mute
                                       </button>
                                   )}
                               </div>
                           </>
                       )}
                   </div>

                   {/* Sim Controls */}
                   {callState === 'connected' && (
                       <div className="mt-8 pt-4 border-t border-white/10 relative z-10">
                           <p className="text-xs text-white/50 mb-2 text-center">SIMULATE CUSTOMER RESPONSE</p>
                           <div className="grid grid-cols-2 gap-2">
                               <button onClick={() => simulateCallerResponse('tech')} className="bg-white/10 p-2 rounded text-xs hover:bg-white/20">Technical Issue</button>
                               <button onClick={() => simulateCallerResponse('billing')} className="bg-white/10 p-2 rounded text-xs hover:bg-white/20">Billing Complaint</button>
                               <button onClick={() => simulateCallerResponse('angry')} className="bg-red-500/50 text-red-100 p-2 rounded text-xs hover:bg-red-500/70">Angry Customer</button>
                               <button onClick={() => simulateCallerResponse('happy')} className="bg-emerald-500/50 text-emerald-100 p-2 rounded text-xs hover:bg-emerald-500/70">Happy/Resolved</button>
                           </div>
                       </div>
                   )}
               </div>

                {/* Sentiment Gauge */}
                {callState === 'connected' && (
                   <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                       <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                           <Activity className="w-4 h-4" /> Live Sentiment Analysis
                       </h3>
                       <div className="flex items-center justify-between px-4">
                           <Frown className={`w-8 h-8 transition-colors ${currentSentiment === 'negative' ? 'text-red-500 scale-125' : 'text-slate-200'}`} />
                           <div className="h-2 flex-1 mx-4 bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full transition-all duration-500 ${
                                   currentSentiment === 'positive' ? 'w-full bg-emerald-500 ml-auto' :
                                   currentSentiment === 'negative' ? 'w-1/3 bg-red-500 mr-auto' :
                                   'w-1/2 mx-auto bg-amber-400'
                               }`}></div>
                           </div>
                           <Smile className={`w-8 h-8 transition-colors ${currentSentiment === 'positive' ? 'text-emerald-500 scale-125' : 'text-slate-200'}`} />
                       </div>
                       <div className="text-center mt-2 text-xs font-medium text-slate-600 capitalize">
                           Current Tone: {currentSentiment}
                       </div>
                   </div>
                )}
           </div>

           {/* CENTER COLUMN: SCRIPT & TRANSCRIPT (5 Cols) */}
           <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
               {/* Dynamic Scripting */}
               <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Bot className="w-24 h-24" />
                   </div>
                   <div className="relative z-10">
                       <h3 className="text-indigo-200 text-xs font-bold uppercase mb-2">AI Agent Guidance</h3>
                       <p className="text-lg font-medium leading-relaxed">
                           {agentGuidance}
                       </p>
                   </div>
               </div>

               {/* Live Transcript */}
               <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[400px]">
                   <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                       <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                           {channel === 'voice' ? <FileText className="w-4 h-4 text-indigo-500" /> : <MessageSquare className="w-4 h-4 text-emerald-500" />} 
                           {channel === 'voice' ? 'Live Transcript' : 'WhatsApp Chat'}
                       </h3>
                       <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> REC
                       </span>
                   </div>
                   <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${channel === 'whatsapp' ? 'bg-[#e5ddd5]' : 'bg-white'}`}>
                       {aiTranscript.length === 0 ? (
                           <div className="text-center text-slate-400 mt-10 italic text-sm">Waiting for activity...</div>
                       ) : (
                           aiTranscript.map((line, i) => (
                               <div key={i} className={`flex gap-3 ${line.sender === 'agent' ? 'flex-row-reverse' : ''}`}>
                                   {channel === 'voice' && (
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                           line.sender === 'agent' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                       }`}>
                                           {line.sender === 'agent' ? 'AG' : 'CL'}
                                       </div>
                                   )}
                                   <div className={`p-3 rounded-xl text-sm max-w-[85%] shadow-sm ${
                                       line.sender === 'agent' 
                                        ? (channel === 'whatsapp' ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-indigo-50 text-indigo-900 rounded-tr-none') 
                                        : 'bg-white text-slate-800 rounded-tl-none'
                                   }`}>
                                       {line.text}
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
               </div>
           </div>

           {/* RIGHT COLUMN: CLIENT CONTEXT (3 Cols) */}
           <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
               {identifiedClient ? (
                   <>
                       <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                           <div className="text-xs font-bold text-slate-400 uppercase mb-3">Client Profile</div>
                           <h3 className="font-bold text-slate-900 text-lg mb-1">{identifiedClient.name}</h3>
                           <div className="text-sm text-slate-500 mb-4">{identifiedClient.industry} • {identifiedClient.location}</div>
                           
                           <div className="grid grid-cols-2 gap-2 mb-4">
                               <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                   <div className="text-[10px] text-slate-400">Status</div>
                                   <div className={`font-bold text-sm ${identifiedClient.status === 'Online' ? 'text-emerald-600' : 'text-red-600'}`}>
                                       {identifiedClient.status}
                                   </div>
                               </div>
                               <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                   <div className="text-[10px] text-slate-400">Balance</div>
                                   <div className={`font-bold text-sm ${identifiedClient.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                       R{identifiedClient.outstandingBalance}
                                   </div>
                               </div>
                           </div>
                           
                           <button className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">
                               Open Full CRM Profile
                           </button>
                       </div>

                       <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Tickets</div>
                           <div className="space-y-3">
                               {clientTickets.length > 0 ? clientTickets.map(ticket => (
                                   <div key={ticket.id} className="p-2 border border-slate-100 rounded bg-slate-50 hover:border-indigo-200 transition-colors cursor-pointer">
                                       <div className="flex justify-between items-start mb-1">
                                           <span className="text-[10px] font-mono text-slate-500">{ticket.id}</span>
                                           <span className={`text-[10px] px-1.5 rounded ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{ticket.status}</span>
                                       </div>
                                       <div className="text-xs font-medium text-slate-800 line-clamp-2">{ticket.title}</div>
                                   </div>
                               )) : (
                                   <div className="text-center text-xs text-slate-400 py-4">No recent tickets.</div>
                               )}
                           </div>
                       </div>
                   </>
               ) : (
                   <div className="h-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                       <Search className="w-8 h-8 mb-2 opacity-50" />
                       <p className="text-sm font-medium">Waiting for caller identification...</p>
                       <p className="text-xs mt-1">Context will appear here when a call connects.</p>
                   </div>
               )}
           </div>

       </div>
    </div>
  );
};