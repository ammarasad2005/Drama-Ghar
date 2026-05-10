import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { History } from '@/models/History';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await History.find({ userId: session.userId }).sort({ lastWatched: -1 });

    if (items.length > 0) {
      const slugs = Array.from(new Set(items.map(i => i.slug)));
      const supabaseUrl = "https://grrffdnkupjmsgfdnzfd.supabase.co";
      const supabaseKey = "sb_publishable_HrDqnn2HRf38IZtvYF5V8g_b7C_4FOf";
      
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/programs?select=slug,poster_path&slug=in.(${slugs.join(',')})`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
        });
        
        if (res.ok) {
          const programs = await res.json();
          const imageMap = new Map(programs.map((p: any) => [p.slug, p.poster_path]));
          
          const updatedItems = items.map(item => {
            const realImage = imageMap.get(item.slug);
            let finalImage: any = realImage || item.image;
            if (typeof finalImage === 'string' && finalImage.includes('picsum.photos')) {
              finalImage = null; // Clean stale placeholders
            }
            return {
              ...item.toObject(),
              image: finalImage
            };
          });
          
          return NextResponse.json({ items: updatedItems });
        }
      } catch (err) {
        console.error("Failed to fetch fresh images from Supabase", err);
      }
    }

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, title, episode, progress, image, incrementMinutes } = await req.json();

    const update: any = { title, progress, image, lastWatched: new Date() };
    if (incrementMinutes) {
      update.$inc = { watchDurationMinutes: incrementMinutes };
    }

    const item = await History.findOneAndUpdate(
      { userId: session.userId, slug, episode },
      update,
      { upsert: true, new: true }
    );

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
