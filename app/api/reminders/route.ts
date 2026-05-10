import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Reminder } from '@/models/Reminder';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await Reminder.find({ userId: session.userId }).sort({ createdAt: -1 });

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

    const { slug, title, time, channel, image } = await req.json();

    const item = await Reminder.findOneAndUpdate(
      { userId: session.userId, slug },
      { title, time, channel, image },
      { upsert: true, new: true }
    );

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    await Reminder.deleteOne({ userId: session.userId, slug });
    return NextResponse.json({ message: 'Reminder removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
