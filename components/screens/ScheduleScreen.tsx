import React from 'react';
import { Calendar as CalendarIcon, ChevronDown, LayoutGrid, List, Clock } from 'lucide-react';
import Image from 'next/image';

export function ScheduleScreen() {
  const channels = [
    { name: 'ARY Digital', logocolor: 'blue' },
    { name: 'HUM TV', logocolor: 'yellow' },
    { name: 'Geo TV', logocolor: 'orange' },
    { name: 'Green TV', logocolor: 'green' },
    { name: 'Express TV', logocolor: 'red' }
  ];

  const gridData = [
    [
      { title: 'Mere Apne', tag: 'New Episode' },
      { title: 'Tere Bin', tag: 'Repeat' },
      { title: 'Kaisi Teri Khudgharzi', tag: 'Now', active: true },
      { title: 'Shiddat', tag: 'New Episode' },
      { title: 'Mere Humsafar', tag: 'Repeat' }
    ],
    [
      { title: 'Ishq Murshid', tag: 'New Episode' },
      { title: 'Mannat Murad', tag: 'Now', active: true },
      { title: 'Meem Se Mohabbat', tag: 'Repeat' },
      { title: 'DuniyaPur', tag: 'New Episode' },
      { title: 'Jhok Sarkar', tag: 'New Episode' }
    ],
    [
      { title: 'Dil-e-Nadaan', tag: 'Repeat' },
      { title: 'Jaan Nisar', tag: 'New Episode' },
      { title: 'Mohabbat Gumshuda', tag: 'Now', active: true },
      { title: 'Humraaz', tag: 'New Episode' },
      { title: 'Sirf Tum', tag: 'Repeat' }
    ],
    [
      { title: 'Qarz e Jaan', tag: 'Now', active: true },
      { title: 'Raaz-e-Ulfat', tag: 'Repeat' },
      { title: 'Woh Ziddi Si', tag: 'New Episode' },
      { title: 'Tera Mera Hai Pyar', tag: 'New Episode' },
      { title: 'Jannat Se Aagay', tag: 'Repeat' }
    ],
    [
      { title: 'Kaffara', tag: 'Repeat' },
      { title: 'Bebasi', tag: 'New Episode' },
      { title: 'Inteqam', tag: 'Repeat' },
      { title: 'Aitebaar', tag: 'New Episode' },
      { title: 'Kuch Ankahi', tag: 'Repeat' }
    ]
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">All Drama Schedules</h1>
        <p className="text-gray-500 text-sm">Never miss your favorite dramas.</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Today, 20 May
            <CalendarIcon className="w-4 h-4 text-gray-400" />
          </button>
          
          <button className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-48 justify-between">
            All Channels
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button className="flex items-center justify-center px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-medium shadow-sm gap-2">
            Grid
          </button>
          <button className="flex items-center justify-center px-4 py-1.5 text-gray-600 hover:text-gray-900 rounded-md text-sm font-medium gap-2 transition-colors">
            List
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="bg-gray-50/80 border-b border-gray-200">
                 <th className="font-semibold text-xs text-gray-500 py-4 px-6 w-48"></th>
                 {/* Time Headers */}
                 {['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'].map(time => (
                   <th key={time} className="font-semibold text-xs text-gray-500 py-4 px-6 text-center border-l border-gray-200">
                     {time}
                   </th>
                 ))}
               </tr>
             </thead>
             <tbody>
                {channels.map((channel, rowIndex) => (
                  <tr key={channel.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    {/* Channel Column */}
                    <td className="py-6 px-6 font-semibold text-sm text-gray-900 flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                           {/* Placeholder for Channel Logo */}
                           <div className={`w-3 h-3 rounded-sm ${
                             channel.logocolor === 'blue' ? 'bg-emerald-700' : 
                             channel.logocolor === 'yellow' ? 'bg-yellow-400' :
                             channel.logocolor === 'orange' ? 'bg-orange-500' :
                             channel.logocolor === 'green' ? 'bg-green-600' : 'bg-red-600'
                           }`}></div>
                       </div>
                       {channel.name}
                    </td>

                    {/* Program Cells */}
                    {gridData[rowIndex].map((program, colIndex) => (
                      <td key={colIndex} className="py-4 px-2 border-l border-gray-100 align-top">
                        <div className={`h-full rounded-xl p-3 ${
                            program.active ? 'bg-emerald-50/50 border border-emerald-200 relative' : 'hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100'
                        }`}>
                          <h4 className={`text-sm font-semibold mb-1.5 leading-tight ${program.active ? 'text-emerald-900' : 'text-gray-900'}`}>
                            {program.title}
                          </h4>
                          
                          {program.tag === 'Now' ? (
                            <span className="inline-block bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded leading-tight">Now</span>
                          ) : program.tag === 'New Episode' ? (
                            <span className="inline-block bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-green-100 leading-tight">New Episode</span>
                          ) : (
                            <span className="inline-block text-gray-400 text-[10px] font-medium px-1 py-0.5 leading-tight">Repeat</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <Clock className="w-4 h-4" />
        All times are in PKT (Pakistan Standard Time)
      </div>
    </div>
  );
}
