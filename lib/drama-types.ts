/**
 * Drama data types
 * Matches the data from pakdrama.pk's Supabase API
 */

export interface Drama {
  id: string;
  title: string;
  slug: string;
  poster_path: string | null;
  status: "Ongoing" | "On Air" | "Ended" | "Upcoming" | "Completed" | string;
  format: string; // "Drama", "Movie", "Game Show", etc.
  release_year: number | null;
  views: number;
  episode_count: number;
  channel_name?: string;
  channel_slug?: string;
  schedule_days?: string;
  schedule_time?: string;
  description?: string;
  director?: string;
  cast?: DramaCast[];
  genre?: string[];
  genre_list?: string[];
}

export interface DramaCast {
  id: string;
  name: string;
  slug: string;
  photo_path: string | null;
  role?: string;
  character_name?: string;
}

export interface Episode {
  id: string;
  program_id: string;
  episode_number: number;
  title: string;
  youtube_id: string;
  video_url: string;
  created_at: string;
  thumbnail_url?: string;
}

export interface DramaDetail extends Drama {
  episodes: Episode[];
  description?: string;
  synopsis?: string;
  ost_youtube_id?: string;
  trailer_youtube_id?: string;
  airing_day?: string;
  airing_time?: string;
  channel?: {
    id: string;
    name: string;
    slug: string;
    logo_path: string | null;
  };
}

export interface ExploreResponse {
  dramas: Drama[];
  total: number;
}

/**
 * Build a Supabase Storage URL for media assets
 */
export function getMediaUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/${path}`;
}

/**
 * Build YouTube thumbnail URL from video ID
 */
export function getYoutubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

/**
 * Build YouTube thumbnail URL (high quality)
 */
export function getYoutubeThumbnailHQ(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Format view count for display
 */
export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "Ongoing":
    case "On Air":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "Ended":
      return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
    case "Upcoming":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    default:
      return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  }
}
