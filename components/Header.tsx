import React from 'react';
import { Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-transparent">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search dramas, channels, or actors..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-emerald-100 rounded-lg text-sm transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-medium">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Ayesha</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
