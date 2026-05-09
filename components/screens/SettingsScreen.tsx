import React from 'react';
import { User, Bell, Shield, Moon, MonitorPlay, ChevronRight } from 'lucide-react';

export function SettingsScreen() {
  const settingsRows = [
    { icon: User, label: 'Profile Settings', desc: 'Update your personal information' },
    { icon: Bell, label: 'Notifications', desc: 'Manage your alerts and reminders' },
    { icon: MonitorPlay, label: 'Playback & Quality', desc: 'Default streaming, auto-play next' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, sessions, data usage' },
    { icon: Moon, label: 'Appearance', desc: 'Dark mode, theme preferences', isLast: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl font-medium shadow-inner">
                  A
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Ayesha</h2>
                  <p className="text-sm text-gray-500">ayesha@example.com</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {settingsRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <button key={i} className="w-full flex items-center p-6 hover:bg-gray-50 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{row.label}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{row.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
          
          <button className="text-red-600 text-sm font-semibold hover:text-red-700 px-2 py-1 transition-colors">
            Log out of all devices
          </button>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-700 rotate-3">
              <span className="font-serif font-bold text-2xl">D</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">DramaGhar Premium</h3>
            <p className="text-sm text-gray-600 mb-4 px-2 tracking-tight">Ad-free streaming, 4K quality, and early access to new episodes.</p>
            <button className="w-full py-2.5 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 shadow-sm transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
