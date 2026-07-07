import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const lastActivity = await db.getLastActivity();
    
    if (!lastActivity) {
      return NextResponse.json({ error: 'System state not found' }, { status: 500 });
    }

    const lastActivityDate = new Date(lastActivity);
    const now = new Date();
    
    // 24 hours in ms = 24 * 60 * 60 * 1000 = 86400000
    const TIME_LIMIT = 86400000;
    
    const timePassed = now.getTime() - lastActivityDate.getTime();
    const timeRemaining = Math.max(0, TIME_LIMIT - timePassed);

    // If time has expired, self destruct!
    if (timeRemaining <= 0) {
      await db.clearMessagesAndResetTimer();
      
      return NextResponse.json({
        timeRemaining: TIME_LIMIT,
        destructed: true,
      });
    }

    return NextResponse.json({
      timeRemaining,
      destructed: false,
    });
  } catch (error) {
    console.error('API State Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
