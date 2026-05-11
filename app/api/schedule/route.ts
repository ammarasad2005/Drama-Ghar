import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.pakdrama.pk/api/web-schedule?date=${date}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    let channels;
    if (data?.data?.result && typeof data.data.result === "string") {
      channels = JSON.parse(data.data.result);
    } else if (Array.isArray(data)) {
      channels = data;
    } else if (data?.data && typeof data.data === "object") {
      channels = Array.isArray(data.data) ? data.data : null;
    }

    if (!Array.isArray(channels)) {
      return NextResponse.json({ error: "Failed to parse schedule data" }, { status: 502 });
    }

    return NextResponse.json(channels);
  } catch (error: any) {
    console.error('API proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}
