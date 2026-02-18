import { NextRequest, NextResponse } from 'next/server';

/**
 * 서브도메인 기반 라우팅 미들웨어
 *
 * - admin.allinfluencer.co.kr → /admin/* 경로로 내부 리라이트
 * - admin.localhost:3000 (로컬) → 동일 동작
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;

  // 1. admin 서브도메인 여부 체크
  const isAdminSubdomain = 
    hostname.startsWith('admin.localhost') || 
    hostname.startsWith('admin.allinfluencer');

  if (isAdminSubdomain) {
    // admin 서브도메인으로 접속했을 때 /admin 경로가 없으면 붙여줌
    if (!pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로들을 제외한 모든 요청에 대해 미들웨어 실행:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static, favicon.ico 등 정적 자산
     */
    '/((?!api|_next|static|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
