import React from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';

export function HistoryScreen() {
  const history = [
    { title: 'Jaan Nisar', ep: 'Episode 2', date: 'Today', progress: 100, image: 'https://picsum.photos/seed/jaan/200/120' },
    { title: 'Mere Humsafar', ep: 'Episode 18', date: 'Yesterday', progress: 100, image: 'https://picsum.photos/seed/mere/200/120' },
    { title: 'Mannat Murad', ep: 'Episode 7', date: '20 May 2024', progress: 100, image: 'https://picsum.photos/seed/mannat/200/120' },
    { title: 'Kaisi Teri Khudgharzi', ep: 'Episode 11', date: '19 May 2024', progress: 100, image: 'https://picsum.photos/seed/kaisi/200/120' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Watch History</h1>
          <p className="text-gray-500 text-sm">What you&apos;ve watched recently.</p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent w-64"
          />
        </div>
      </div>

      <div className="space-y-6">
        {history.map((item, i) => (
          <div key={i} className="flex gap-6 group hover:bg-white rounded-xl p-3 -mx-3 transition-colors border border-transparent hover:border-gray-100 hover:shadow-sm">
             <div className="relative w-40 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
               <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                 <div className="h-full bg-emerald-700" style={{ width: `${item.progress}%` }}></div>
               </div>
             </div>
             
             <div className="flex-1 py-1 flex flex-col justify-center">
               <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                 <span className="text-xs font-medium text-gray-400">{item.date}</span>
               </div>
               <p className="text-sm text-gray-500">{item.ep}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
