'use client';
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, CircleHelp, CreditCard, ChevronRight, Moon, LogOut, Loader2, Check, X } from 'lucide-react';

interface SettingsScreenProps {
  user: any;
  onNavigate: (tab: string) => void;
}

export function SettingsScreen({ user, onNavigate }: SettingsScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setIsEditing(false);
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const settingsRows = [
    { label: 'Notifications', icon: Bell, desc: 'Manage your alerts and reminders', target: 'reminders' },
    { label: 'Watch History', icon: Shield, desc: 'Manage your history and privacy', target: 'history' },
    { label: 'Help & Support', icon: CircleHelp, desc: 'Get assistance and FAQs', target: 'about' },
  ];

  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const getInitial = () => userName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 bg-[#F9FAFB] dark:bg-[#050505]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xl lg:text-2xl font-medium shadow-inner shrink-0">
                  {getInitial()}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full max-w-sm">
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0"
                        autoFocus
                      />
                      <button 
                        onClick={handleUpdateName}
                        disabled={isUpdating}
                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 shrink-0"
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => { setIsEditing(false); setNewName(userName); }}
                        className="p-2 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{userName}</h2>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </>
                  )}
                </div>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {settingsRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <button 
                    key={i} 
                    onClick={() => row.target && onNavigate(row.target)}
                    className="w-full flex items-center p-4 lg:p-6 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">{row.label}</h4>
                      <p className="text-xs text-gray-500">{row.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-700 transition-colors shrink-0" />
                  </button>
                );
              })}
              
              <button 
                onClick={toggleDarkMode}
                className="w-full flex items-center p-4 lg:p-6 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">Dark Mode</h4>
                  <p className="text-xs text-gray-500">{isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0 ${isDarkMode ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-neutral-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-max">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">DramaGhar Pro</h3>
              <p className="text-emerald-100/70 text-sm mb-6 leading-relaxed">Unlock ad-free experience, early access to new episodes, and personalized recommendations.</p>
              <button className="w-full bg-[#D4AF37] text-gray-900 font-bold py-2.5 rounded-lg text-sm hover:bg-[#CBA358] transition-colors shadow-sm active:scale-95 text-center">
                Go Pro Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
