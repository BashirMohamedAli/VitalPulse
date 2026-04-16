import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { storage } from '../lib/storage';
import { User } from '../types';
import { cn } from '../lib/utils';

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const users = storage.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        storage.setCurrentUser(user);
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!email || !password || !name) {
        setError('All fields are required');
        return;
      }
      const users = storage.getUsers();
      if (users.some(u => u.email === email)) {
        setError('Email already exists');
        return;
      }
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password,
        name
      };
      storage.saveUser(newUser);
      storage.setCurrentUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-natural-olive rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-natural-olive/20">
            <Activity className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif text-natural-olive italic">VitalPulse</h1>
          <p className="text-natural-muted">Your personal health companion</p>
        </div>

        <div className="bg-natural-card p-8 rounded-[40px] border border-natural-soft shadow-xl space-y-6">
          <div className="flex gap-4 p-1 bg-natural-bg rounded-2xl border border-natural-soft">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                isLogin ? "bg-natural-card text-natural-olive shadow-sm" : "text-natural-muted"
              )}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                !isLogin ? "bg-natural-card text-natural-olive shadow-sm" : "text-natural-muted"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-natural-muted uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-natural-soft" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-natural-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-natural-soft" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-natural-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-natural-soft" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-natural-bg border border-natural-soft rounded-2xl focus:ring-2 focus:ring-natural-olive outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-natural-terracotta text-xs font-medium text-center italic">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-natural-olive text-white font-bold rounded-2xl shadow-lg shadow-natural-olive/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
