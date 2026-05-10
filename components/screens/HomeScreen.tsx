'use client';
import React, { useState, useEffect } from 'react';
import { Bookmark, ChevronRight, PlayCircle, Loader2, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { EpgChannel, EpgProgram } from '@/lib/epg-types';
import { formatDateKey, formatInTimeZone } from '@/lib/date-utils';

interface HomeScreenProps {
  user: any;
  onNavigate: (screen: string, params?: any) => void;
  onChannelClick: (channel: string) => void;
}

interface HistoryItem {
  _id: string;
  slug: string;
  title: string;
  episode: string;
  progress: number;
  image: string;
}

export function HomeScreen({ user, onNavigate, onChannelClick }: HomeScreenProps) {
  const [upNext, setUpNext] = useState<HistoryItem | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [loadingPicks, setLoadingPicks] = useState(true);
  const [schedulePrograms, setSchedulePrograms] = useState<(EpgProgram & { channelName: string })[]>([]);
  const [todaysPicks, setTodaysPicks] = useState<{slug: string, title: string, channel: string, time: string, image: string}[]>([]);

  const fetchUpNext = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        setUpNext(data.items[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      if (res.ok && data.items) {
        setTodaysPicks(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPicks(false);
    }
  };

  const fetchCurrentSchedule = async () => {
    try {
      const dateKey = formatDateKey(new Date(), "Asia/Karachi");
      const res = await fetch(`/api/schedule?date=${dateKey}`);
      const channels: EpgChannel[] = await res.json();
      
      let allPrograms: (EpgProgram & { channelName: string })[] = [];
      const now = new Date().getTime();

      if (Array.isArray(channels)) {
        channels.forEach(channel => {
          if (channel.programs) {
            channel.programs.forEach(p => {
              allPrograms.push({ ...p, channelName: channel.name });
            });
          }
        });
      }

      // Filter: Strictly programs currently airing (now is between start and end)
      const filtered = allPrograms
        .filter(p => {
          const start = new Date(p.start_time_pkt).getTime();
          const end = new Date(p.end_time_pkt).getTime();
          return now >= start && now < end;
        })
        .sort((a, b) => new Date(a.start_time_pkt).getTime() - new Date(b.start_time_pkt).getTime());

      setSchedulePrograms(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUpNext();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCurrentSchedule();
  }, []);

  const watchDrama = (program: any) => {
    onNavigate('drama', { slug: program.slug });
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex-1 overflow-y-auto pb-12 animate-in fade-in duration-500">
      {/* Top Banner Section */}
      <div className="relative pt-6 px-4 lg:px-8 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] to-[#F3EDE0] dark:from-[#0a1510] dark:to-[#050a08] -z-10" />
        <svg className="absolute right-0 top-0 h-32 lg:h-48 opacity-10 lg:opacity-20 text-[#D4AF37]" viewBox="0 0 200 200" fill="currentColor">
           <path d="M100,0 C150,0 200,50 200,100 L200,200 L0,200 L0,100 C0,50 50,0 100,0 Z" />
        </svg>

        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Salaam, {userName}! <span className="inline-block">👋</span></h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm">Discover. Track. Never miss a moment.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Up Next For You */}
          <div className="lg:col-span-2 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resume Watching</h2>
            {loadingHistory ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : upNext ? (
              <div 
                onClick={() => onNavigate('drama', { slug: upNext.slug })}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 h-auto sm:h-48 group cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
              >
                <div className="relative w-full sm:w-32 h-40 sm:h-full rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={upNext.image ? (upNext.image.startsWith('http') ? upNext.image : `https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/${upNext.image}`) : '/icon.png'} alt={upNext.title} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-center py-2 relative">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 pr-8 group-hover:text-emerald-700 transition-colors">{upNext.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 sm:mb-6 font-medium">Episode {upNext.episode}</p>
                  
                  <div className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">Continue watching...</div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 mb-6">
                    <div className="bg-emerald-700 h-1.5 rounded-full transition-all duration-1000" style={{ width: `100%` }}></div>
                  </div>
                  
                  <button className="bg-emerald-700 text-white text-sm font-medium py-2 px-6 rounded-lg w-full sm:w-max hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Watch Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-neutral-800 flex flex-col items-center justify-center h-48 text-center">
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-4">Start watching to see your progress here!</p>
                <button onClick={() => onNavigate('explore')} className="text-emerald-700 dark:text-emerald-500 font-bold text-sm hover:underline">Explore Library</button>
              </div>
            )}
          </div>

          {/* Today's Picks */}
          <div className="lg:col-span-1 border border-gray-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recommended</h2>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            
            <div className="space-y-4 min-h-[160px]">
              {loadingPicks ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
              ) : todaysPicks.length === 0 ? (
                <p className="text-gray-400 dark:text-slate-500 text-xs text-center py-10">No recommendations right now.</p>
              ) : (
                todaysPicks.map((pick, i) => (
                  <div key={i} onClick={() => watchDrama(pick)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-100 dark:border-neutral-800 bg-gray-100">
                      <Image src={pick.image} alt={pick.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors truncate">{pick.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-1">
                        <span>{pick.channel}</span>
                      </div>
                    </div>
                    <PlayCircle className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-emerald-600 transition-colors" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Timeline Section */}
      <div className="px-4 lg:px-8 mt-2">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-4 lg:p-6 relative overflow-hidden">
             
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live on TV Now</h2>
            <button onClick={() => onNavigate('schedule')} className="text-emerald-700 dark:text-emerald-500 text-xs font-medium hover:underline">View Full Schedule</button>
          </div>
          
          <div className="flex gap-4 lg:gap-6 mb-6 border-b border-gray-100 dark:border-neutral-800 pb-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => onChannelClick('All Channels')} className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 border-b-2 border-emerald-700 dark:border-emerald-500 pb-2 -mb-2.5 whitespace-nowrap text-left">All Channels</button>
            <button onClick={() => onChannelClick('ARY Digital')} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap text-left">ARY Digital</button>
            <button onClick={() => onChannelClick('HUM TV')} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap text-left">HUM TV</button>
            <button onClick={() => onChannelClick('Geo Entertainment')} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap text-left">Geo TV</button>
            <button onClick={() => onChannelClick('Green Entertainment')} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap text-left">Green TV</button>
            <button onClick={() => onChannelClick('Express Entertainment')} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap text-left">Express TV</button>
          </div>

          {loadingSchedule ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : schedulePrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-slate-500 opacity-50">
              <Calendar className="w-12 h-12 mb-4" />
              <p>No program data found for today.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max">
                {schedulePrograms.map((program, idx) => {
                  const startTime = new Date(program.start_time_pkt).getTime();
                  const endTime = new Date(program.end_time_pkt).getTime();
                  const now = new Date().getTime();
                  const isNow = now >= startTime && now < endTime;

                  return (
                    <div 
                      key={`${program.id}-${idx}`} 
                      onClick={() => program.slug ? onNavigate('drama', { slug: program.slug }) : onChannelClick(program.channelName)}
                      className={`w-[14rem] lg:w-[15rem] border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                        isNow 
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/50' 
                          : 'border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 hover:border-emerald-100 dark:hover:border-emerald-800 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md'
                      } relative`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black tracking-widest uppercase ${isNow ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {formatInTimeZone(new Date(program.start_time_pkt), "Asia/Karachi", "h:mm a")}
                        </span>
                        {isNow && (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight line-clamp-2">{program.title}</h4>
                      <p className={`text-xs ${isNow ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-gray-500 dark:text-slate-400'}`}>{program.channelName}</p>
                    </div>
                  );
                })}
              </div>

              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-md rounded-full flex items-center justify-center text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 z-10 hidden lg:flex">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
