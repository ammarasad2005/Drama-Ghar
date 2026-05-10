'use client';
import React, { useState, useEffect } from 'react';
import { MonitorPlay, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { EpgChannel } from '@/lib/epg-types';
import { formatDateKey } from '@/lib/date-utils';

interface ChannelsScreenProps {
  onNavigate: (tab: string) => void;
  onChannelClick: (channel: string) => void;
}

export function ChannelsScreen({ onNavigate, onChannelClick }: ChannelsScreenProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const dateKey = formatDateKey(new Date(), "Asia/Karachi");
      const res = await fetch(`/api/schedule?date=${dateKey}`);
      const data: EpgChannel[] = await res.json();
      
      if (Array.isArray(data)) {
        const mapped = data.filter(c => c.name !== 'LTN Family').map((c, i) => {
          const colors = ['blue', 'yellow', 'orange', 'green', 'red'];
          const topShow = c.programs && c.programs.length > 0 
            ? c.programs.find(p => p.isPrime)?.title || c.programs[0].title
            : 'No upcoming shows';
            
          return {
            name: c.name,
            color: colors[i % colors.length],
            desc: `Top-rated dramas from ${c.name}`,
            topShow: topShow
          };
        });
        setChannels(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#F9FAFB] dark:bg-[#050505]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Live Channels</h1>
        <p className="text-gray-500 text-sm">Watch your favorite channels live.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel, i) => (
          <div 
            key={i} 
            onClick={() => onChannelClick(channel.name)}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                channel.color === 'blue' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500' :
                channel.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500' :
                channel.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500' :
                channel.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500' :
                'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500'
              }`}>
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{channel.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{channel.desc}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-neutral-800 mt-auto">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-xs text-gray-500">Must Watch</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 mt-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors">{channel.topShow}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
