'use client';
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Clock, TrendingUp, Calendar, ArrowRight, BarChart3, Play } from 'lucide-react';
import Image from 'next/image';

interface HistoryItem {
  _id: string;
  slug: string;
  title: string;
  episode: string;
  progress: number;
  image: string;
  lastWatched: string;
  watchDurationMinutes: number;
}

interface HistoryScreenProps {
  onNavigate: (screen: string, params?: any) => void;
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

  const calculateAnalytics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const lastWeek = oneWeekAgo.getTime();

    let todayMinutes = 0;
    let weekMinutes = 0;
    let totalMinutes = 0;

    history.forEach(item => {
      const watchDate = new Date(item.lastWatched).getTime();
      const mins = item.watchDurationMinutes || 0;
      
      totalMinutes += mins;
      if (watchDate >= today) todayMinutes += mins;
      if (watchDate >= lastWeek) weekMinutes += mins;
    });

    return {
      today: (todayMinutes / 60).toFixed(1),
      week: (weekMinutes / 60).toFixed(1),
      total: (totalMinutes / 60).toFixed(1)
    };
  };

  const analytics = calculateAnalytics();

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
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 bg-white dark:bg-[#0a0a0a]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Watch History</h1>
          <p className="text-gray-500 text-sm">Quantitative tracking of your drama viewing.</p>
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

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
               <Clock size={16} className="text-emerald-700 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-900 dark:text-white">{analytics.today} <span className="text-sm font-bold text-emerald-700/60 uppercase">Hrs</span></div>
          <p className="text-[10px] font-bold text-emerald-700/60 uppercase mt-1">Daily Consumption</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Weekly</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
               <TrendingUp size={16} className="text-amber-700 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900 dark:text-white">{analytics.week} <span className="text-sm font-bold text-amber-700/60 uppercase">Hrs</span></div>
          <p className="text-[10px] font-bold text-amber-700/60 uppercase mt-1">Weekly Trends</p>
        </div>

        <div className="bg-[#fcfaf5] dark:bg-white/5 p-5 rounded-2xl border border-[#f0e6d0] dark:border-white/10 flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-[#9a8060] uppercase tracking-widest">Total Progress</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0e6d0] dark:bg-white/10 flex items-center justify-center">
               <BarChart3 size={16} className="text-[#9a8060]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#2a1f0e] dark:text-white">{analytics.total} <span className="text-sm font-bold text-[#9a8060] uppercase">Hrs</span></div>
          <p className="text-[10px] font-bold text-[#9a8060] uppercase mt-1">Lifetime Watched</p>
        </div>
      </div>

      <h2 className="text-sm font-black text-[#2a1f0e] dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Calendar size={14} className="text-emerald-600" />
        Recently Watched
      </h2>

      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
          <Clock className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-gray-500 font-medium">No watch history yet. Start exploring dramas!</p>
          <button 
            onClick={() => onNavigate('explore')}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20"
          >
            Browse Library
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div 
              key={item._id} 
              onClick={() => onNavigate('drama', { slug: item.slug })}
              className="group flex items-center gap-4 p-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] hover:border-emerald-200 dark:hover:border-emerald-900/30 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                {item.image ? (
                  <img src={item.image.startsWith('http') ? item.image : `https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/${item.image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <Play size={14} fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Episode {item.episode}</span>
                  <span className="text-[10px] font-bold text-gray-400">·</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(item.lastWatched).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase">WATCHED {item.watchDurationMinutes || 0}m</span>
                </div>
              </div>

              <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all mr-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

