import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name } = await req.json().catch(() => ({ name: null }));
    const guestName = name || 'Guest Explorer';
    
    // Generate a valid transient ObjectId for the guest
    const guestId = new mongoose.Types.ObjectId().toHexString();
    const guestEmail = `guest_${guestId.substring(0, 8)}@dramaghar.local`;
    
    // Create a session that mimics a user but is flagged as a guest
    await createSession({
      userId: guestId,
      email: guestEmail,
      role: 'user', // Treat them as a regular user for DB schema compatibility
      name: guestName,
      isGuest: true,
    }, true); // Remember guest by default so they don't lose data immediately

    return NextResponse.json({ 
      message: 'Logged in as guest successfully', 
      user: { 
        email: guestEmail, 
        role: 'user', 
        name: guestName,
        isGuest: true
      } 
    });
  } catch (error: any) {
    console.error('Guest login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
