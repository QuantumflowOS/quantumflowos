import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { NetworkMetric } from '../types';

interface NetworkChartProps {
  color?: string;
  type: 'latency' | 'packetLoss';
}

export const NetworkChart: React.FC<NetworkChartProps> = ({ color = "#3b82f6", type }) => {
  const [data, setData] = useState<NetworkMetric[]>([]);

  useEffect(() => {
    // Initial data population
    const initialData: NetworkMetric[] = [];
    const now = new Date();
    for (let i = 20; i > 0; i--) {
      initialData.push({
        time: new Date(now.getTime() - i * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
        latency: 15 + Math.random() * 20,
        packetLoss: Math.random() > 0.9 ? Math.random() * 5 : 0
      });
    }
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newTime = new Date();
        const newPoint = {
          time: newTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
          latency: type === 'latency' ? 15 + Math.random() * 35 : 0, // Mock latency fluctuation
          packetLoss: type === 'packetLoss' ? (Math.random() > 0.85 ? Math.random() * 2 : 0) : 0
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [type]);

  if (type === 'latency') {
    return (
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#6b7280' }}
            />
            <Area type="monotone" dataKey="latency" stroke={color} fillOpacity={1} fill="url(#colorLatency)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 10]} hide />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="step" dataKey="packetLoss" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};