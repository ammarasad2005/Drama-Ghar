"use client";

import React, { useMemo } from "react";
import { formatInTimeZone, getRollingDates } from "@/lib/date-utils";
import { Tv } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onJumpToPrime: () => void;
  userTz: string | null;
}

export function DateSelector({
  selectedDate,
  onDateChange,
  onJumpToPrime,
  userTz,
}: DateSelectorProps) {
  const { rollingDates, todayBase, yestBase } = useMemo(
    () => getRollingDates(),
    []
  );

  return (
    <div className="flex flex-col bg-transparent sticky top-16 z-40 border-b border-neutral-200 dark:border-neutral-800 transition-all">
      {/* Date pills */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto scrollbar-hide snap-x w-full py-2 border-b border-neutral-200 dark:border-neutral-800/50">
        {rollingDates.map((date) => {
          const isSelected = date.getTime() === selectedDate.getTime();
          const isToday = date.getTime() === todayBase.getTime();
          const isYesterday = date.getTime() === yestBase.getTime();

          let dayLabel = formatInTimeZone(date, "Asia/Karachi", "EEE");
          if (isToday) dayLabel = "TODAY";
          if (isYesterday) dayLabel = "YEST";

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`flex flex-col items-center justify-center min-w-[3.5rem] py-1.5 rounded-lg transition-all duration-200 relative snap-center shrink-0 ${
                isSelected
                  ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-500 scale-105"
                  : "bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${
                  isSelected
                    ? "opacity-80"
                    : isToday
                    ? "text-emerald-600 opacity-100"
                    : "opacity-50"
                }`}
              >
                {dayLabel}
              </span>
              <span
                className={`text-sm font-black leading-none mt-0.5 ${
                  isSelected
                    ? "text-emerald-700 dark:text-emerald-500"
                    : isToday
                    ? "text-emerald-600"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {formatInTimeZone(date, "Asia/Karachi", "d")}
              </span>
              {isToday && !isSelected && (
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Timezone info and Jump to Prime button */}
      <div className="flex items-center justify-between py-2 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            This follows{" "}
            {userTz && <span>{userTz} </span>}
            time
          </span>
        </div>
        <button
          onClick={onJumpToPrime}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600/10 text-emerald-700 dark:text-emerald-500 border border-emerald-600/20 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 group"
        >
          <Tv
            size={12}
            className="fill-current group-hover:animate-pulse"
          />
          <span className="hidden xs:inline">Jump to</span> 7 TO 11 PM
        </button>
      </div>
    </div>
  );
}