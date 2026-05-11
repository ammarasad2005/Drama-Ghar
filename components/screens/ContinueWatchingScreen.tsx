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
  onNavigate: (screen: string, params?: any) => void;
}

export function ContinueWatchingScreen({ onNavigate }: ContinueWatchingScreenProps) {
  const [content, setContent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContinueWatching = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (res.ok) {
        // Show all items as "Resume"
        setContent(data.items || []);
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
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 bg-white dark:bg-[#0a0a0a]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Continue Watching</h1>
        <p className="text-gray-500 text-sm font-medium">Pick up right where you left off.</p>
      </div>

      {content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <PlayCircle className="w-12 h-12 mb-4 opacity-20" />
          <p>No dramas to continue watching.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {content.map((item) => (
            <div 
              key={item._id} 
              onClick={() => onNavigate('drama', { slug: item.slug })}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row h-auto sm:h-44 group cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800"
            >
              <div className="w-full sm:w-44 h-40 sm:h-auto relative flex-shrink-0 bg-gray-100 dark:bg-neutral-800">
                <Image src={item.image ? (item.image.startsWith('http') ? item.image : `https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/${item.image}`) : 'https://picsum.photos/seed/drama/400/250'} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 lg:p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg line-clamp-2 pr-4">{item.title}</h3>
                  <button className="text-gray-400 hover:text-gray-600 shrink-0">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-500 mb-4 sm:mb-auto">Episode {item.episode}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs mb-2">
                    <span className="font-black text-[#9a8060] uppercase tracking-widest">Resume Watching</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: `100%` }}></div>
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
