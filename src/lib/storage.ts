import { VitalRecord, SymptomRecord, Reminder, User, AppNotification } from '../types';

const KEYS = {
  VITALS: 'vitalpulse_vitals',
  SYMPTOMS: 'vitalpulse_symptoms',
  REMINDERS: 'vitalpulse_reminders',
  USERS: 'vitalpulse_users',
  CURRENT_USER: 'vitalpulse_current_user',
  NOTIFICATIONS: 'vitalpulse_notifications',
};

export const storage = {
  // User Management
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    localStorage.setItem(KEYS.USERS, JSON.stringify([...users, user]));
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  // Notifications
  getNotifications: (): AppNotification[] => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveNotification: (notification: AppNotification) => {
    const notifications = storage.getNotifications();
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([notification, ...notifications]));
  },
  markNotificationAsRead: (id: string) => {
    const notifications = storage.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  markAllAsRead: () => {
    const notifications = storage.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  clearNotifications: () => {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
  },

  getVitals: (): VitalRecord[] => {
    const data = localStorage.getItem(KEYS.VITALS);
    return data ? JSON.parse(data) : [];
  },
  saveVital: (record: VitalRecord) => {
    const vitals = storage.getVitals();
    localStorage.setItem(KEYS.VITALS, JSON.stringify([record, ...vitals]));
  },
  deleteVital: (id: string) => {
    const vitals = storage.getVitals().filter(v => v.id !== id);
    localStorage.setItem(KEYS.VITALS, JSON.stringify(vitals));
  },

  getSymptoms: (): SymptomRecord[] => {
    const data = localStorage.getItem(KEYS.SYMPTOMS);
    return data ? JSON.parse(data) : [];
  },
  saveSymptom: (record: SymptomRecord) => {
    const symptoms = storage.getSymptoms();
    localStorage.setItem(KEYS.SYMPTOMS, JSON.stringify([record, ...symptoms]));
  },
  deleteSymptom: (id: string) => {
    const symptoms = storage.getSymptoms().filter(s => s.id !== id);
    localStorage.setItem(KEYS.SYMPTOMS, JSON.stringify(symptoms));
  },

  getReminders: (): Reminder[] => {
    const data = localStorage.getItem(KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  },
  saveReminder: (reminder: Reminder) => {
    const reminders = storage.getReminders();
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify([reminder, ...reminders]));
  },
  updateReminder: (reminder: Reminder) => {
    const reminders = storage.getReminders().map(r => r.id === reminder.id ? reminder : r);
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },
  deleteReminder: (id: string) => {
    const reminders = storage.getReminders().filter(r => r.id !== id);
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },
};
