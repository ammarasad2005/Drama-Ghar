'use client';
import React, { useState, useEffect } from 'react';
import { MonitorPlay, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { EpgChannel } from '@/lib/epg-types';
import { formatDateKey } from '@/lib/date-utils';

interface ChannelsScreenProps {
  onNavigate: (screen: string, params?: Record<string, string>) => void;
  onChannelClick: (channel: string) => void;
}

export function ChannelsScreen({ onNavigate, onChannelClick }: ChannelsScreenProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const dateKey = formatDateKey(new Date(), "Asia/Karachi");
      const res = await fetch(`/api/schedule?date=${dateKey}`);
      const data: EpgChannel[] = await res.json();
      
      if (Array.isArray(data)) {
        const mapped = data.filter(c => c.name !== 'LTN Family').map((c, i) => {
          return {
            name: c.name,
            logo_path: c.logo_path,
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
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 bg-[#F9FAFB] dark:bg-[#050505]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Live Channels</h1>
        <p className="text-gray-500 text-sm">Watch your favorite channels live.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm p-6 flex flex-col gap-6 group hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                <img 
                    src={`https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/${channel.logo_path}`} 
                    alt={channel.name} 
                    className="w-full h-full object-contain p-1"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{channel.name}</h3>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate('schedule', { channel: channel.name })}
                className="flex-1 bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold text-xs py-2.5 rounded-lg transition-all"
              >
                View Schedule
              </button>
              <button 
                onClick={() => onNavigate('explore', { channel: channel.name })}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs py-2.5 rounded-lg transition-all"
              >
                View Dramas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
