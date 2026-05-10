'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface Program {
  title: string;
  start_time_pkt: string;
  end_time_pkt: string;
  schedule_time: string;
  status: string;
}

interface ChannelData {
  id: string;
  name: string;
  programs: Program[];
}

export function EpgGrid({ date, selectedChannel }: { date: string, selectedChannel: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [scheduleData, setScheduleData] = useState<ChannelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time calculation setup
  const [nowMinutes, setNowMinutes] = useState(-1);

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/schedule?date=${date}`);
        const data = await response.json();
        if (isMounted) {
          setScheduleData(data || []);
        }
      } catch (error) {
        console.error("Failed to load schedule", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchSchedule();
    return () => { isMounted = false; };
  }, [date]);

  // Update current time indicator
  useEffect(() => {
    const updateTime = () => {
      const currentUnix = Date.now();
      const startOfDayPktString = `${date}T00:00:00+05:00`;
      const startOfDayPktUnix = new Date(startOfDayPktString).getTime();
      const mins = (currentUnix - startOfDayPktUnix) / (1000 * 60);
      setNowMinutes(mins);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [date]);

  // Scroll sync setup
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      setScrollX(scroller.scrollLeft);
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial scroll to current time if viewing today
    if (nowMinutes > 0 && nowMinutes < 24 * 60) {
       // try to center the current time. 120px = 60 mins -> 2px per min
       const currentPx = nowMinutes * 2;
       scroller.scrollLeft = Math.max(0, currentPx - 200); // 200px offset left
    }

    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [nowMinutes]);

  const channelInfoList: Record<string, string> = {
    'ARY Digital': 'https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/channels/ary-digital-1771190693112-49b1cf79.svg',
    'Express Entertainment': 'https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/channels/express-1771190703775-728ed3dc.svg',
    'Geo Entertainment': 'https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/channels/geo-1771190714089-7c818694.svg',
    'Green Entertainment': 'https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/channels/green-tv-1771190723439-f8ae4bd5.svg',
    'HUM TV': 'https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/channels/hum-tv-1771190737069-3c25bf12.svg'
  };

  const filteredChannels = scheduleData.filter(ch => {
    if (ch.name === 'LTN Family') return false; // Hide LTN family
    if (selectedChannel !== 'All Channels') {
      return ch.name === selectedChannel;
    }
    return true;
  });

  const showCurrentTimeLine = nowMinutes >= 0 && nowMinutes <= 24 * 60;

  return (
    <div className="relative mt-2 flex flex-col min-h-[400px]" style={{ '--scroll-x': `${scrollX}px` } as React.CSSProperties}>
      <div className="w-full max-w-full overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm dark:shadow-neutral-950/50 transition-opacity duration-500 opacity-100 relative">
        
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        <div ref={scrollerRef} className="relative w-full overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2" style={{ height: 'auto', minHeight: '400px' }}>
          <div className="min-w-[1000px] lg:min-w-[1200px] flex flex-col w-full">
            
            {/* Header / Times */}
            <div className="sticky top-0 z-30 flex h-14 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm dark:shadow-neutral-950/50 min-w-max">
              <div className="sticky left-0 top-0 z-[35] h-14 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md border-r border-neutral-200 dark:border-neutral-800 shrink-0 w-[60px] md:w-[160px] shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)] dark:shadow-neutral-950/50 will-change-transform" style={{ transform: 'translateZ(0)' }}>
              </div>
              <div className="flex relative h-full items-center min-w-max">
                {['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'].map((time, idx) => (
                  <div key={idx} className="shrink-0 flex items-center justify-center border-r border-neutral-200 dark:border-neutral-800/40 text-[10px] font-black text-neutral-900 dark:text-neutral-50 h-8 uppercase tracking-widest" style={{ width: '120px' }}>{time}</div>
                ))}
              </div>
            </div>

            {/* Grid Area */}
            <div className="relative min-w-max" style={{ height: Math.max(480, filteredChannels.length * 80) + 'px' }}>
              
              {/* Current Time Indicator */}
              {showCurrentTimeLine && (
                <div className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-1000 ease-linear md:ml-[160px] ml-[60px]" style={{ transform: `translate3d(${nowMinutes * 2}px, 0, 0)`, willChange: 'transform' }}>
                  <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.8)] dark:shadow-[0_0_12px_rgba(5,150,105,1)]"></div>
                  <div className="absolute top-0 -left-1.5 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 shadow-sm border border-white/20"></span>
                  </div>
                </div>
              )}

              <div className="scrollbar-hide" role="list" style={{ position: 'relative', maxHeight: '100%', flexGrow: 1, overflowY: 'auto', height: Math.max(480, filteredChannels.length * 80) + 'px', width: '3040px', overflowX: 'visible' }}>
                
                {filteredChannels.length === 0 && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center left-0 text-gray-500 font-medium">
                    No schedule data available
                  </div>
                )}

                {filteredChannels.map((channel, channelIndex) => (
                  <div key={channel.id || channel.name} className="relative border-b border-neutral-200 dark:border-neutral-800 flex items-center bg-transparent group" style={{ position: 'absolute', left: 0, transform: `translateY(${channelIndex * 80}px)`, height: '80px', width: '3040px' }}>
                    
                    {/* Channel Sticky Name */}
                    <div className="absolute left-0 z-20 h-full flex items-center bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md border-r border-neutral-200 dark:border-neutral-800 shrink-0 w-[60px] md:w-[160px] justify-center md:justify-start md:pl-4 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)] dark:shadow-neutral-950/50" style={{ transform: `translate3d(${scrollX}px, 0, 0)`, willChange: 'transform', backfaceVisibility: 'hidden' }}>
                      <div className="flex items-center gap-2 md:gap-3 w-full justify-center md:justify-start">
                        <a className="flex items-center gap-2 md:gap-3 w-full group/link border-none" href="#" title={`View all ${channel.name} dramas`}>
                          <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 dark:brightness-90 dark:contrast-110 dark:opacity-90 group-hover/link:ring-2 group-hover/link:ring-emerald-600 transition-all">
                            {channelInfoList[channel.name] ? (
                              <Image src={channelInfoList[channel.name]} alt={channel.name} fill className="object-contain p-1 shrink-0" unoptimized />
                            ) : (
                              <div className="w-4 h-4 bg-emerald-600 rounded-sm"></div>
                            )}
                          </div>
                          <span className="hidden md:block flex-1 min-w-0 text-[10px] md:text-xs font-semibold text-neutral-900 dark:text-neutral-50 leading-tight truncate group-hover/link:text-emerald-700 transition-colors">{channel.name}</span>
                        </a>
                      </div>
                    </div>

                    {/* Channel Timeline background */}
                    <div className="relative h-full bg-slate-50/50 shrink-0 min-w-0 ml-[60px] md:ml-[160px]" style={{ width: '2880px', backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px)', backgroundSize: '120px 100%', backgroundRepeat: 'repeat-x' }}>
                      
                      {channel.programs.map((program, pIdx) => {
                        const startOfDayString = `${date}T00:00:00+05:00`;
                        const startOfDayPktUnix = new Date(startOfDayString).getTime();
                        
                        const startPktUnix = new Date(program.start_time_pkt).getTime();
                        const endPktUnix = new Date(program.end_time_pkt).getTime();
                        
                        const startMinutes = (startPktUnix - startOfDayPktUnix) / (1000 * 60);
                        const endMinutes = (endPktUnix - startOfDayPktUnix) / (1000 * 60);

                        const plotStart = Math.max(0, startMinutes);
                        const plotEnd = Math.min(24 * 60, endMinutes);
                        const duration = plotEnd - plotStart;

                        // Only render if it has duration on this day
                        if (duration <= 0) return null;

                        const isNow = showCurrentTimeLine && nowMinutes >= startMinutes && nowMinutes < endMinutes;
                        
                        // We deduct 1 from width to have a tiny margin between blocks
                        const pxWidth = Math.max(10, (duration * 2)) - 1; 

                        return (
                          <div key={pIdx} className={`absolute top-1.5 bottom-1.5 flex flex-col overflow-hidden rounded-md border border-l-4 px-2.5 py-1.5 transition-all duration-200 cursor-pointer active:scale-[0.98] z-10 hover:z-20 hover:shadow-md shadow-sm 
                            ${isNow ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 border-l-emerald-600' : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 border-l-slate-300 dark:border-l-zinc-700'}`} style={{ left: `${plotStart * 2}px`, width: `${pxWidth}px` }}>
                            
                            {pxWidth > 40 && (
                              <div className="flex items-center justify-between gap-1 mb-1 opacity-80 shrink-0">
                                <span className={`text-[9px] font-bold tracking-wider whitespace-nowrap ${pxWidth < 80 ? 'truncate block' : ''}`}>{program.schedule_time}</span>
                                {pxWidth > 80 && (
                                  <div className="flex gap-1 shrink-0">
                                    <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 rounded-sm ${isNow ? 'bg-emerald-600/20 text-emerald-800' : 'bg-current/10'}`}>
                                      {isNow ? 'Now' : program.status === 'On Air' ? 'New' : 'Repeat'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            <h4 className={`text-[11px] md:text-xs font-bold leading-tight ${pxWidth < 40 ? 'truncate' : 'line-clamp-2'}`}>{program.title}</h4>
                          </div>
                        );
                      })}

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
