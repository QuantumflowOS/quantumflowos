import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Server, Activity, AlertTriangle, Terminal, Code, Cpu } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAIDiagnosis } from '../services/geminiService';
import { NetworkChart } from './NetworkChart';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'NetServe Ops Brain online. I have access to real-time telemetry from all connected nodes. \n\nHow can I assist with network diagnostics today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeContext, setActiveContext] = useState<'none' | 'telemetry' | 'config' | 'logs'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = [
    "Analyze latency on CPT-EDGE-01",
    "Show config diff for JHB-CORE",
    "Check recent firewall logs",
    "Explain packet loss pattern"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate Context Switching based on keywords
    if (text.toLowerCase().includes('latency') || text.toLowerCase().includes('packet')) setActiveContext('telemetry');
    else if (text.toLowerCase().includes('config') || text.toLowerCase().includes('diff')) setActiveContext('config');
    else if (text.toLowerCase().includes('log')) setActiveContext('logs');
    else setActiveContext('none');

    try {
      const responseText = await getAIDiagnosis(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 bg-slate-50 p-6 rounded-xl">
      
      {/* LEFT: Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[600px] lg:h-auto">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
                <h2 className="font-semibold text-sm">NetServe Ops Brain</h2>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Live Connection
                </div>
            </div>
          </div>
          <div className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-indigo-300 border border-slate-700">
            v3.2-Flash
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-white border-slate-200' : 'bg-indigo-600 border-indigo-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-700" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none border border-slate-200' 
                  : 'bg-indigo-600 text-white rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 ml-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
               </div>
               <div className="bg-white px-4 py-2 rounded-full text-xs text-slate-500 border border-slate-200 shadow-sm animate-pulse">
                  Analyzing network telemetry...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          {messages.length < 3 && (
             <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                {QUICK_PROMPTS.map((prompt, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
             </div>
          )}
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Ops Brain..."
              className="flex-1 pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Context / Telemetry Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Active Context Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                 <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> Live Context
                 </h3>
                 <span className="text-[10px] font-mono text-slate-400 uppercase">{activeContext === 'none' ? 'IDLE' : 'ACTIVE STREAM'}</span>
             </div>

             {activeContext === 'none' && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                     <Cpu className="w-12 h-12 mb-3 text-slate-200" />
                     <p className="text-sm font-medium text-slate-500">Waiting for query context...</p>
                     <p className="text-xs mt-2">Ask about latency, configs, or logs to trigger live visualization.</p>
                 </div>
             )}

             {activeContext === 'telemetry' && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                         <div className="text-xs text-slate-500 mb-1">Target Node</div>
                         <div className="font-mono text-sm font-bold text-slate-800">CPT-EDGE-01 (192.168.40.1)</div>
                     </div>
                     <div>
                         <div className="text-xs font-semibold text-slate-500 mb-2">Real-time Latency (ms)</div>
                         <div className="h-32 bg-white border border-slate-100 rounded-lg overflow-hidden">
                             <NetworkChart type="latency" color="#10b981" />
                         </div>
                     </div>
                     <div>
                         <div className="text-xs font-semibold text-slate-500 mb-2">Packet Loss (%)</div>
                         <div className="h-24 bg-white border border-slate-100 rounded-lg overflow-hidden">
                             <NetworkChart type="packetLoss" color="#ef4444" />
                         </div>
                     </div>
                 </div>
             )}

             {activeContext === 'config' && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded border border-amber-100">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Configuration drift detected</span>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] text-slate-300 overflow-x-auto">
                          <div className="text-slate-500"># Diff vs Golden Image</div>
                          <div className="text-emerald-400">+ ip route 10.0.0.0 255.0.0.0 192.168.1.1</div>
                          <div className="text-red-400">- ip route 10.0.0.0 255.0.0.0 192.168.1.254</div>
                          <div className="text-slate-500">  interface GigabitEthernet0/1</div>
                          <div className="text-emerald-400">+  description UPLINK_MAIN</div>
                      </div>
                 </div>
             )}

             {activeContext === 'logs' && (
                 <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
                     <div className="text-xs font-semibold text-slate-500 mb-2">Recent Syslog Stream</div>
                     {[
                         { time: '10:42:01', lvl: 'INFO', msg: 'Interface Gi0/1 changed state to up' },
                         { time: '10:42:05', lvl: 'WARN', msg: '%OSPF-5-ADJCHG: Process 1, Nbr 192.168.1.5' },
                         { time: '10:43:12', lvl: 'ERR', msg: '%SEC-6-IPACCESSLOGP: list ACL_IN denied tcp' }
                     ].map((log, i) => (
                         <div key={i} className="flex gap-2 text-[10px] font-mono p-2 bg-slate-50 rounded border border-slate-100">
                             <span className="text-slate-400">{log.time}</span>
                             <span className={`font-bold ${log.lvl === 'ERR' ? 'text-red-600' : log.lvl === 'WARN' ? 'text-amber-600' : 'text-emerald-600'}`}>{log.lvl}</span>
                             <span className="text-slate-700 truncate">{log.msg}</span>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          {/* Connected Assets */}
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm text-white h-1/3">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4 text-indigo-400" /> Connected Assets
              </h3>
              <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 bg-slate-700/50 rounded hover:bg-slate-700 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span>JHB-CORE-01</span>
                      </div>
                      <span className="text-slate-400">99.9% Uptime</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 bg-slate-700/50 rounded hover:bg-slate-700 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span>CPT-EDGE-04</span>
                      </div>
                      <span className="text-slate-400">Low Load</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 bg-slate-700/50 rounded hover:bg-slate-700 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                          <span>DBN-POP-02</span>
                      </div>
                      <span className="text-amber-400">High Latency</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};