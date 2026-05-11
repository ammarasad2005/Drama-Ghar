"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, Tv, Film, Clapperboard, Loader2, ArrowLeft } from "lucide-react";
import { DramaCard } from "@/components/drama/drama-card";
import { Drama } from "@/lib/drama-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FORMAT_FILTERS = [
  { label: "All", value: "", icon: Tv },
  { label: "Drama", value: "Drama", icon: Clapperboard },
  { label: "Movie", value: "Movie", icon: Film },
];

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Ongoing", value: "Ongoing" },
  { label: "On Air", value: "On Air" },
  { label: "Ended", value: "Ended" },
];

interface ExploreScreenProps {
  onNavigate: (screen: string, params?: Record<string, string>) => void;
}

export default function ExploreScreen({ onNavigate }: ExploreScreenProps) {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const limit = 24;
  const hasMore = dramas.length < total;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch dramas
  const fetchDramas = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams();
        params.set("page", pageNum.toString());
        params.set("limit", limit.toString());
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (formatFilter) params.set("format", formatFilter);
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/dramas?${params.toString()}`);
        const data = await res.json();

        if (reset) {
          setDramas(data.dramas || []);
        } else {
          setDramas((prev) => [...prev, ...(data.dramas || [])]);
        }

        setTotal(data.total || 0);
      } catch (err) {
        console.error("[Explore] Fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, formatFilter, statusFilter]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchDramas(1, true);
  }, [fetchDramas]);

  // Load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDramas(nextPage, false);
  };

  const clearFilters = () => {
    setSearch("");
    setFormatFilter("");
    setStatusFilter("");
  };

  const hasActiveFilters = search || formatFilter || statusFilter;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-1">
          <Clapperboard size={14} />
          Discover
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[#2a1f0e] tracking-tight">
          Explore Dramas
        </h1>
        <p className="text-sm md:text-base text-[#6b5530] font-medium max-w-2xl leading-snug">
          Discover the vast catalog of Pakistani dramas, watch every episode, and stay updated with your favorite shows.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a8060] group-focus-within:text-emerald-600 transition-colors" />
          <Input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white/50 border-[#d0c0a0] focus:ring-emerald-500 focus:border-emerald-500 rounded-xl transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a8060] hover:text-[#2a1f0e]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-11 gap-2 rounded-xl border-[#d0c0a0] font-bold ${showFilters ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white/50 text-[#6b5530]'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-[#d0c0a0] shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-[#f0e6d0] pb-3">
            <span className="text-sm font-black text-[#2a1f0e] uppercase tracking-widest">Active Filters</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-emerald-600 font-bold hover:text-emerald-700 underline underline-offset-4 transition-all">
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Format filter */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-[#9a8060] uppercase tracking-[0.2em]">Format</span>
              <div className="flex flex-wrap gap-2">
                {FORMAT_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setFormatFilter(f.value);
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      formatFilter === f.value
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                        : "bg-[#f0e6d0] text-[#6b5530] hover:bg-emerald-100 hover:text-emerald-700"
                    }`}
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-[#9a8060] uppercase tracking-[0.2em]">Status</span>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setStatusFilter(s.value);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      statusFilter === s.value
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                        : "bg-[#f0e6d0] text-[#6b5530] hover:bg-emerald-100 hover:text-emerald-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white/30 rounded-3xl border border-dashed border-[#d0c0a0]">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#6b5530] font-black uppercase tracking-widest">Searching library...</p>
        </div>
      ) : dramas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/30 rounded-3xl border border-dashed border-[#d0c0a0]">
          <Search className="w-16 h-16 mb-4 text-[#9a8060] opacity-20" />
          <p className="text-xl font-bold text-[#2a1f0e]">No Dramas Found</p>
          <p className="text-sm text-[#6b5530] mt-1">Try adjusting your keywords or filters.</p>
          <Button variant="link" onClick={clearFilters} className="mt-4 text-emerald-600 font-bold">
            Clear all filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {dramas.map((drama, i) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                priority={i < 12}
                onClick={() => onNavigate('drama', { slug: drama.slug })}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-8 pb-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="gap-2 min-w-[240px] h-12 rounded-xl border-[#d0c0a0] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 hover:text-white transition-all shadow-md"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Show more (${total - dramas.length} remaining)`
                )}
              </Button>
            </div>
          )}

          {/* Results count */}
          <div className="text-center text-[10px] font-black text-[#9a8060] uppercase tracking-[0.2em] border-t border-[#f0e6d0] pt-6 mb-8">
            Showing {dramas.length} of {total} titles in library
          </div>
        </>
      )}
    </div>
  );
}
