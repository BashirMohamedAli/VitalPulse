import React, { useState } from 'react';
import { Reminder } from '../types';
import { storage } from '../lib/storage';
import { 
  Plus, 
  Trash2, 
  Clock,
  Calendar as CalendarIcon,
  X,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface RemindersProps {
  reminders: Reminder[];
  onUpdate: () => void;
}

export default function Reminders({ reminders, onUpdate }: RemindersProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<'medication' | 'appointment'>('medication');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    storage.saveReminder({
      id: crypto.randomUUID(),
      type,
      title,
      time,
      days: [0, 1, 2, 3, 4, 5, 6],
      active: true
    });

    setTitle('');
    setTime('08:00');
    setIsAdding(false);
    onUpdate();
  };

  const toggleActive = (reminder: Reminder) => {
    storage.updateReminder({ ...reminder, active: !reminder.active });
    onUpdate();
  };

  const handleDelete = (id: string) => {
    storage.deleteReminder(id);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-natural-olive">Reminders</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-natural-olive text-white rounded-full flex items-center justify-center shadow-lg shadow-natural-olive/20 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {reminders.map(reminder => (
          <div 
            key={reminder.id} 
            className={cn(
              "bg-natural-card p-5 rounded-3xl border transition-all duration-300 flex items-center gap-4 shadow-sm",
              reminder.active 
                ? cn("border-natural-soft border-l-4", reminder.type === 'medication' ? "border-l-natural-terracotta" : "border-l-natural-olive") 
                : "border-natural-soft opacity-60"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              reminder.type === 'medication' ? "bg-natural-soft/50 text-natural-terracotta" : "bg-natural-soft/50 text-natural-olive"
            )}>
              {reminder.type === 'medication' ? <Clock className="w-6 h-6" /> : <CalendarIcon className="w-6 h-6" />}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-natural-ink">{reminder.title}</h4>
              <div className="flex items-center gap-2 text-natural-muted text-sm">
                <Bell className="w-3.5 h-3.5" />
                <span>{reminder.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleActive(reminder)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  reminder.active ? "bg-natural-olive" : "bg-natural-soft"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  reminder.active ? "right-1" : "left-1"
                )} />
              </button>
              <button 
                onClick={() => handleDelete(reminder.id)}
                className="p-2 text-natural-soft hover:text-natural-terracotta transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {reminders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-natural-soft/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-natural-soft" />
            </div>
            <p className="text-natural-muted italic">No reminders set yet</p>
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
              <h3 className="text-2xl font-serif text-natural-olive">New Reminder</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-natural-soft rounded-full">
                <X className="w-5 h-5 text-natural-muted" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType('medication')}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    type === 'medication' 
                      ? "bg-natural-terracotta text-white shadow-lg shadow-natural-terracotta/20" 
                      : "bg-natural-bg text-natural-muted border border-natural-soft"
                  )}
                >
                  <Clock className="w-4 h-4" /> Medication
                </button>
                <button
                  type="button"
                  onClick={() => setType('appointment')}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    type === 'appointment' 
                      ? "bg-natural-olive text-white shadow-lg shadow-natural-olive/20" 
                      : "bg-natural-bg text-natural-muted border border-natural-soft"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" /> Appointment
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-natural-muted mb-2 uppercase tracking-widest">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'medication' ? "e.g., Lisinopril 10mg" : "e.g., Dr. Aris Thorne"}
                  className="w-full px-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all font-serif text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natural-muted mb-2 uppercase tracking-widest">Time</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all font-serif text-lg"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-natural-olive text-white font-bold rounded-2xl shadow-lg shadow-natural-olive/20 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                Create Reminder
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
