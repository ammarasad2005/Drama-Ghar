import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { DramaView } from '@/models/DramaView';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    
    // Increment the view count by 1 (upsert if it doesn't exist)
    const updatedView = await DramaView.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, views: updatedView.views });
  } catch (error) {
    console.error('Failed to update views:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
