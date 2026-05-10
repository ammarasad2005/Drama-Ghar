"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EpgChannel, EpgProgram } from "@/lib/epg-types";
import { ProgramBlock } from "./program-block";

const SUPABASE_URL = "https://grrffdnkupjmsgfdnzfd.supabase.co";

interface ChannelRowProps {
  channel: EpgChannel;
  style: React.CSSProperties;
  timelineStartUTC: number;
  timeZone: string;
  onProgramClick: (program: EpgProgram) => void;
}

function getProgramStyle(
  startTime: string,
  endTime: string,
  timelineStartUTC: number
): React.CSSProperties {
  try {
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const leftOffset = Math.floor((startMs - timelineStartUTC) / 60000);
    const duration = Math.floor((endMs - startMs) / 60000);

    if (endMs <= timelineStartUTC || leftOffset >= 1440) {
      return { display: "none" };
    }

    return {
      left: `${2 * leftOffset}px`,
      width: `${2 * duration}px`,
    };
  } catch {
    return { display: "none" };
  }
}

export function ChannelRow({
  channel,
  style,
  timelineStartUTC,
  timeZone,
  onProgramClick,
}: ChannelRowProps) {
  const logoUrl = channel.logo_path
    ? channel.logo_path.startsWith("http") ||
      channel.logo_path.startsWith("/")
      ? channel.logo_path
      : `${SUPABASE_URL}/storage/v1/object/public/media/${channel.logo_path}`
    : null;

  const channelSlug = channel.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");

  return (
    <div
      style={{
        ...style,
        width: 2880 + (typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 160),
      }}
      className="relative border-b border-neutral-200 dark:border-neutral-800 flex items-center bg-transparent group"
    >
      {/* Sticky channel logo on the left */}
      <div
        className="absolute left-0 z-20 h-full flex items-center bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md border-r border-neutral-200 dark:border-neutral-800 shrink-0 w-[60px] md:w-[160px] justify-center md:justify-start md:pl-4 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)] dark:shadow-neutral-950/50"
        style={{
          transform: "translate3d(var(--scroll-x, 0px), 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="flex items-center gap-2 md:gap-3 w-full justify-center md:justify-start">
          <Link
            href={`/channel/${channelSlug}`}
            className="flex items-center gap-2 md:gap-3 w-full group/link"
            title={`View all ${channel.name} dramas`}
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 dark:brightness-90 dark:contrast-110 dark:opacity-90 group-hover/link:ring-2 group-hover/link:ring-primary transition-all">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={channel.name}
                  fill
                  unoptimized
                  className="object-contain p-1 shrink-0"
                  sizes="(max-width: 768px) 32px, 40px"
                />
              ) : (
                <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500">
                  {channel.name ? channel.name.slice(0, 2).toUpperCase() : "TV"}
                </span>
              )}
            </div>
            <span className="hidden md:block flex-1 min-w-0 text-[10px] md:text-xs font-semibold text-neutral-900 dark:text-neutral-50 leading-tight truncate group-hover/link:text-emerald-700 transition-colors">
              {channel.name}
            </span>
          </Link>
        </div>
      </div>

      {/* Timeline area with programs */}
      <div
        className="relative h-full bg-slate-50/50 shrink-0 min-w-0 ml-[60px] md:ml-[160px]"
        style={{
          width: "2880px",
          backgroundImage:
            "linear-gradient(to right, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "120px 100%",
          backgroundRepeat: "repeat-x",
        }}
      >
        {channel.programs
          .filter((program) => {
            const startMs = new Date(program.start_time_pkt).getTime();
            const endMs = new Date(program.end_time_pkt).getTime();
            return (
              endMs > timelineStartUTC &&
              1440 > Math.floor((startMs - timelineStartUTC) / 60000)
            );
          })
          .map((program, idx) => (
            <ProgramBlock
              key={`${program.id}-${idx}`}
              program={program}
              style={getProgramStyle(
                program.start_time_pkt,
                program.end_time_pkt,
                timelineStartUTC
              )}
              onClick={onProgramClick}
              timeZone={timeZone}
            />
          ))}
      </div>
    </div>
  );
}