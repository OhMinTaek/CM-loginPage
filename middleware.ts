import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // /profile 페이지 접근 시 로그인 체크
  if (request.nextUrl.pathname === '/profile') {
    if (!session.user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 이미 로그인한 사용자가 /login 또는 /create-account 페이지 접근 시
  if (['/login', '/create-account'].includes(request.nextUrl.pathname)) {
    if (session.user) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/login', '/create-account']
}