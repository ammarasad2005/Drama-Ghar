import React from 'react';
import { Play, MoreVertical } from 'lucide-react';
import Image from 'next/image';

export function ContinueWatchingScreen() {
  const content = [
    { title: 'Kaisi Teri Khudgharzi', ep: 'Ep 12', timeLeft: '25 min left', progress: 66, image: 'https://picsum.photos/seed/kaisi/400/250' },
    { title: 'Mannat Murad', ep: 'Ep 8', timeLeft: '10 min left', progress: 85, image: 'https://picsum.photos/seed/mannat/400/250' },
    { title: 'Jaan Nisar', ep: 'Ep 3', timeLeft: '35 min left', progress: 30, image: 'https://picsum.photos/seed/jaan/400/250' },
    { title: 'Tere Bin', ep: 'Ep 22', timeLeft: '5 min left', progress: 90, image: 'https://picsum.photos/seed/terebin/400/250' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Continue Watching</h1>
        <p className="text-gray-500 text-sm">Pick up right where you left off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex h-40 group cursor-pointer">
            <div className="w-40 relative flex-shrink-0 bg-gray-100">
              <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-emerald-700 pl-1">
                  <Play className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
                <button className="text-gray-400 hover:text-gray-600 shrink-0 ml-2">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-medium text-emerald-700 mb-auto">{item.ep}</p>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-gray-700">{item.timeLeft}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
