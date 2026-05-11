"use client";

import React from "react";
import Image from "next/image";
import { Play, Clock, MonitorPlay } from "lucide-react";
import { Episode, getYoutubeThumbnail } from "@/lib/drama-types";
import { cn } from "@/lib/utils";

interface EpisodeListProps {
  episodes: Episode[];
  onPlayEpisode: (episode: Episode) => void;
  playingEpisodeId?: string | null;
}

export function EpisodeList({ episodes, onPlayEpisode, playingEpisodeId }: EpisodeListProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <MonitorPlay className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-semibold">No Episodes Available</p>
        <p className="text-sm">Episodes will appear here when they become available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Episodes
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({episodes.length})
        </span>
      </h3>

      <div className="grid gap-3">
        {episodes.map((episode) => {
          const thumbnailUrl = getYoutubeThumbnail(episode.youtube_id);
          const isPlaying = playingEpisodeId === episode.id;

          return (
            <button
              key={episode.id}
              onClick={() => onPlayEpisode(episode)}
              className={cn(
                "flex items-center gap-4 p-2 rounded-xl transition-all duration-200 text-left group",
                "hover:bg-accent/50 border border-transparent",
                isPlaying && "bg-emerald-500/10 border-emerald-500/30"
              )}
            >
              {/* Thumbnail */}
              <div className="relative w-32 sm:w-40 md:w-48 aspect-video rounded-lg overflow-hidden shrink-0 bg-muted">
                <Image
                  src={thumbnailUrl}
                  alt={episode.title}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
                {/* Play overlay */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-200",
                  isPlaying ? "bg-black/40" : "bg-black/0 group-hover:bg-black/40"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isPlaying
                      ? "bg-emerald-500 scale-100"
                      : "bg-white/90 scale-75 group-hover:scale-100"
                  )}>
                    <Play className={cn(
                      "w-4 h-4 ml-0.5",
                      isPlaying ? "text-white" : "text-black"
                    )} fill="currentColor" />
                  </div>
                </div>

                {/* Episode number badge */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-bold text-white">
                  Ep {episode.episode_number}
                </div>

                {/* Now playing indicator */}
                {isPlaying && (
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-emerald-500 rounded text-[10px] font-bold text-white flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Playing
                  </div>
                )}
              </div>

              {/* Episode info */}
              <div className="flex flex-col gap-1 min-w-0 py-1">
                <p className={cn(
                  "text-sm sm:text-base font-bold line-clamp-2 leading-tight",
                  isPlaying ? "text-emerald-500" : "text-foreground"
                )}>
                  {episode.title || `Episode ${episode.episode_number}`}
                </p>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Ep {episode.episode_number}
                  </span>
                  {episode.created_at && (
                    <>
                      <span className="text-border">·</span>
                      <span>
                        {new Date(episode.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
