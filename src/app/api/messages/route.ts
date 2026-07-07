import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messages = await db.getRecentMessages(9);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const trimmedContent = content.trim().substring(0, 1000); // limit to 1000 chars

    await db.addMessage(trimmedContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error posting message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
