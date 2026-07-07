import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Honeypots para atrapar bots/scanners
const HONEYPOTS = ['/admin-debug', '/wp-admin', '/.env', '/config.json'];

// In-memory rate limiting simple (Edge compatible - por isolate)
// Nota: En un entorno distribuido real, esto requeriría Redis (Vercel KV).
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 5; // 5 peticiones por minuto

export default function proxy(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Honeypot Isolation
  if (HONEYPOTS.includes(url)) {
    console.warn(`[SECURITY] Bot trap activado por IP: ${ip}`);
    return NextResponse.json({ status: 'admin_portal_locked' }, { status: 403 });
  }

  // Si es una petición a la API de mensajes
  if (url.startsWith('/api/messages')) {
    // 2. Strict Content-Type para POST
    if (req.method === 'POST' && req.headers.get('content-type') !== 'application/json') {
      return new NextResponse('Unsupported Media Type', { status: 415 });
    }

    // 3. WAF Ligero por Regex (Rechazar anomalías antes de procesar)
    // Buscamos patrones comunes de SQLi o XSS en la query string (GET)
    const queryParams = req.nextUrl.search;
    const maliciousPattern = /(sleep\s*\(|benchmark\s*\(|union\s+select|<script>|eval\s*\()/i;
    if (maliciousPattern.test(queryParams)) {
      console.warn(`[SECURITY] Payload malicioso bloqueado. IP: ${ip}`);
      return new NextResponse('Bad Request', { status: 400 });
    }

    // 4. Rate Limiting por IP
    if (req.method === 'POST') {
      const now = Date.now();
      const ipData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

      // Reiniciar si pasó la ventana
      if (now - ipData.timestamp > RATE_LIMIT_WINDOW) {
        ipData.count = 0;
        ipData.timestamp = now;
      }

      ipData.count += 1;
      rateLimitMap.set(ip, ipData);

      if (ipData.count > MAX_REQUESTS) {
        console.warn(`[SECURITY] Rate limit excedido para IP: ${ip}`);
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }
  }

  const response = NextResponse.next();
  
  // 5. Cookie Hardening (Ejemplo de cookie segura de sesión)
  response.cookies.set('sid', 'encrypted-payload-aead', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600 // 1 hora
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
