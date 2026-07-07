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
    const { content, turnstileToken } = await request.json();

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Falta validación CAPTCHA' }, { status: 403 });
    }

    // Verify Turnstile token with Cloudflare API
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Dummy key as fallback
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', turnstileToken);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    
    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json({ error: 'Validación CAPTCHA fallida' }, { status: 403 });
    }

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
