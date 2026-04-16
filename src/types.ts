export interface User {
  id: string;
  email: string;
  password?: string; // Only for local storage simulation
  name: string;
}

export interface AppNotification {
  id: string;
  timestamp: number;
  title: string;
  message: string;
  type: 'reminder' | 'vital_alert' | 'system';
  read: boolean;
}

export interface VitalRecord {
  id: string;
  timestamp: number;
  type: 'heart_rate' | 'blood_pressure' | 'temperature' | 'oxygen' | 'weight';
  value: string; // e.g., "120/80" or "72" or "98.6"
  unit: string;
}

export interface SymptomRecord {
  id: string;
  timestamp: number;
  severity: 1 | 2 | 3 | 4 | 5;
  symptom: string;
  notes: string;
}

export interface Reminder {
  id: string;
  type: 'medication' | 'appointment';
  title: string;
  time: string; // HH:mm
  days: number[]; // 0-6 (Sun-Sat)
  active: boolean;
}

export type View = 'dashboard' | 'vitals' | 'symptoms' | 'reminders';
