import React, { useState } from 'react';
import { VitalRecord } from '../types';
import { storage } from '../lib/storage';
import { 
  Plus, 
  Trash2, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  Scale,
  X,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

interface VitalTrackerProps {
  vitals: VitalRecord[];
  onUpdate: () => void;
}

export default function VitalTracker({ vitals, onUpdate }: VitalTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<VitalRecord['type']>('heart_rate');
  const [value, setValue] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    const unitMap: Record<VitalRecord['type'], string> = {
      heart_rate: 'bpm',
      blood_pressure: 'mmHg',
      temperature: '°F',
      oxygen: '%',
      weight: 'lbs'
    };

    const newRecord: VitalRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      value,
      unit: unitMap[type]
    };

    storage.saveVital(newRecord);

    // Check for abnormal vitals and trigger notification
    let alertMessage = '';
    if (type === 'heart_rate') {
      const hr = parseInt(value);
      if (hr > 100) alertMessage = `High heart rate detected: ${hr} BPM. Please rest.`;
      if (hr < 60) alertMessage = `Low heart rate detected: ${hr} BPM.`;
    } else if (type === 'blood_pressure') {
      const [sys] = value.split('/').map(v => parseInt(v));
      if (sys > 140) alertMessage = `High blood pressure detected: ${value}. Consider consulting a professional.`;
    }

    if (alertMessage) {
      storage.saveNotification({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title: 'Vital Sign Alert',
        message: alertMessage,
        type: 'vital_alert',
        read: false
      });
    }

    setValue('');
    setIsAdding(false);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    storage.deleteVital(id);
    onUpdate();
  };

  const chartData = vitals
    .filter(v => v.type === type)
    .slice(0, 7)
    .reverse()
    .map(v => ({
      time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(v.value.split('/')[0]) // Handle BP by taking systolic
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-natural-olive">Vital Signs</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-natural-olive text-white rounded-full flex items-center justify-center shadow-lg shadow-natural-olive/20 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Chart Section */}
      {chartData.length > 1 && (
        <div className="bg-natural-card p-6 rounded-[32px] border border-natural-soft shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-natural-olive font-serif text-lg">
            <TrendingUp className="w-5 h-5" />
            <h3>{type.replace('_', ' ').toUpperCase()} Trend</h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e2d5" />
                <XAxis 
                  dataKey="time" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#7a7a7a' }}
                />
                <YAxis 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#7a7a7a' }}
                  width={30}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#5A5A40" 
                  strokeWidth={3} 
                  dot={{ fill: '#5A5A40', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {vitals.map(vital => (
          <div key={vital.id} className="bg-natural-card p-4 rounded-2xl border border-natural-soft flex items-center gap-4 shadow-sm group">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              vital.type === 'heart_rate' ? "bg-natural-soft/30 text-natural-terracotta" :
              vital.type === 'blood_pressure' ? "bg-natural-soft/30 text-natural-olive" :
              vital.type === 'temperature' ? "bg-natural-soft/30 text-natural-terracotta" :
              "bg-natural-soft/30 text-natural-olive"
            )}>
              {vital.type === 'heart_rate' ? <Heart className="w-5 h-5" /> :
               vital.type === 'blood_pressure' ? <Activity className="w-5 h-5" /> :
               vital.type === 'temperature' ? <Thermometer className="w-5 h-5" /> :
               <Droplets className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-natural-ink capitalize">{vital.type.replace('_', ' ')}</h4>
              <p className="text-xs text-natural-muted">{new Date(vital.timestamp).toLocaleString()}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <span className="text-xl font-serif text-natural-olive">{vital.value}</span>
                <span className="text-xs text-natural-muted ml-1">{vital.unit}</span>
              </div>
              <button 
                onClick={() => handleDelete(vital.id)}
                className="p-2 text-natural-soft hover:text-natural-terracotta transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {vitals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-natural-soft/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-natural-soft" />
            </div>
            <p className="text-natural-muted italic">No vitals recorded yet</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-natural-ink/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-natural-card w-full max-w-md rounded-t-[40px] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-natural-olive">Log Vital</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-natural-soft rounded-full">
                <X className="w-5 h-5 text-natural-muted" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <TypeButton active={type === 'heart_rate'} onClick={() => setType('heart_rate')} icon={<Heart />} label="Heart" />
                <TypeButton active={type === 'blood_pressure'} onClick={() => setType('blood_pressure')} icon={<Activity />} label="BP" />
                <TypeButton active={type === 'temperature'} onClick={() => setType('temperature')} icon={<Thermometer />} label="Temp" />
                <TypeButton active={type === 'oxygen'} onClick={() => setType('oxygen')} icon={<Droplets />} label="Oxygen" />
                <TypeButton active={type === 'weight'} onClick={() => setType('weight')} icon={<Scale />} label="Weight" />
              </div>

              <div>
                <label className="block text-sm font-medium text-natural-muted mb-2 uppercase tracking-widest">Value</label>
                <input 
                  type="text" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={type === 'blood_pressure' ? "120/80" : "Enter value"}
                  className="w-full px-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all font-serif text-lg"
                  autoFocus
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-natural-olive text-white font-bold rounded-2xl shadow-lg shadow-natural-olive/20 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                Save Record
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function TypeButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
        active ? "bg-natural-soft border-natural-olive text-natural-olive" : "bg-natural-bg border-natural-soft text-natural-muted"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
