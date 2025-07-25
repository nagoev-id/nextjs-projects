import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting (for production use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 100; // requests per window
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function rateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);
  
  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.resetTime < now) {
    // Reset the window
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('X-Forwarded-For') || 
            request.headers.get('X-Real-IP') || 
            request.headers.get('CF-Connecting-IP') || 
            'unknown';

  // Security headers for all requests
  const response = NextResponse.next();

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
        },
      });
    }

    // Add rate limit headers to successful requests
    const current = rateLimitMap.get(ip);
    if (current) {
      response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
      response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX - current.count).toString());
      response.headers.set('X-RateLimit-Reset', new Date(current.resetTime).toISOString());
    }
  }

  // Block suspicious patterns
  const suspiciousPatterns = [
    /\.\./,                    // Path traversal
    /[<>\"']/,                 // Potential XSS
    /union.*select/i,          // SQL injection
    /javascript:/i,            // JavaScript protocol
    /data:.*base64/i,          // Base64 data URLs
    /vbscript:/i,              // VBScript protocol
  ];

  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';

  if (suspiciousPatterns.some(pattern => pattern.test(url) || pattern.test(userAgent))) {
    console.warn(`Blocked suspicious request from ${ip}: ${url}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Remove server information
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 