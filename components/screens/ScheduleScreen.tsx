'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, LayoutGrid, List, Clock } from 'lucide-react';
import Image from 'next/image';

import { EpgGrid } from '../EpgGrid';

export function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    // Offset by +05:00 for PKT just to pick the local day in PKT roughly
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const pktDate = new Date(utc + (3600000 * 5));
    return pktDate.toISOString().split('T')[0];
  });
  
  const [selectedChannel, setSelectedChannel] = useState('All Channels');

  const channelsList = [
    'All Channels',
    'ARY Digital',
    'Express Entertainment',
    'Geo Entertainment',
    'Green Entertainment',
    'HUM TV'
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  const selectedDateObj = new Date(selectedDate);
  const formattedDate = !isNaN(selectedDateObj.getTime()) 
    ? selectedDateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' })
    : 'Unknown Date';

  const isToday = new Date().toISOString().split('T')[0] === selectedDate;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">All Drama Schedules</h1>
        <p className="text-gray-500 text-sm">Never miss your favorite dramas.</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <label className="relative flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer">
            {isToday ? 'Today' : ''} {formattedDate}
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={handleDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
          
          <div className="relative">
            <select 
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="appearance-none flex items-center gap-3 px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-56 cursor-pointer focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              {channelsList.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
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
      <EpgGrid date={selectedDate} selectedChannel={selectedChannel} />
      
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <Clock className="w-4 h-4" />
        All times are in PKT (Pakistan Standard Time)
      </div>
    </div>
  );
}
