import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://grrffdnkupjmsgfdnzfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_HrDqnn2HRf38IZtvYF5V8g_b7C_4FOf";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "24");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const format = searchParams.get("format") || "";

  const offset = (page - 1) * limit;

  try {
    const params = new URLSearchParams();
    params.set("select", "id,title,slug,poster_path,status,format,release_year,views,episode_count,channel_name,schedule_days,schedule_time");
    // Note: We intentionally do NOT filter by is_active because many dramas
    // with episodes (like Pehli Barish) have is_active=false in Supabase
    // but are still valid and visible on the original pakdrama.pk site
    params.set("order", "views.desc");
    params.set("offset", offset.toString());
    params.set("limit", limit.toString());

    if (search) {
      params.set("title", `ilike.*${search}*`);
    }
    if (status) {
      params.set("status", `eq.${status}`);
    }
    if (format) {
      params.set("format", `eq.${format}`);
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/programs?${params.toString()}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "count=exact",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Dramas API] Supabase returned:", res.status, errText);
      return NextResponse.json(
        { error: `Upstream API returned ${res.status}` },
        { status: res.status }
      );
    }

    const dramas = await res.json();
    const contentRange = res.headers.get("content-range");
    const total = contentRange ? parseInt(contentRange.split("/")[1] || "0") : dramas.length;

    return NextResponse.json(
      { dramas, total, page, limit },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Dramas API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dramas" },
      { status: 500 }
    );
  }
}
