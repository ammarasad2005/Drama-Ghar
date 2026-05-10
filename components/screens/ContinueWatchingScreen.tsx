'use client';
import React, { useState, useEffect } from 'react';
import { Play, MoreVertical, Loader2, PlayCircle } from 'lucide-react';
import Image from 'next/image';

interface HistoryItem {
  _id: string;
  slug: string;
  title: string;
  episode: string;
  progress: number;
  image: string;
}

interface ContinueWatchingScreenProps {
  onNavigate: (tab: string) => void;
}

export function ContinueWatchingScreen({ onNavigate }: ContinueWatchingScreenProps) {
  const [content, setContent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContinueWatching = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (res.ok) {
        // Show items that are not completed (progress < 100)
        const incomplete = (data.items || []).filter((item: HistoryItem) => item.progress < 100);
        setContent(incomplete);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContinueWatching();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Continue Watching</h1>
        <p className="text-gray-500 text-sm">Pick up right where you left off.</p>
      </div>

      {content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <PlayCircle className="w-12 h-12 mb-4 opacity-20" />
          <p>No dramas to continue watching.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {content.map((item) => (
            <div key={item._id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row h-auto sm:h-40 group cursor-pointer">
              <div className="w-full sm:w-40 h-40 sm:h-auto relative flex-shrink-0 bg-gray-100 dark:bg-neutral-800">
                <Image src={item.image || 'https://picsum.photos/seed/drama/400/250'} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-0">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-emerald-700 pl-1">
                    <Play className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 lg:p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg line-clamp-1">{item.title}</h3>
                  <button className="text-gray-400 hover:text-gray-600 shrink-0 ml-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-500 mb-4 sm:mb-auto">{item.episode}</p>
                
                <div className="mt-auto sm:mt-4">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs mb-2">
                    <span className="font-semibold text-gray-700 dark:text-slate-300">{item.progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
