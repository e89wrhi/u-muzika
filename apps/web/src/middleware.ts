// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

const locales = ['en', 'am'];

const AUTH_PAGES = ['/login', '/register', '/verify-2fa'];
const PROTECTED_PATHS = ['/me', '/settings'];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const requestId = crypto.randomUUID();

  const response = NextResponse.next();
  response.headers.set('x-request-uuid', requestId);

  // locale handling
  if (!req.cookies.get('NEXT_LOCALE')) {
    const acceptLanguage = req.headers.get('accept-language');
    const detectedLocale = acceptLanguage?.split(',')[0]?.split('-')[0] ?? 'en';

    response.cookies.set(
      'NEXT_LOCALE',
      locales.includes(detectedLocale) ? detectedLocale : 'en',
      {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }
    );
  }

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    await auth.protect();
  }

  const { userId } = await auth();

  if (userId && isAuthPage) {
    const dashboardUrl = new URL('/me', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
});

export const config = {
  matcher: ['/((?!_next/|api/auth/|api/webhooks/|.*\\..*).*)', '/api/:path*'],
};
