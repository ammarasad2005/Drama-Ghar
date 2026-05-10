'use client';
import React, { useState, useEffect } from 'react';
import { Bookmark, ChevronRight, PlayCircle, Loader2, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { EpgChannel, EpgProgram } from '@/lib/epg-types';
import { formatDateKey, formatInTimeZone } from '@/lib/date-utils';

interface HomeScreenProps {
  user: any;
  onNavigate: (tab: string) => void;
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
  const [schedulePrograms, setSchedulePrograms] = useState<(EpgProgram & { channelName: string })[]>([]);
  const [todaysPicks, setTodaysPicks] = useState<{slug: string, title: string, channel: string, time: string, image: string}[]>([]);

  const fetchUpNext = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        const incomplete = data.items.find((item: HistoryItem) => item.progress < 100);
        setUpNext(incomplete || data.items[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
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

      // Today's Picks: Pick 3 random programs
      if (allPrograms.length > 0) {
        const shuffled = [...allPrograms].sort(() => 0.5 - Math.random());
        const picks = shuffled.slice(0, 3).map(p => ({
          slug: p.slug,
          title: p.title,
          channel: p.channelName,
          time: p.schedule_time,
          image: `https://picsum.photos/seed/${p.slug}/100/100`
        }));
        setTodaysPicks(picks);
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

  const watchDrama = async (program: any) => {
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: program.slug,
          title: program.title,
          episode: 'Episode 1',
          progress: 10, 
          image: `https://picsum.photos/seed/${program.slug}/400/225`
        })
      });
      if (res.ok) {
        onNavigate('continue');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex-1 overflow-y-auto pb-12">
      {/* Top Banner Section */}
      <div className="relative pt-6 px-8 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] to-[#F3EDE0] -z-10" />
        <svg className="absolute right-0 top-0 h-48 opacity-20 text-[#D4AF37]" viewBox="0 0 200 200" fill="currentColor">
           <path d="M100,0 C150,0 200,50 200,100 L200,200 L0,200 L0,100 C0,50 50,0 100,0 Z" />
        </svg>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Salaam, {userName}! <span className="inline-block">👋</span></h1>
        <p className="text-gray-500 mb-8 text-sm">Discover. Track. Never miss a moment.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Up Next For You */}
          <div className="lg:col-span-2 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Up Next For You</h2>
            {loadingHistory ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : upNext ? (
              <div 
                onClick={() => onNavigate('continue')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 h-48 group cursor-pointer hover:border-emerald-200 transition-colors"
              >
                <div className="relative w-32 h-full rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={upNext.image || "https://picsum.photos/seed/drama/200/300"} alt={upNext.title} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-center py-2 relative">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 pr-8">{upNext.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 font-medium">{upNext.episode}</p>
                  
                  <div className="text-xs font-semibold text-gray-700 mb-2">{upNext.progress}% complete</div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
                    <div className="bg-emerald-700 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${upNext.progress}%` }}></div>
                  </div>
                  
                  <button className="bg-emerald-700 text-white text-sm font-medium py-2 px-6 rounded-lg w-max hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Continue Watching
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-48 text-center">
                <p className="text-gray-400 text-sm mb-4">Start watching to see your progress here!</p>
                <button onClick={() => onNavigate('schedule')} className="text-emerald-700 font-bold text-sm hover:underline">Browse Dramas</button>
              </div>
            )}
          </div>

          {/* Today's Picks */}
          <div className="lg:col-span-1 border border-gray-100 bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recommended</h2>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            
            <div className="space-y-4 min-h-[160px]">
              {loadingSchedule ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
              ) : todaysPicks.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-10">No recommendations right now.</p>
              ) : (
                todaysPicks.map((pick, i) => (
                  <div key={i} onClick={() => watchDrama(pick)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={pick.image} alt={pick.title} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">{pick.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{pick.channel}</span>
                      </div>
                    </div>
                    <PlayCircle className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Timeline Section */}
      <div className="px-8 mt-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
             
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Live on TV Now</h2>
            <button onClick={() => onNavigate('schedule')} className="text-emerald-700 text-xs font-medium hover:underline">View Full Schedule</button>
          </div>
          
          <div className="flex gap-6 mb-6 border-b border-gray-100 pb-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => onChannelClick('All Channels')} className="text-sm font-semibold text-emerald-700 border-b-2 border-emerald-700 pb-2 -mb-2.5 whitespace-nowrap text-left">All Channels</button>
            <button onClick={() => onChannelClick('ARY Digital')} className="text-sm font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap text-left">ARY Digital</button>
            <button onClick={() => onChannelClick('HUM TV')} className="text-sm font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap text-left">HUM TV</button>
            <button onClick={() => onChannelClick('Geo Entertainment')} className="text-sm font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap text-left">Geo TV</button>
            <button onClick={() => onChannelClick('Green Entertainment')} className="text-sm font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap text-left">Green TV</button>
            <button onClick={() => onChannelClick('Express Entertainment')} className="text-sm font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap text-left">Express TV</button>
          </div>

          {loadingSchedule ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : schedulePrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-50">
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
                      onClick={() => onChannelClick(program.channelName)}
                      className={`w-[15rem] border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                        isNow 
                          ? 'border-emerald-200 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-100' 
                          : 'border-gray-100 bg-gray-50/50 hover:border-emerald-100 hover:bg-white hover:shadow-md'
                      } relative`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black tracking-widest uppercase ${isNow ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {program.schedule_time}
                        </span>
                        {isNow && (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">{program.title}</h4>
                      <p className={`text-xs ${isNow ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>{program.channelName}</p>
                    </div>
                  );
                })}
              </div>

              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 z-10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
