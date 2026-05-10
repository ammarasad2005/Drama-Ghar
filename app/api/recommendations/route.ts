import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { History } from '@/models/History';
import { getSession } from '@/lib/auth';

const SUPABASE_URL = "https://grrffdnkupjmsgfdnzfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_HrDqnn2HRf38IZtvYF5V8g_b7C_4FOf";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    
    let watchedSlugs: string[] = [];
    let preferredChannel = null;

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (session) {
      const userHistory = await History.find({ userId: session.userId })
        .sort({ lastWatched: -1 })
        .limit(10);
        
      watchedSlugs = userHistory.map(h => h.slug);
      
      // Try to determine the preferred channel from the most recently watched drama
      if (watchedSlugs.length > 0) {
        const recentSlug = watchedSlugs[0];
        const recentRes = await fetch(`${SUPABASE_URL}/rest/v1/programs?select=channel_name&slug=eq.${recentSlug}&limit=1`, { headers });
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          if (recentData.length > 0) {
            preferredChannel = recentData[0].channel_name;
          }
        }
      }
    }

    let recommendations: any[] = [];
    
    // 1. Content-Based Fetch (if we have a preferred channel)
    if (preferredChannel) {
      const params = new URLSearchParams();
      params.set("select", "id,title,slug,poster_path,channel_name,schedule_time,views");
      params.set("channel_name", `eq.${preferredChannel}`);
      if (watchedSlugs.length > 0) {
        params.set("slug", `not.in.(${watchedSlugs.join(',')})`);
      }
      params.set("order", "views.desc");
      params.set("limit", "5");

      const recRes = await fetch(`${SUPABASE_URL}/rest/v1/programs?${params.toString()}`, { headers });
      if (recRes.ok) {
        recommendations = await recRes.json();
      }
    }

    // 2. Trending Fallback (if content-based returned less than 3, or cold start)
    if (!recommendations || recommendations.length < 3) {
      const fallbackParams = new URLSearchParams();
      fallbackParams.set("select", "id,title,slug,poster_path,channel_name,schedule_time,views");
      if (watchedSlugs.length > 0) {
         fallbackParams.set("slug", `not.in.(${watchedSlugs.join(',')})`);
      }
      fallbackParams.set("order", "views.desc");
      fallbackParams.set("limit", "10"); // fetch a bit more to ensure we have enough unique ones
      
      const fallbackRes = await fetch(`${SUPABASE_URL}/rest/v1/programs?${fallbackParams.toString()}`, { headers });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        
        // Merge uniquely
        const existingSlugs = new Set(recommendations.map((r: any) => r.slug));
        for (const r of fallbackData) {
          if (!existingSlugs.has(r.slug)) {
            recommendations.push(r);
            existingSlugs.add(r.slug);
          }
          if (recommendations.length >= 3) break;
        }
      }
    }

    // Format for frontend
    const formatted = recommendations.slice(0, 3).map((p: any) => ({
      slug: p.slug,
      title: p.title,
      channel: p.channel_name || 'DramaGhar',
      time: p.schedule_time || 'Any Time',
      image: p.poster_path ? `https://grrffdnkupjmsgfdnzfd.supabase.co/storage/v1/object/public/media/${p.poster_path}` : '/icon.png',
    }));

    return NextResponse.json({ items: formatted });

  } catch (error) {
    console.error('Recommendation API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
