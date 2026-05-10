/**
 * EPG (Electronic Program Guide) data types
 * Matches the API response from pakdrama.pk/api/web-schedule
 */

export interface EpgProgram {
  id: string;
  title: string;
  slug: string;
  start_time_pkt: string; // ISO 8601 with +05:00 offset
  end_time_pkt: string;
  isPrime: boolean;
  airingType: "Repeat" | "PrimeTime" | "Fresh";
  poster_path: string | null;
  status: "Ongoing" | "On Air" | "Ended";
  schedule_time: string; // e.g. "8:00 PM"
  format?: string; // Optional: "Movie", "Transmission", "Game Show"
}

export interface EpgChannel {
  id: string;
  name: string;
  logo_path: string | null;
  programs: EpgProgram[];
}

export interface EpgData {
  [channelId: string]: EpgChannel;
}

export interface EpgCache {
  [dateKey: string]: EpgData;
}