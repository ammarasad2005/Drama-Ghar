"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { EpgCache, EpgChannel, EpgProgram } from "@/lib/epg-types";
import { formatDateKey, getPktBaseDate } from "@/lib/date-utils";
import { WebProgramTimeline, TimelineHandle } from "./timeline";
import { DateSelector } from "./date-selector";
import { cn } from "@/lib/utils";

const SCHEDULE_TZ = "Asia/Karachi";

async function fetchSchedule(dateKey: string): Promise<EpgCache[string]> {
  try {
    const res = await fetch(`/api/schedule?date=${dateKey}`);
    const data = await res.json();

    if (!Array.isArray(data)) return {};

    const cache: EpgCache[string] = {};
    data.forEach((channel: EpgChannel) => {
      if (channel && (channel.id || channel.name)) {
        const id = channel.id || channel.name;
        cache[id] = {
          id: id,
          name: channel.name,
          logo_path: channel.logo_path || null,
          programs: channel.programs || [],
        };
      }
    });

    return cache;
  } catch (err) {
    console.error("[EPG Cache] Fetch error:", err);
    return {};
  }
}

function useUserTimezone() {
  return useSyncExternalStore(
    (callback) => {
      // No subscription needed - timezone doesn't change
      return () => {};
    },
    () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz.split("/").pop()?.replace("_", " ") || null;
    },
    () => null // SSR fallback
  );
}

interface EpgScheduleProps {
  selectedChannelFilter?: string;
}

export function EpgSchedule({ selectedChannelFilter = 'All Channels' }: EpgScheduleProps) {
  const router = useRouter();
  const timelineRef = useRef<TimelineHandle>(null);

  // Selected date in PKT
  const [selectedDate, setSelectedDate] = useState<Date>(() => getPktBaseDate());

  // Cached schedule data keyed by date string (YYYY-MM-DD)
  const [scheduleCache, setScheduleCache] = useState<EpgCache>({});

  // Loading state derived from cache
  const currentDateKey = useMemo(
    () => formatDateKey(selectedDate, SCHEDULE_TZ),
    [selectedDate]
  );

  const isLoading = !scheduleCache[currentDateKey];

  // User's detected timezone city
  const userTz = useUserTimezone();

  // Fetch schedule for the selected date
  useEffect(() => {
    if (scheduleCache[currentDateKey]) return;

    let cancelled = false;
    fetchSchedule(currentDateKey).then((data) => {
      if (cancelled) return;
      setScheduleCache((prev) => ({ ...prev, [currentDateKey]: data }));
    });

    return () => {
      cancelled = true;
    };
  }, [currentDateKey, scheduleCache]);

  // Prefetch 7 days of schedule data in the background after initial load
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!scheduleCache[currentDateKey]) return;

    hasInitialized.current = true;

    const today = new Date();
    const dateKeys: string[] = [];

    for (let i = -1; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dateKeys.push(formatDateKey(d, SCHEDULE_TZ));
    }

    dateKeys.forEach(async (key) => {
      if (!scheduleCache[key]) {
        const data = await fetchSchedule(key);
        setScheduleCache((prev) => ({ ...prev, [key]: data }));
      }
    });
  }, [currentDateKey, scheduleCache]);

  const handleProgramClick = useCallback(
    (program: EpgProgram) => {
      if (program.slug) {
        // router.push(`/drama/${program.slug}`);
      }
    },
    [] // Removing router dependency as we commented out the push logic
  );

  const handleJumpToPrime = useCallback(() => {
    timelineRef.current?.scrollToTime(19); // 7 PM
  }, []);

  const currentData = scheduleCache[currentDateKey] || {};

  return (
    <div className="flex flex-col gap-2" suppressHydrationWarning>
      {/* Date selector */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onJumpToPrime={handleJumpToPrime}
        userTz={userTz}
      />

      {/* Timeline with loading overlay */}
      <div className="relative mt-2">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs text-gray-500">
              Updating Schedule...
            </p>
          </div>
        )}
        <WebProgramTimeline
          ref={timelineRef}
          data={currentData}
          currentDate={selectedDate}
          onProgramClick={handleProgramClick}
          selectedChannelFilter={selectedChannelFilter}
          className={cn(
            "transition-opacity duration-500",
            isLoading ? "opacity-40" : "opacity-100"
          )}
        />
      </div>
    </div>
  );
}