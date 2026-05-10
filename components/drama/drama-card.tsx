"use client";

import React from "react";
import Image from "next/image";
import { Play, Eye } from "lucide-react";
import { Drama, formatViews, getMediaUrl, getStatusColor } from "@/lib/drama-types";
import { Badge } from "@/components/ui/badge";

interface DramaCardProps {
  drama: Drama;
  priority?: boolean;
  onClick?: () => void;
}

export function DramaCard({ drama, priority = false, onClick }: DramaCardProps) {
  const posterUrl = getMediaUrl(drama.poster_path);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={drama.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
            <Play size={24} fill="currentColor" />
          </div>
        </div>

        {/* Status badge */}
        {drama.status && (
          <Badge
            variant="outline"
            className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${getStatusColor(drama.status)}`}
          >
            {drama.status}
          </Badge>
        )}

        {/* View count */}
        {drama.views > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-bold text-white/90 bg-black/50 px-2 py-0.5 rounded-full">
            <Eye className="w-3 h-3" />
            {formatViews(drama.views)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-emerald-500 transition-colors">
          {drama.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
          {drama.format && <span>{drama.format}</span>}
          {drama.release_year && (
            <>
              <span className="text-border">·</span>
              <span>{drama.release_year}</span>
            </>
          )}
          {drama.channel_name && (
            <>
              <span className="text-border">·</span>
              <span className="truncate max-w-[80px]">{drama.channel_name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
