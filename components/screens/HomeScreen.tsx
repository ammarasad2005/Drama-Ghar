import React from 'react';
import { Bookmark, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export function HomeScreen() {
  const todaysPicks = [
    { title: 'Mannat Murad', channel: 'HUM TV', time: '7:00 PM', image: 'https://picsum.photos/seed/mannat/100/100' },
    { title: 'Jaan Nisar', channel: 'Geo TV', time: '9:00 PM', image: 'https://picsum.photos/seed/jaan/100/100' },
    { title: 'Mere Humsafar', channel: 'ARY Digital', time: '10:00 PM', image: 'https://picsum.photos/seed/mere/100/100' },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-12">
      {/* Top Banner Section */}
      <div className="relative pt-6 px-8 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] to-[#F3EDE0] -z-10" />
        {/* Subtle background decoration */}
        <svg className="absolute right-0 top-0 h-48 opacity-20 text-[#D4AF37]" viewBox="0 0 200 200" fill="currentColor">
           <path d="M100,0 C150,0 200,50 200,100 L200,200 L0,200 L0,100 C0,50 50,0 100,0 Z" />
        </svg>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Salaam, Ayesha! <span className="inline-block">👋</span></h1>
        <p className="text-gray-500 mb-8 text-sm">Discover. Track. Never miss a moment.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Up Next For You */}
          <div className="lg:col-span-2 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Up Next For You</h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 h-48">
              <div className="relative w-32 h-full rounded-xl overflow-hidden flex-shrink-0">
                <Image src="https://picsum.photos/seed/kaisi/200/300" alt="Kaisi Teri Khudgharzi" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-center py-2 relative">
                <button className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600">
                  <Bookmark className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-gray-900 text-lg mb-1 pr-8">Kaisi Teri Khudgharzi</h3>
                <div className="flex items-center text-xs text-gray-500 mb-6 font-medium">
                  <span>ARY Digital</span>
                  <span className="mx-2">•</span>
                  <span>8:00 PM</span>
                </div>
                
                <div className="text-xs font-semibold text-gray-700 mb-2">25 min left</div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
                  <div className="bg-emerald-700 h-1.5 rounded-full w-2/3"></div>
                </div>
                
                <button className="bg-emerald-700 text-white text-sm font-medium py-2 px-6 rounded-lg w-max hover:bg-emerald-800 transition-colors shadow-sm">
                  Continue Watching
                </button>
              </div>
            </div>
          </div>

          {/* Today's Picks */}
          <div className="lg:col-span-1 border border-gray-100 bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Today's Picks</h2>
              <button className="text-emerald-700 text-xs font-medium hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {todaysPicks.map((pick, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image src={pick.image} alt={pick.title} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">{pick.title}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{pick.channel}</span>
                      <span className="mx-1">•</span>
                      <span>{pick.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Timeline Section */}
      <div className="px-8 mt-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
             
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
            <button className="text-emerald-700 text-xs font-medium hover:underline">View Full Schedule</button>
          </div>
          
          <div className="flex gap-6 mb-6 border-b border-gray-100 pb-2">
            <button className="text-sm font-semibold text-emerald-700 border-b-2 border-emerald-700 pb-2 -mb-2.5">All Channels</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">ARY Digital</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">HUM TV</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Geo TV</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Green TV</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Express TV</button>
          </div>

          <div className="relative overflow-x-auto pb-4">
             {/* Timeline track */}
             <div className="flex min-w-max mb-3">
               {['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'].map((time) => (
                 <div key={time} className="w-64 text-xs font-semibold text-gray-400 pl-4 border-l border-gray-200">
                   {time}
                 </div>
               ))}
             </div>

             <div className="flex gap-4 min-w-max">
               {/* Time Blocks */}
               <div className="w-[15rem] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50/50">
                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Mannat Murad</h4>
                 <p className="text-xs text-gray-500">HUM TV</p>
               </div>
               <div className="w-[15rem] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50/50">
                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Meem Se Mohabbat</h4>
                 <p className="text-xs text-gray-500">Geo TV</p>
               </div>
               <div className="w-[15rem] border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 shadow-sm relative">
                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Kaisi Teri Khudgharzi</h4>
                 <p className="text-xs text-emerald-700 font-medium">ARY Digital</p>
                 <span className="absolute bottom-4 right-4 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">Now</span>
               </div>
               <div className="w-[15rem] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50/50">
                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Jaan Nisar</h4>
                 <p className="text-xs text-gray-500">Geo TV</p>
               </div>
               <div className="w-[15rem] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50/50">
                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Mere Humsafar</h4>
                 <p className="text-xs text-gray-500">ARY Digital</p>
               </div>
             </div>

             <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
