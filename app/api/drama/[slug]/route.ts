import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://grrffdnkupjmsgfdnzfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_HrDqnn2HRf38IZtvYF5V8g_b7C_4FOf";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 }
    );
  }

  try {
    const dramaParams = new URLSearchParams();
    dramaParams.set("select", "id,title,slug,poster_path,status,format,release_year,views,episode_count,description,director,channel_id,channel_name,schedule_days,schedule_time,genre,genre_list,ost_youtube_id,trailer_youtube_id");
    dramaParams.set("slug", `eq.${slug}`);
    dramaParams.set("is_active", "eq.true");
    dramaParams.set("limit", "1");

    const dramaRes = await fetch(`${SUPABASE_URL}/rest/v1/programs?${dramaParams.toString()}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!dramaRes.ok) {
      return NextResponse.json(
        { error: "Drama not found" },
        { status: 404 }
      );
    }

    const dramas = await dramaRes.json();
    if (!dramas || dramas.length === 0) {
      return NextResponse.json(
        { error: "Drama not found" },
        { status: 404 }
      );
    }

    const drama = dramas[0];

    const episodeParams = new URLSearchParams();
    episodeParams.set("select", "id,program_id,episode_number,title,youtube_id,video_url,air_date,created_at");
    episodeParams.set("program_id", `eq.${drama.id}`);
    episodeParams.set("order", "episode_number.desc");

    const episodeRes = await fetch(`${SUPABASE_URL}/rest/v1/episodes?${episodeParams.toString()}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    let episodes = [];
    if (episodeRes.ok) {
      episodes = await episodeRes.json();
    }

    let channel = null;
    if (drama.channel_id) {
      const channelParams = new URLSearchParams();
      channelParams.set("select", "id,name,slug,logo_path");
      channelParams.set("id", `eq.${drama.channel_id}`);
      channelParams.set("limit", "1");

      const channelRes = await fetch(`${SUPABASE_URL}/rest/v1/channels?${channelParams.toString()}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (channelRes.ok) {
        const channels = await channelRes.json();
        if (channels.length > 0) channel = channels[0];
      }
    }

    let cast = [];
    try {
      const castParams = new URLSearchParams();
      castParams.set("select", "role,character_name,actors(id,name,slug,image_path)");
      castParams.set("program_id", `eq.${drama.id}`);

      const castRes = await fetch(`${SUPABASE_URL}/rest/v1/program_cast?${castParams.toString()}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (castRes.ok) {
        const castData = await castRes.json();
        cast = castData.map((c: any) => ({
          id: c.actors?.id || "",
          name: c.actors?.name || "",
          slug: c.actors?.slug || "",
          photo_path: c.actors?.image_path || null,
          role: c.role || "",
          character_name: c.character_name || "",
        }));
      }
    } catch { }

    const result = {
      ...drama,
      episodes,
      channel,
      cast,
      airing_day: Array.isArray(drama.schedule_days) ? drama.schedule_days.join(", ") : (drama.schedule_days || null),
      airing_time: drama.schedule_time || null,
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[Drama API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drama details" },
      { status: 500 }
    );
  }
}
