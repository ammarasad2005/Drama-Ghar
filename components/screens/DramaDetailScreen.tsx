"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  Eye,
  Calendar,
  Tv,
  Clock,
  MonitorPlay,
  Loader2,
  Share2,
  Info,
  CalendarPlus,
  CheckCircle2,
} from "lucide-react";
import { DramaDetail, Episode, getMediaUrl, formatViews, getStatusColor } from "@/lib/drama-types";
import { EpisodeList } from "@/components/drama/episode-list";
import { VideoPlayerModal } from "@/components/drama/video-player-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface DramaDetailScreenProps {
  slug: string;
  onNavigate: (screen: string) => void;
  user: any;
}

export default function DramaDetailScreen({ slug, onNavigate, user }: DramaDetailScreenProps) {
  const [drama, setDrama] = useState<DramaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [isAddingToSchedule, setIsAddingToSchedule] = useState(false);
  const [isInSchedule, setIsInSchedule] = useState(false);

  // Fetch drama details
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/drama/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Drama not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDrama(data);
        // Check if in schedule
        checkSchedule(data.id);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load drama");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const checkSchedule = async (dramaId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) {
        const data = await res.json();
        const exists = data.some((item: any) => item.dramaId === dramaId);
        setIsInSchedule(exists);
      }
    } catch (err) {}
  };

  const handleToggleSchedule = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    if (!drama) return;

    setIsAddingToSchedule(true);
    try {
      const res = await fetch('/api/watchlist', {
        method: isInSchedule ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dramaId: drama.id,
          title: drama.title,
          slug: drama.slug,
          posterPath: drama.poster_path,
          channel: drama.channel?.name || drama.channel_name || 'DramaGhar',
          day: drama.airing_day || 'Any Day',
          time: drama.airing_time || 'Any Time'
        }),
      });

      if (res.ok) {
        setIsInSchedule(!isInSchedule);
      }
    } catch (err) {
      console.error("Failed to update schedule:", err);
    } finally {
      setIsAddingToSchedule(false);
    }
  };

  const handlePlayEpisode = useCallback((episode: Episode) => {
    setPlayingEpisode(episode);
    // Log history
    if (user && drama) {
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dramaId: drama.id,
          title: drama.title,
          slug: drama.slug,
          posterPath: drama.poster_path,
          episode: episode.episode_number,
          channel: drama.channel?.name || drama.channel_name
        }),
      });
    }
  }, [user, drama]);

  const handleTrackProgress = useCallback((seconds: number) => {
    if (!user || !drama || !playingEpisode) return;
    
    // Log duration increment
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: drama.slug,
        title: drama.title,
        episode: playingEpisode.episode_number.toString(),
        image: drama.poster_path,
        incrementMinutes: Math.ceil(seconds / 60),
        progress: 0 // We could calculate actual % if we had total duration
      }),
    });
  }, [user, drama, playingEpisode]);

  const handleClosePlayer = useCallback(() => {
    setPlayingEpisode(null);
  }, []);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: drama?.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }, [drama]);

  if (loading) return <DramaDetailSkeleton />;

  if (error || !drama) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <MonitorPlay className="w-10 h-10 text-red-200" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-[#2a1f0e]">Drama Not Found</h2>
          <p className="text-[#6b5530] font-medium max-w-xs">{error || "The drama you are looking for is not in our library."}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => onNavigate('explore')}
          className="rounded-xl border-[#d0c0a0] text-[#6b5530] font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Browse Library
        </Button>
      </div>
    );
  }

  const posterUrl = getMediaUrl(drama.poster_path);

  // Helper to extract YouTube ID
  const getExtractedYoutubeId = (episode: Episode | null) => {
    if (!episode) return null;
    if (episode.youtube_id) return episode.youtube_id;
    if (episode.video_url) {
      const match = episode.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto animate-in fade-in duration-700 pb-20">
      {/* Video Player Modal */}
      <VideoPlayerModal
        youtubeId={getExtractedYoutubeId(playingEpisode)}
        title={playingEpisode?.title || drama.title}
        onClose={handleClosePlayer}
        onProgress={handleTrackProgress}
      />

      {/* Hero section */}
      <div className="p-4 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 bg-white/40 border-b border-[#f0e6d0]">
        {/* Poster */}
        <div className="relative w-full md:w-72 lg:w-80 shrink-0 group">
          <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-muted shadow-2xl shadow-emerald-900/10 border-4 border-white transition-transform duration-500 group-hover:scale-[1.02]">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={drama.title}
                fill
                sizes="320px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f0e6d0]">
                <Play className="w-16 h-16 text-[#9a8060]/30" />
              </div>
            )}
            
            {/* Status absolute badge */}
            <div className="absolute top-4 left-4">
               {drama.status && (
                <Badge className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 shadow-lg ${getStatusColor(drama.status)}`}>
                  {drama.status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 flex-1 min-w-0 py-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded">
                {drama.format || 'Series'}
              </span>
              {drama.release_year && (
                <span className="text-[10px] font-black text-[#9a8060] uppercase tracking-[0.2em]">
                  · {drama.release_year}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#2a1f0e] tracking-tight leading-tight">
              {drama.title}
            </h1>
          </div>

          {/* Quick Meta */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {drama.channel && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#f0e6d0] p-1.5 shadow-sm">
                   <Tv className="w-full h-full text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-[#2a1f0e]">{drama.channel.name}</span>
              </div>
            )}
            {drama.airing_day && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-[#6b5530]">{drama.airing_day}{drama.airing_time ? ` at ${drama.airing_time}` : ""}</span>
              </div>
            )}
            {drama.views > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#9a8060]" />
                <span className="text-sm font-bold text-[#6b5530]">{formatViews(drama.views)} views</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Button
              onClick={() => drama.episodes?.length > 0 && handlePlayEpisode(drama.episodes[0])}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl shadow-lg shadow-emerald-600/20 gap-2 transition-all active:scale-95"
              disabled={!drama.episodes || drama.episodes.length === 0}
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Now
            </Button>
            
            <Button
              variant="outline"
              onClick={handleToggleSchedule}
              disabled={isAddingToSchedule}
              className={`h-12 px-6 rounded-xl font-bold border-[#d0c0a0] gap-2 transition-all ${isInSchedule ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-[#fcfaf5] text-[#6b5530]'}`}
            >
              {isAddingToSchedule ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isInSchedule ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <CalendarPlus className="w-4 h-4" />
              )}
              {isInSchedule ? 'In My Schedule' : 'Add to Schedule'}
            </Button>

            <Button variant="outline" onClick={handleShare} className="w-12 h-12 rounded-xl p-0 border-[#d0c0a0] bg-white text-[#9a8060] hover:text-[#2a1f0e]">
              <Share2 size={18} />
            </Button>
          </div>

          {/* Synopsis */}
          {(drama.synopsis || drama.description) && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#9a8060] uppercase tracking-[0.2em]">Synopsis</span>
              </div>
              <p className={`text-sm text-[#6b5530] font-medium leading-relaxed max-w-3xl ${!showFullSynopsis ? "line-clamp-3" : ""}`}>
                {drama.synopsis || drama.description}
              </p>
              {(drama.synopsis || drama.description || "").length > 220 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="text-xs text-emerald-600 font-bold hover:underline self-start transition-all"
                >
                  {showFullSynopsis ? "Collapse description" : "Read full synopsis"}
                </button>
              )}
            </div>
          )}

          {/* Cast */}
          {drama.cast && drama.cast.length > 0 && (
            <div className="flex flex-col gap-3 mt-2">
               <span className="text-[10px] font-black text-[#9a8060] uppercase tracking-[0.2em]">Main Cast</span>
              <div className="flex flex-wrap gap-2">
                {drama.cast.map((actor) => (
                  <Badge key={actor.id} variant="outline" className="bg-white/50 border-[#d0c0a0] text-[#2a1f0e] font-bold py-1.5 px-4 rounded-full text-xs">
                    {actor.name}
                    {actor.character_name && (
                      <span className="text-[#9a8060] font-medium ml-1.5">as {actor.character_name}</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Episodes Section */}
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <EpisodeList
            episodes={drama.episodes || []}
            onPlayEpisode={handlePlayEpisode}
            playingEpisodeId={playingEpisode?.id}
          />
        </div>
      </div>

      {/* OST section if exists */}
      {drama.ost_youtube_id && (
        <div className="px-4 md:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <Separator className="my-10 bg-[#f0e6d0]" />
            <h3 className="text-xl font-black text-[#2a1f0e] mb-6 flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-emerald-600" />
              Official Soundtrack
            </h3>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white">
              <iframe
                src={`https://www.youtube.com/embed/${drama.ost_youtube_id}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${drama.title} OST`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DramaDetailSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="p-8 flex flex-col md:flex-row gap-8 bg-white/40">
        <Skeleton className="w-full md:w-80 aspect-[2/3] rounded-3xl bg-[#f0e6d0]" />
        <div className="flex flex-col gap-6 flex-1 py-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="w-24 h-4 bg-[#f0e6d0]" />
            <Skeleton className="w-3/4 h-12 bg-[#f0e6d0]" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="w-32 h-12 rounded-xl bg-[#f0e6d0]" />
            <Skeleton className="w-32 h-12 rounded-xl bg-[#f0e6d0]" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-4 bg-[#f0e6d0]" />
            <Skeleton className="w-full h-4 bg-[#f0e6d0]" />
            <Skeleton className="w-2/3 h-4 bg-[#f0e6d0]" />
          </div>
        </div>
      </div>
    </div>
  );
}
