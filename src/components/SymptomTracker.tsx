import React, { useState } from 'react';
import { SymptomRecord } from '../types';
import { storage } from '../lib/storage';
import { 
  Plus, 
  Trash2, 
  Stethoscope,
  X,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SymptomTrackerProps {
  symptoms: SymptomRecord[];
  onUpdate: () => void;
}

export default function SymptomTracker({ symptoms, onUpdate }: SymptomTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom) return;

    storage.saveSymptom({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      symptom,
      severity,
      notes
    });

    setSymptom('');
    setSeverity(3);
    setNotes('');
    setIsAdding(false);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    storage.deleteSymptom(id);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-natural-olive">Symptoms</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-natural-olive text-white rounded-full flex items-center justify-center shadow-lg shadow-natural-olive/20 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {symptoms.map(item => (
          <div key={item.id} className="bg-natural-card p-5 rounded-3xl border border-natural-soft shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  item.severity >= 4 ? "bg-natural-terracotta/10 text-natural-terracotta" : 
                  item.severity >= 3 ? "bg-natural-olive/10 text-natural-olive" : 
                  "bg-natural-soft text-natural-muted"
                )}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-natural-ink">{item.symptom}</h4>
                  <p className="text-xs text-natural-muted">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                item.severity >= 4 ? "bg-natural-terracotta/10 text-natural-terracotta" : 
                item.severity >= 3 ? "bg-natural-olive/10 text-natural-olive" : 
                "bg-natural-soft text-natural-muted"
              )}>
                Severity {item.severity}
              </div>
            </div>
            
            {item.notes && (
              <div className="bg-natural-bg p-3 rounded-2xl flex gap-2 border border-natural-soft">
                <MessageSquare className="w-4 h-4 text-natural-muted shrink-0 mt-0.5" />
                <p className="text-sm text-natural-muted italic">{item.notes}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-natural-soft hover:text-natural-terracotta transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {symptoms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-natural-soft/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-natural-soft" />
            </div>
            <p className="text-natural-muted italic">No symptoms logged yet</p>
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
              <h3 className="text-2xl font-serif text-natural-olive">Log Symptom</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-natural-soft rounded-full">
                <X className="w-5 h-5 text-natural-muted" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-natural-muted mb-2 uppercase tracking-widest">What are you feeling?</label>
                <input 
                  type="text" 
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="e.g., Headache, Fatigue"
                  className="w-full px-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all font-serif text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natural-muted mb-2 uppercase tracking-widest">Severity (1-5)</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSeverity(val as any)}
                      className={cn(
                        "flex-1 py-3 rounded-2xl font-bold transition-all",
                        severity === val 
                          ? "bg-natural-olive text-white shadow-lg shadow-natural-olive/20" 
                          : "bg-natural-bg text-natural-muted border border-natural-soft"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-natural-muted mb-2 uppercase tracking-widest">Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe how you feel..."
                  className="w-full px-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all h-24 resize-none italic"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-natural-olive text-white font-bold rounded-2xl shadow-lg shadow-natural-olive/20 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                Save Symptom
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
