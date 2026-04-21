import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'am'];

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestId = crypto.randomUUID();

  // bad response when no redirect
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

  return response;
}

export const config = {
  matcher: ['/((?!api/auth|_next|favicon.ico|robots.txt).*)'],
};
