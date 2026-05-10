'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { EpgSchedule } from '@/components/epg/epg-schedule';

interface ScheduleScreenProps {
  onNavigate: (tab: string) => void;
  initialChannel?: string;
}

export function ScheduleScreen({ onNavigate, initialChannel = 'All Channels' }: ScheduleScreenProps) {
  const [selectedChannel, setSelectedChannel] = useState(initialChannel);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedChannel(initialChannel);
  }, [initialChannel]);

  const channelsList = [
    'All Channels',
    'ARY Digital',
    'Express Entertainment',
    'Geo Entertainment',
    'Green Entertainment',
    'HUM TV'
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 bg-white dark:bg-[#0a0a0a]">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">All Drama Schedules</h1>
          <p className="text-gray-500 text-sm">Never miss your favorite dramas.</p>
        </div>
        
        {/* Channel Filter */}
        <div className="relative z-50 w-full sm:w-auto">
          <select 
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="appearance-none w-full sm:w-auto flex items-center gap-3 px-3 py-1.5 pr-10 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          >
            {channelsList.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* The Perfect EPG Component */}
      <EpgSchedule selectedChannelFilter={selectedChannel} />
      
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <Clock className="w-4 h-4" />
        All times are in PKT (Pakistan Standard Time)
      </div>
    </div>
  );
}
