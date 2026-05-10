'use client';
import React, { useState, useEffect } from 'react';
import { Bookmark, Calendar, Loader2, PlayCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { EpgProgram, EpgChannel } from '@/lib/epg-types';
import { formatDateKey, formatInTimeZone, getRollingDates } from '@/lib/date-utils';

interface TrackedDrama {
  _id: string;
  slug: string;
  title: string;
}

interface ScheduleDay {
  dateObj: Date;
  label: string;
  programs: (EpgProgram & { channelName: string })[] | null;
}

interface WatchlistScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function WatchlistScreen({ onNavigate }: WatchlistScreenProps) {
  const [trackedDramas, setTrackedDramas] = useState<TrackedDrama[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWatchlistAndSchedule = async () => {
    setIsLoading(true);
    try {
      const wlRes = await fetch('/api/watchlist');
      const wlData = await wlRes.json();
      const trackedSlugs = new Set((wlData.items || []).map((item: TrackedDrama) => item.slug));
      setTrackedDramas(wlData.items || []);

      const { rollingDates, todayBase } = getRollingDates();
      const upcomingDates = rollingDates.filter(d => d.getTime() >= todayBase.getTime());

      const daysPromises = upcomingDates.map(async (dateObj) => {
        const dateKey = formatDateKey(dateObj, "Asia/Karachi");
        const res = await fetch(`/api/schedule?date=${dateKey}`);
        const channels: EpgChannel[] = await res.json();

        let dayPrograms: (EpgProgram & { channelName: string })[] = [];

        if (Array.isArray(channels)) {
          channels.forEach(channel => {
            if (channel.programs) {
              const matched = channel.programs.filter(p => trackedSlugs.has(p.slug)).map(p => ({
                ...p,
                channelName: channel.name
              }));
              dayPrograms = [...dayPrograms, ...matched];
            }
          });
        }

        dayPrograms.sort((a, b) => new Date(a.start_time_pkt).getTime() - new Date(b.start_time_pkt).getTime());

        let label = formatInTimeZone(dateObj, "Asia/Karachi", "EEEE");
        if (dateObj.getTime() === todayBase.getTime()) label = "Today";

        return {
          dateObj,
          label,
          programs: dayPrograms
        };
      });

      const schedule = await Promise.all(daysPromises);
      setScheduleData(schedule);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWatchlistAndSchedule();
  }, []);

  const removeFromWatchlist = async (slug: string) => {
    try {
      await fetch(`/api/watchlist?slug=${slug}`, { method: 'DELETE' });
      fetchWatchlistAndSchedule(); 
    } catch (err) {
      console.error(err);
    }
  };

  const clearWatchlist = async () => {
    if (!confirm('Are you sure you want to clear your entire watchlist?')) return;
    try {
      await fetch('/api/watchlist?all=true', { method: 'DELETE' });
      fetchWatchlistAndSchedule();
    } catch (err) {
      console.error(err);
    }
  };

  const watchDrama = (program: any) => {
    onNavigate('drama', { slug: program.slug });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-gray-500">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F9FAFB] dark:bg-[#050505]">
      <div className="px-4 lg:px-8 py-6 shrink-0 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-neutral-900 shadow-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Schedule</h1>
          <p className="text-gray-500 text-sm">A personalized view of your dramas.</p>
        </div>
        {trackedDramas.length > 0 && (
          <button 
            onClick={clearWatchlist}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-red-100 dark:border-red-900/20"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 lg:p-6">
        {trackedDramas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No tracked dramas yet</h3>
            <p className="text-gray-500 text-sm mb-6">Explore the full schedule and add dramas to your watchlist to see them appear here.</p>
            <button onClick={() => onNavigate('schedule')} className="px-6 py-2.5 bg-emerald-700 text-white rounded-lg font-bold shadow-sm hover:bg-emerald-800 transition-all">
              Go to Schedule
            </button>
          </div>
        ) : (
          <div className="flex h-full gap-4">
            {scheduleData.map((day) => (
              <div key={day.dateObj.toISOString()} className="flex flex-col w-64 sm:w-72 shrink-0 h-full border border-gray-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0a0a0a] overflow-hidden shadow-sm">
                
                <div className="p-4 bg-gray-50 dark:bg-neutral-900/50 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{day.label}</h3>
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-200 dark:bg-neutral-800 px-2 py-1 rounded-md">
                    {formatInTimeZone(day.dateObj, "Asia/Karachi", "MMM d")}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-hide">
                  {day.programs && day.programs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10">
                      <Calendar className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs font-medium text-gray-500">No episodes</p>
                    </div>
                  ) : (
                    day.programs && day.programs.map((program, idx) => {
                      const startTime = new Date(program.start_time_pkt);
                      const endTime = new Date(program.end_time_pkt);
                      const durationMins = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

                      return (
                        <div key={`${program.id}-${idx}`} className="group relative bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-lg p-3 hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-500">
                              {formatInTimeZone(new Date(program.start_time_pkt), "Asia/Karachi", "h:mm a")}
                            </span>
                            <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1 bg-gray-50 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                              {durationMins}m
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight line-clamp-2">
                            {program.title}
                          </h4>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[10px] font-medium text-gray-500">
                              {program.channelName}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => watchDrama(program)}
                                className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded hover:bg-emerald-100 transition-colors" 
                                title="Watch Now"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => removeFromWatchlist(program.slug)}
                                className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 rounded hover:bg-red-100 transition-colors" 
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
