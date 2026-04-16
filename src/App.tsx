import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Bell, 
  LayoutDashboard, 
  Stethoscope,
  Calendar
} from 'lucide-react';
import { storage } from './lib/storage';
import { VitalRecord, SymptomRecord, Reminder, View, User, AppNotification } from './types';
import { cn } from './lib/utils';

// Sub-components
import Dashboard from './components/Dashboard';
import VitalTracker from './components/VitalTracker';
import SymptomTracker from './components/SymptomTracker';
import Reminders from './components/Reminders';
import Auth from './components/Auth';
import NotificationCenter from './components/NotificationCenter';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      refreshData();
    }
  }, []);

  // Background check for reminders
  useEffect(() => {
    if (!user) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay();

      const activeReminders = storage.getReminders().filter(r => r.active && r.time === currentTime && r.days.includes(currentDay));
      
      activeReminders.forEach(reminder => {
        // Prevent duplicate notifications for the same minute
        const existing = storage.getNotifications().find(n => 
          n.title === reminder.title && 
          new Date(n.timestamp).getMinutes() === now.getMinutes() &&
          new Date(n.timestamp).getHours() === now.getHours()
        );

        if (!existing) {
          storage.saveNotification({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            title: reminder.title,
            message: `Time for your ${reminder.type}: ${reminder.title}`,
            type: 'reminder',
            read: false
          });
          refreshData();
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const refreshData = () => {
    setVitals(storage.getVitals());
    setSymptoms(storage.getSymptoms());
    setReminders(storage.getReminders());
    setNotifications(storage.getNotifications());
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={(u) => { setUser(u); refreshData(); }} />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard vitals={vitals} symptoms={symptoms} reminders={reminders} />;
      case 'vitals':
        return <VitalTracker vitals={vitals} onUpdate={refreshData} />;
      case 'symptoms':
        return <SymptomTracker symptoms={symptoms} onUpdate={refreshData} />;
      case 'reminders':
        return <Reminders reminders={reminders} onUpdate={refreshData} />;
      default:
        return <Dashboard vitals={vitals} symptoms={symptoms} reminders={reminders} />;
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-ink font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-natural-card/80 backdrop-blur-md border-b border-natural-soft px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-natural-olive rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-serif italic font-semibold tracking-tight text-natural-olive">VitalPulse</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-natural-ink">{user.name}</p>
            <button 
              onClick={handleLogout}
              className="text-[10px] text-natural-terracotta uppercase tracking-widest font-bold hover:underline"
            >
              Logout
            </button>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-natural-muted hover:bg-natural-soft/50 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-natural-terracotta text-white text-[10px] font-bold rounded-full border-2 border-natural-card flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notification Center Overlay */}
      {showNotifications && (
        <NotificationCenter 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)} 
          onUpdate={refreshData}
        />
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-natural-card border-t border-natural-soft px-6 py-3 flex items-center justify-between max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.02)] rounded-t-[32px]">
        <NavButton 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')}
          icon={<LayoutDashboard className="w-6 h-6" />}
          label="Home"
        />
        <NavButton 
          active={currentView === 'vitals'} 
          onClick={() => setCurrentView('vitals')}
          icon={<Activity className="w-6 h-6" />}
          label="Vitals"
        />
        <NavButton 
          active={currentView === 'symptoms'} 
          onClick={() => setCurrentView('symptoms')}
          icon={<Stethoscope className="w-6 h-6" />}
          label="Symptoms"
        />
        <NavButton 
          active={currentView === 'reminders'} 
          onClick={() => setCurrentView('reminders')}
          icon={<Calendar className="w-6 h-6" />}
          label="Reminders"
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-200",
        active ? "text-natural-olive scale-110 font-bold" : "text-natural-muted hover:text-natural-olive"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}
