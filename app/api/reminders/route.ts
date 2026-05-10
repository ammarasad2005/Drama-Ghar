import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Reminder } from '@/models/Reminder';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await Reminder.find({ userId: session.userId }).sort({ createdAt: -1 });
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
