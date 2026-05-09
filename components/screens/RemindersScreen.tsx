import React from 'react';
import { Bell, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Image from 'next/image';

export function RemindersScreen() {
  const reminders = [
    { title: 'Kaisi Teri Khudgharzi', time: 'Tonight, 8:00 PM', channel: 'ARY Digital', alert: 'In 2 hours', image: 'https://picsum.photos/seed/kaisi/200/200' },
    { title: 'Mannat Murad', time: 'Tomorrow, 7:00 PM', channel: 'HUM TV', alert: '1 day left', image: 'https://picsum.photos/seed/mannat/200/200' },
    { title: 'Tere Bin', time: 'Wed, 8:00 PM', channel: 'Geo TV', alert: '2 days left', image: 'https://picsum.photos/seed/terebin/200/200' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Reminders</h1>
        <p className="text-gray-500 text-sm">Don't miss an episode.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {reminders.map((item, i) => (
            <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-gray-50 transition-colors">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    {item.time}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                    {item.channel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold border border-orange-100">
                    <Clock className="w-3.5 h-3.5" />
                    {item.alert}
                  </span>
                </div>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                  <Bell className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>No reminders set</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
