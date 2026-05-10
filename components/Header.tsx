import React, { useState } from 'react';
import { Search, Bell, LogOut, Settings, User as UserIcon, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  user: any;
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
  onMenuClick?: () => void;
}

export function Header({ user, onNavigate, onLogout, onMenuClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('explore', { search: searchQuery });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-neutral-900">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <form onSubmit={handleSearch} className="relative w-48 lg:w-96 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dramas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-neutral-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-emerald-200 dark:focus:border-emerald-900 focus:ring-2 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 rounded-lg text-sm transition-all outline-none text-gray-900 dark:text-white"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={() => onNavigate('reminders')}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-medium shadow-sm">
              {getInitials(userName)}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">{userName}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-800 py-2 z-20 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-50 dark:border-neutral-800 mb-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Account</p>
                </div>
                <button 
                  onClick={() => { onNavigate('settings'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  <UserIcon className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={() => { onNavigate('settings'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1"></div>
                <button 
                  onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
