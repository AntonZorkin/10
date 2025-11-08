import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up']; 

const PROTECTED_ROUTE_PREFIX = '/profile';

export function middleware(request: NextRequest) {

  const token = request.cookies.get('accessToken')?.value; 
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  const isProtected = pathname.startsWith(PROTECTED_ROUTE_PREFIX); 

  // --- Сценарій 1: Користувач НЕ АВТОРИЗОВАНИЙ (token відсутній) ---
  if (!token) {
    if (isProtected) {
      // 1a. Якщо токена немає і запит на захищений маршрут -> перенаправляємо на вхід.
      // Цей редірект запобігає спробі завантажити захищений компонент без токена.
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    // 1b. Для публічних сторінок (sign-in, sign-up, /) дозволяємо доступ.
    return NextResponse.next();
  }
  
  // --- Сценарій 2: Користувач АВТОРИЗОВАНИЙ (token присутній) ---
  if (token) {
    if (isPublic && pathname !== '/') { // Виключаємо корінь '/' з авто-перенаправлення, якщо це не потрібно
      // 2a. Якщо користувач авторизований, і він намагається зайти на /sign-in або /sign-up,
      // перенаправляємо його на /profile.
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    // 2b. Якщо токен є і це захищений маршрут (або корінь), дозволяємо доступ.
    return NextResponse.next();
  }

  // Запасний варіант (не має бути досягнутий)
  return NextResponse.next();
}

// Конфігурація для того, щоб Middleware обробляв усі маршрути, 
// крім статичних файлів та API.
export const config = {
  matcher: [
    // Включає всі маршрути, окрім статичних ресурсів, _next, favicon.ico та /api
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webmanifest|css|js)$).*)',
  ],
};