import React from 'react';
import { motion } from 'motion/react';
import { X, Bell, CheckCircle2, AlertCircle, Trash2, Clock } from 'lucide-react';
import { AppNotification } from '../types';
import { storage } from '../lib/storage';
import { cn } from '../lib/utils';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function NotificationCenter({ notifications, onClose, onUpdate }: NotificationCenterProps) {
  const handleMarkAllRead = () => {
    storage.markAllAsRead();
    onUpdate();
  };

  const handleClear = () => {
    storage.clearNotifications();
    onUpdate();
  };

  const handleRead = (id: string) => {
    storage.markNotificationAsRead(id);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-natural-ink/40 backdrop-blur-sm p-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-natural-card w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
      >
        <div className="p-6 border-b border-natural-soft flex items-center justify-between bg-natural-card sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-natural-olive" />
            <h3 className="text-xl font-serif text-natural-olive">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-natural-soft rounded-full">
            <X className="w-5 h-5 text-natural-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => handleRead(notification.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer relative",
                  notification.read 
                    ? "bg-natural-bg/50 border-natural-soft opacity-70" 
                    : "bg-white border-natural-olive shadow-sm"
                )}
              >
                {!notification.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-natural-terracotta rounded-full"></span>
                )}
                <div className="flex gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    notification.type === 'reminder' ? "bg-natural-soft/50 text-natural-olive" :
                    notification.type === 'vital_alert' ? "bg-natural-terracotta/10 text-natural-terracotta" :
                    "bg-natural-soft text-natural-muted"
                  )}>
                    {notification.type === 'reminder' ? <Clock className="w-5 h-5" /> :
                     notification.type === 'vital_alert' ? <AlertCircle className="w-5 h-5" /> :
                     <Bell className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-natural-ink">{notification.title}</h4>
                    <p className="text-xs text-natural-muted leading-relaxed">{notification.message}</p>
                    <p className="text-[10px] text-natural-soft font-medium uppercase tracking-wider">
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-natural-soft/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-natural-soft" />
              </div>
              <p className="text-natural-muted italic">All caught up!</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 bg-natural-bg border-t border-natural-soft flex gap-3">
            <button 
              onClick={handleMarkAllRead}
              className="flex-1 py-3 bg-white border border-natural-soft text-natural-olive text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-natural-soft/20 transition-colors"
            >
              Mark all as read
            </button>
            <button 
              onClick={handleClear}
              className="p-3 bg-white border border-natural-soft text-natural-terracotta rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
