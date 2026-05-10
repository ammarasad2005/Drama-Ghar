import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Watchlist } from '@/models/Watchlist';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await Watchlist.find({ userId: session.userId }).sort({ createdAt: -1 });
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

    const { slug, title } = await req.json();

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    // Upsert or just create, but handle unique constraint
    try {
      const item = await Watchlist.create({
        userId: session.userId,
        slug,
        title,
      });
      return NextResponse.json({ item });
    } catch (dbError: any) {
      if (dbError.code === 11000) {
        return NextResponse.json({ error: 'Already in watchlist' }, { status: 400 });
      }
      throw dbError;
    }
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

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await Watchlist.deleteOne({ userId: session.userId, slug });
    return NextResponse.json({ message: 'Removed from watchlist' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
