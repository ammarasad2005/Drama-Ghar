import React from 'react';
import { ChevronDown, LayoutGrid, List, Bell, Bookmark } from 'lucide-react';
import Image from 'next/image';

export function WatchlistScreen() {
  const watchlist = [
    { title: 'Kaisi Teri Khudgharzi', channel: 'ARY Digital', schedule: 'Mon & Tue • 8:00 PM', image: 'https://picsum.photos/seed/kaisi2/300/200' },
    { title: 'Jaan Nisar', channel: 'Geo TV', schedule: 'Wed & Thu • 9:00 PM', image: 'https://picsum.photos/seed/jaan2/300/200' },
    { title: 'Mannat Murad', channel: 'HUM TV', schedule: 'Everyday • 7:00 PM', image: 'https://picsum.photos/seed/mannat2/300/200' },
    { title: 'Meem Se Mohabbat', channel: 'HUM TV', schedule: 'Mon & Tue • 8:00 PM', image: 'https://picsum.photos/seed/meem/300/200' },
    { title: 'Mere Humsafar', channel: 'ARY Digital', schedule: 'Sat & Sun • 10:00 PM', image: 'https://picsum.photos/seed/mere2/300/200' },
    { title: 'Tere Bin', channel: 'Geo TV', schedule: 'Wed & Thu • 8:00 PM', image: 'https://picsum.photos/seed/terebin/300/200' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Watchlist</h1>
        <p className="text-gray-500 text-sm">All your favorite dramas in one place.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-8 mb-4 sm:mb-0">
          <button className="text-sm font-semibold text-emerald-700 border-b-2 border-emerald-700 pb-4 -mb-[17px]">
            Watchlist (6)
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-4 -mb-[17px]">
            Completed (3)
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Sort by
            <button className="flex items-center gap-2 font-medium text-gray-900 ml-1">
              Recently Added
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center bg-gray-100 p-1 rounded-lg ml-2">
            <button className="p-1.5 bg-white text-emerald-700 rounded shadow-sm">
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded transition-colors">
                <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {watchlist.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-700 hover:text-emerald-700 shadow-sm z-10 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{item.title}</h3>
              <p className="text-xs text-gray-500 font-medium mb-1">{item.channel}</p>
              <p className="text-xs text-gray-400 mb-5">{item.schedule}</p>
              
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
                <Bell className="w-4 h-4" />
                Set Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
