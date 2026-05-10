'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Calendar as CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ReminderItem {
  _id: string;
  slug: string;
  title: string;
  time: string;
  channel: string;
  image: string;
}

interface RemindersScreenProps {
  onNavigate: (tab: string) => void;
}

export function RemindersScreen({ onNavigate }: RemindersScreenProps) {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      if (res.ok) {
        setReminders(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReminders();
  }, []);

  const removeReminder = async (slug: string) => {
    try {
      const res = await fetch(`/api/reminders?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setReminders(reminders.filter(r => r.slug !== slug));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Reminders</h1>
        <p className="text-gray-500 text-sm">Don&apos;t miss an episode.</p>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Bell className="w-12 h-12 mb-4 opacity-20" />
          <p>You have no reminders set.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {reminders.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 p-4 lg:p-6 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group relative">
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-neutral-800 shadow-sm">
                  <Image src={item.image || '/icon.png'} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg">{item.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-500 font-semibold">
                      <CalendarIcon className="w-4 h-4" />
                      {item.time}
                    </div>
                    <div className="hidden sm:block text-gray-400">•</div>
                    <div className="text-gray-600 dark:text-slate-400 font-medium">{item.channel}</div>
                  </div>
                </div>
                <button 
                  onClick={() => removeReminder(item.slug)}
                  className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 lg:p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
