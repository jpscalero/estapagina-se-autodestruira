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
    const { content, mathAnswer, num1, num2, honeypot } = await request.json();

    // 1. Honeypot check (Bots often fill hidden fields)
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ error: 'Bot detectado por Honeypot' }, { status: 403 });
    }

    // 2. Math Captcha check
    if (!mathAnswer || isNaN(Number(mathAnswer))) {
      return NextResponse.json({ error: 'Falta validación del CAPTCHA matemático' }, { status: 400 });
    }
    
    if (Number(mathAnswer) !== Number(num1) + Number(num2)) {
      return NextResponse.json({ error: 'El resultado de la suma es incorrecto' }, { status: 403 });
    }

    // 3. Content check
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
    }

    const trimmedContent = content.trim().substring(0, 1000); // limit to 1000 chars

    await db.addMessage(trimmedContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error posting message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
