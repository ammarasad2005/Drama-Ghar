'use client';
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Clock } from 'lucide-react';
import Image from 'next/image';

interface HistoryItem {
  _id: string;
  slug: string;
  title: string;
  episode: string;
  progress: number;
  image: string;
  lastWatched: string;
}

interface HistoryScreenProps {
  onNavigate: (tab: string) => void;
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (res.ok) {
        setHistory(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Watch History</h1>
          <p className="text-gray-500 text-sm">What you&apos;ve watched recently.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search history..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Clock className="w-12 h-12 mb-4 opacity-20" />
          <p>No history found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div key={item._id} className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-40">
                <Image 
                  src={item.image || 'https://picsum.photos/seed/drama/400/225'} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-neutral-800">
                  <div 
                    className="h-full bg-emerald-600" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{item.episode}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium uppercase">
                    {new Date(item.lastWatched).toLocaleDateString()}
                  </span>
                  <button className="text-emerald-700 dark:text-emerald-500 text-xs font-bold hover:underline">Resume</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
