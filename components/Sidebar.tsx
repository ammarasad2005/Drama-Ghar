import React from 'react';
import { Home, Calendar, MonitorPlay, Bookmark, PlayCircle, Bell, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const mainNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'channels', label: 'Channels', icon: MonitorPlay },
    { id: 'watchlist', label: 'My Watchlist', icon: Bookmark },
  ];

  const secondaryNav = [
    { id: 'continue', label: 'Continue Watching', icon: PlayCircle },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderNavItems = (items: typeof mainNav) => (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <li key={item.id}>
            <button
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-r-full text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-700 text-white' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              } ${isActive ? 'mr-4 w-[calc(100%-1rem)]' : ''}`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#082F22] text-white flex flex-col z-20">
      <div className="p-6 pt-8 pb-8 flex items-center gap-2">
        <div className="font-serif text-2xl tracking-wide">
          <span className="text-white">Drama</span>
          <span className="text-[#CBA358]">Ghar</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="mb-6">
          {renderNavItems(mainNav)}
        </div>
        <div>
          {renderNavItems(secondaryNav)}
        </div>
      </nav>

      <div className="mt-auto relative w-full h-48 overflow-hidden flex-shrink-0">
        <svg 
          viewBox="0 0 200 150" 
          className="absolute bottom-0 w-full text-[#CBA358] opacity-30 stroke-current fill-transparent"
          strokeWidth="1"
        >
          <path d="M10,150 L10,80 C10,40 50,20 100,20 C150,20 190,40 190,80 L190,150 Z" strokeDasharray="3 3"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-[#CBA358] font-serif text-sm tracking-widest opacity-80" dir="rtl">کہانیوں سے</span>
          <span className="text-[#CBA358] font-serif text-sm tracking-widest opacity-80 mt-1" dir="rtl">رشتے بنتے ہیں</span>
        </div>
      </div>
    </aside>
  );
}
