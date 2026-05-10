"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EpgData, EpgChannel, EpgProgram } from "@/lib/epg-types";
import { formatInTimeZone } from "@/lib/date-utils";
import { ChannelRow } from "./channel-row";
import { cn } from "@/lib/utils";

interface TimelineProps {
  data: EpgData;
  currentDate: Date;
  onNavigate: (screen: string, params?: any) => void;
  className?: string;
  selectedChannelFilter?: string;
}

export interface TimelineHandle {
  scrollToTime: (hour: number) => void;
}

const CHANNEL_ROW_HEIGHT = 80;
const TIMELINE_WIDTH = 2880; // 120px per hour * 24 hours

export const WebProgramTimeline = forwardRef<TimelineHandle, TimelineProps>(
  ({ data, currentDate, onNavigate, className, selectedChannelFilter = 'All Channels' }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentTimeOffset, setCurrentTimeOffset] = useState<number>(-1);
    const timeZone = "Asia/Karachi";

    // Expose scrollToTime method
    useImperativeHandle(ref, () => ({
      scrollToTime: (hour: number) => {
        if (scrollRef.current) {
          const clientWidth = scrollRef.current.clientWidth;
          const isMobile = window.innerWidth < 768;
          scrollRef.current.scrollTo({
            left: Math.max(
              0,
              60 * hour * 2 + (isMobile ? 60 : 160) - clientWidth / 2
            ),
            behavior: "smooth",
          });
        }
      },
    }));

    // Convert data object to sorted channel array
    const channels = useMemo(() => {
      const result: EpgChannel[] = [];
      if (!data || typeof data !== "object") return result;

      const keys = Object.keys(data);
      for (const key of keys) {
        const channel = data[key];
        if (channel && typeof channel === "object") {
          result.push(channel);
        }
      }

      return result
        .filter(c => {
          if (c.name === 'LTN Family') return false;
          if (selectedChannelFilter !== 'All Channels') {
            return c.name === selectedChannelFilter;
          }
          return true;
        })
        .sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
    }, [data, selectedChannelFilter]);

    // Timeline start time in ms
    const timelineStartUTC = useMemo(
      () => currentDate.getTime(),
      [currentDate]
    );

    // Calculate current time indicator position
    useEffect(() => {
      const update = () => {
        const offset = Math.floor(
          (new Date().getTime() - timelineStartUTC) / 60000
        );
        setCurrentTimeOffset(offset >= 0 && offset <= 1440 ? 2 * offset : -1);
      };

      update();
      const interval = setInterval(update, 60000);
      return () => clearInterval(interval);
    }, [timelineStartUTC]);

    // Auto-scroll to current time on initial load
    const hasScrolled = useRef(false);
    useEffect(() => {
      if (currentTimeOffset > 0 && scrollRef.current && !hasScrolled.current) {
        const isMobile = window.innerWidth < 768;
        const scrollTarget =
          currentTimeOffset +
          (isMobile ? 60 : 160) -
          scrollRef.current.clientWidth / 2;
        scrollRef.current.scrollTo({
          left: Math.max(0, scrollTarget),
          behavior: "instant",
        });
        hasScrolled.current = true;
      }
    }, [currentTimeOffset]);

    // Reset scroll flag when date changes
    useEffect(() => {
      hasScrolled.current = false;
    }, [currentDate]);

    // Add drag to scroll
    useEffect(() => {
      const scroller = scrollRef.current;
      if (!scroller) return;

      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        scroller.classList.add('cursor-grabbing');
        startX = e.pageX - scroller.offsetLeft;
        scrollLeft = scroller.scrollLeft;
      };

      const onMouseLeave = () => {
        isDown = false;
        scroller.classList.remove('cursor-grabbing');
      };

      const onMouseUp = () => {
        isDown = false;
        scroller.classList.remove('cursor-grabbing');
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scroller.offsetLeft;
        const walk = (x - startX) * 2;
        scroller.scrollLeft = scrollLeft - walk;
      };

      scroller.addEventListener('mousedown', onMouseDown);
      scroller.addEventListener('mouseleave', onMouseLeave);
      scroller.addEventListener('mouseup', onMouseUp);
      scroller.addEventListener('mousemove', onMouseMove);

      return () => {
        scroller.removeEventListener('mousedown', onMouseDown);
        scroller.removeEventListener('mouseleave', onMouseLeave);
        scroller.removeEventListener('mouseup', onMouseUp);
        scroller.removeEventListener('mousemove', onMouseMove);
      };
    }, []);

    // Generate hour labels
    const hourLabels = useMemo(() => {
      return Array.from({ length: 24 }, (_, i) => {
        const hourDate = new Date(timelineStartUTC + 3600000 * i);
        return formatInTimeZone(hourDate, timeZone, "h a");
      });
    }, [timelineStartUTC]);

    return (
      <div
        className={cn(
          "w-full max-w-full overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm dark:shadow-neutral-950/50",
          className
        )}
      >
        <div
          ref={scrollRef}
          onScroll={(e) => {
            (e.currentTarget as HTMLElement).style.setProperty(
              "--scroll-x",
              `${(e.currentTarget as HTMLElement).scrollLeft}px`
            );
          }}
          className="relative w-full overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 scrollbar-hide"
          style={{ height: "auto", minHeight: "400px" }}
        >
          <div className="min-w-[1000px] lg:min-w-[1200px] flex flex-col w-full">
            {/* Timeline header with hour labels */}
            <div className="sticky top-0 z-30 flex h-14 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm dark:shadow-neutral-950/50 min-w-max">
              {/* Spacer for channel logos */}
              <div
                className="sticky left-0 top-0 z-[35] h-14 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md border-r border-neutral-200 dark:border-neutral-800 shrink-0 w-[60px] md:w-[160px] shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)] dark:shadow-neutral-950/50 will-change-transform"
                style={{ transform: "translateZ(0)" }}
              />
              {/* Hour labels */}
              <div className="flex relative h-full items-center min-w-max">
                {hourLabels.map((label, i) => (
                  <div
                    key={i}
                    className="shrink-0 flex items-center justify-center border-r border-neutral-200 dark:border-neutral-800/40 text-[10px] font-black text-neutral-900 dark:text-neutral-50 h-8 uppercase tracking-widest"
                    style={{ width: "120px" }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Channel rows with programs */}
            <div
              className="relative min-w-max"
              style={{ height: `${CHANNEL_ROW_HEIGHT * channels.length}px` }}
            >
              {/* Current time indicator */}
              {currentTimeOffset >= 0 && currentTimeOffset <= TIMELINE_WIDTH && (
                <div
                  className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-1000 ease-linear md:ml-[160px] ml-[60px]"
                  style={{
                    transform: `translate3d(${currentTimeOffset}px, 0, 0)`,
                    willChange: "transform",
                  }}
                >
                  <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.8)] dark:shadow-[0_0_12px_rgba(5,150,105,1)]" />
                  <div className="absolute top-0 -left-1.5 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 shadow-sm border border-white/20" />
                  </div>
                </div>
              )}

              {/* Render channel rows */}
              {channels.length > 0 ? (
                <div
                  style={{
                    height: Math.min(
                      CHANNEL_ROW_HEIGHT * channels.length,
                      600
                    ),
                    overflowY: "auto",
                    overflowX: "visible",
                  }}
                  className="scrollbar-hide"
                >
                  {filteredChannels.map((channel) => (
                    <ChannelRow
                      key={channel.id}
                      channel={channel}
                      style={{
                        height: CHANNEL_ROW_HEIGHT,
                        width: TIMELINE_WIDTH + (typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 160),
                      }}
                      timelineStartUTC={timelineStartUTC}
                      timeZone={timeZone}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 font-bold uppercase tracking-widest animate-pulse">
                    Syncing Schedule...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

WebProgramTimeline.displayName = "WebProgramTimeline";