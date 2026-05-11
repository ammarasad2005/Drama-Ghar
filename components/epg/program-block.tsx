"use client";

import React from "react";
import { EpgProgram } from "@/lib/epg-types";
import { formatInTimeZone } from "@/lib/date-utils";

interface ProgramBlockProps {
  program: EpgProgram;
  style: React.CSSProperties;
  onNavigate: (screen: string, params?: any) => void;
  timeZone: string;
}

export function ProgramBlock({
  program,
  style,
  onNavigate,
  timeZone,
}: ProgramBlockProps) {
  const widthPx =
    typeof style.width === "string"
      ? parseInt(style.width.replace("px", ""))
      : (style.width as number) || 0;

  const startTime = new Date(program.start_time_pkt);
  const formattedTime = formatInTimeZone(startTime, timeZone, "h:mm a");
  const hour = parseInt(formatInTimeZone(startTime, timeZone, "H"));

  const isClickable = !!program.slug;

  const handleClick = () => {
    if (isClickable) {
      onNavigate('drama', { slug: program.slug });
    }
  };

  // Determine color scheme based on program type
  let colorClasses: string;
  if (program.format === "Movie") {
    colorClasses =
      "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-l-indigo-500 shadow-sm";
  } else if (program.isPrime) {
    colorClasses =
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-l-emerald-500 shadow-sm";
  } else {
    colorClasses =
      "bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 border-l-slate-300 dark:border-l-zinc-700 shadow-sm";
  }

  return (
    <div
      onClick={handleClick}
      style={style}
      className={`
        absolute top-1.5 bottom-1.5 flex flex-col overflow-hidden
        rounded-md border border-l-4 px-2.5 py-1.5 transition-all duration-200
        ${
          isClickable
            ? "cursor-pointer active:scale-[0.98] z-10 hover:z-20 hover:shadow-md"
            : "cursor-default"
        }
        ${colorClasses}
      `}
    >
      {widthPx < 60 ? (
        // Compact view for very narrow blocks
        <h4 className="text-[10px] font-bold truncate text-center w-full leading-tight my-auto">
          {program.title}
        </h4>
      ) : (
        // Full view
        <>
          <div className="flex items-center justify-between gap-1 mb-1 opacity-80 shrink-0">
            <span className="text-[9px] font-bold tracking-wider whitespace-nowrap">
              {formattedTime}{" "}
              {hour >= 0 && hour < 5 && (
                <span className="font-black ml-0.5">(+1)</span>
              )}
            </span>
            <div className="flex gap-1 shrink-0">
              {program.format === "Movie" && (
                <span className="text-[8px] font-black tracking-widest uppercase bg-current/10 px-1.5 rounded-sm">
                  Movie
                </span>
              )}
              {program.format === "Transmission" && (
                <span className="text-[8px] font-black tracking-widest uppercase bg-current/10 px-1.5 rounded-sm">
                  Live
                </span>
              )}
              {(program.airingType === "Fresh" ||
                (program.isPrime && program.airingType !== "Repeat")) &&
                program.format !== "Movie" &&
                program.format !== "Transmission" && (
                  <span className="text-[8px] font-black tracking-widest uppercase bg-current/10 px-1.5 rounded-sm">
                    New
                  </span>
                )}
              {program.airingType === "Repeat" &&
                program.format !== "Movie" &&
                program.format !== "Transmission" && (
                  <span className="text-[8px] font-black tracking-widest uppercase bg-current/10 px-1.5 rounded-sm">
                    Repeat
                  </span>
                )}
            </div>
          </div>
          <h4 className="text-[11px] md:text-xs font-bold leading-tight line-clamp-2">
            {program.title}
          </h4>
        </>
      )}
    </div>
  );
}