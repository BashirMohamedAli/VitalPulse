import React from 'react';
import { VitalRecord, SymptomRecord, Reminder } from '../types';
import { storage } from '../lib/storage';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  Scale,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  vitals: VitalRecord[];
  symptoms: SymptomRecord[];
  reminders: Reminder[];
}

export default function Dashboard({ vitals, symptoms, reminders }: DashboardProps) {
  const user = storage.getCurrentUser();
  const latestVitals = {
    heart_rate: vitals.find(v => v.type === 'heart_rate'),
    blood_pressure: vitals.find(v => v.type === 'blood_pressure'),
    temperature: vitals.find(v => v.type === 'temperature'),
    oxygen: vitals.find(v => v.type === 'oxygen'),
  };

  const upcomingReminders = reminders
    .filter(r => r.active)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-serif text-natural-olive">Hello, {user?.name || 'there'}!</h2>
        <span className="inline-block bg-natural-soft text-natural-olive px-3 py-1 rounded-full text-[10px] uppercase tracking-widest mt-2">
          Local Storage Active
        </span>
      </section>

      {/* Vitals Grid */}
      <section className="grid grid-cols-2 gap-4">
        <VitalCard 
          icon={<Heart className="text-natural-terracotta" />}
          label="Heart Rate"
          value={latestVitals.heart_rate?.value || '--'}
          unit="bpm"
          color="bg-natural-soft/30"
        />
        <VitalCard 
          icon={<Activity className="text-natural-olive" />}
          label="Blood Pressure"
          value={latestVitals.blood_pressure?.value || '--'}
          unit="mmHg"
          color="bg-natural-soft/30"
        />
        <VitalCard 
          icon={<Thermometer className="text-natural-terracotta" />}
          label="Temperature"
          value={latestVitals.temperature?.value || '--'}
          unit="°F"
          color="bg-natural-soft/30"
        />
        <VitalCard 
          icon={<Droplets className="text-natural-olive" />}
          label="Oxygen"
          value={latestVitals.oxygen?.value || '--'}
          unit="%"
          color="bg-natural-soft/30"
        />
      </section>

      {/* Upcoming Reminders */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif text-natural-olive">Upcoming</h3>
          <button className="text-natural-olive text-sm font-medium flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {upcomingReminders.length > 0 ? (
            upcomingReminders.map(reminder => (
              <div key={reminder.id} className="bg-natural-card p-4 rounded-2xl border border-natural-soft flex items-center gap-4 shadow-sm border-l-4 border-l-natural-terracotta">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  reminder.type === 'medication' ? "bg-natural-soft/50 text-natural-terracotta" : "bg-natural-soft/50 text-natural-olive"
                )}>
                  {reminder.type === 'medication' ? <Clock className="w-6 h-6" /> : <CalendarIcon className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-natural-ink">{reminder.title}</h4>
                  <p className="text-sm text-natural-muted">{reminder.time}</p>
                </div>
                <div className="text-natural-soft">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-natural-soft/20 border border-dashed border-natural-soft rounded-2xl p-8 text-center">
              <p className="text-natural-muted text-sm italic">No upcoming reminders</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Symptoms */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif text-natural-olive">Recent Symptoms</h3>
        <div className="bg-natural-card rounded-2xl border border-natural-soft divide-y divide-natural-soft overflow-hidden shadow-sm">
          {symptoms.slice(0, 3).map(symptom => (
            <div key={symptom.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-natural-ink">{symptom.symptom}</h4>
                <p className="text-xs text-natural-muted">{new Date(symptom.timestamp).toLocaleDateString()}</p>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                symptom.severity >= 4 ? "bg-natural-terracotta/10 text-natural-terracotta" : 
                symptom.severity >= 3 ? "bg-natural-olive/10 text-natural-olive" : 
                "bg-natural-soft text-natural-muted"
              )}>
                Level {symptom.severity}
              </div>
            </div>
          ))}
          {symptoms.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-natural-muted text-sm italic">No symptoms logged yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function VitalCard({ icon, label, value, unit, color }: { icon: React.ReactNode, label: string, value: string, unit: string, color: string }) {
  return (
    <div className="bg-natural-card p-5 rounded-[24px] border border-natural-soft shadow-sm space-y-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-serif text-natural-olive">{value}</span>
          <span className="text-xs text-natural-muted font-sans">{unit}</span>
        </div>
      </div>
    </div>
  );
}
