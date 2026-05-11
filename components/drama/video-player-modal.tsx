"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { X, RotateCcw, Loader2 } from "lucide-react";

interface VideoPlayerModalProps {
  youtubeId: string | null;
  title?: string;
  onClose: () => void;
  onProgress?: (seconds: number) => void;
}

export function VideoPlayerModal({ youtubeId, title, onClose, onProgress }: VideoPlayerModalProps) {
  const [showRotateHint, setShowRotateHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const lastLoggedTimeRef = useRef<number>(0);

  // Check if mobile and in portrait mode
  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
        setShowRotateHint(true);
        const timer = setTimeout(() => setShowRotateHint(false), 5000);
        return () => clearTimeout(timer);
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Periodic progress tracking
  useEffect(() => {
    if (!onProgress || !youtubeId) return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === 1) { // 1 = playing
        const currentTime = Math.floor(playerRef.current.getCurrentTime());
        // Log every 30 seconds or so
        if (currentTime - lastLoggedTimeRef.current >= 30) {
          onProgress(30); // Report 30 seconds watched
          lastLoggedTimeRef.current = currentTime;
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onProgress, youtubeId]);

  if (!youtubeId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* Click-away backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close video player"
      />

      {/* Player container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md border border-white/10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* YouTube Player */}
        <YouTube
          videoId={youtubeId}
          onReady={(event) => {
            playerRef.current = event.target;
            setIsLoading(false);
          }}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
            },
          }}
          className="w-full h-full"
          iframeClassName="w-full h-full border-0"
          title={title || "Video Player"}
        />

        {/* Rotate hint for mobile */}
        {showRotateHint && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-emerald-500/90 rounded-full text-white text-sm font-bold shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-500 backdrop-blur-sm">
            <RotateCcw className="w-4 h-4" />
            Rotate for Full Screen
          </div>
        )}
      </div>
    </div>
  );
}
