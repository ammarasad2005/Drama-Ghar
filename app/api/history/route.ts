import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { History } from '@/models/History';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await History.find({ userId: session.userId }).sort({ lastWatched: -1 });
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

    const { slug, title, episode, progress, image } = await req.json();

    const item = await History.findOneAndUpdate(
      { userId: session.userId, slug, episode },
      { title, progress, image, lastWatched: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
