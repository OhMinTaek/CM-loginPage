import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const session = await getSession();
 
  // 로그인이 필요한 페이지 체크
  if (['/', '/profile'].includes(request.nextUrl.pathname)) {
    if (!session.user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
 
  // 로그인된 사용자의 로그인/회원가입 페이지 접근 체크
  if (['/login', '/create-account'].includes(request.nextUrl.pathname)) {
    if (session.user) {
      return NextResponse.redirect(new URL('/', request.url))  // 홈페이지로 리다이렉트
    }
  }
 
  return NextResponse.next()
 }
 
 export const config = {
  matcher: ['/', '/profile', '/login', '/create-account']
 }