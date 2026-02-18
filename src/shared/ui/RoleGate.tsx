'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/entities/auth/api/useCurrentUser';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: 'ADMIN' | 'ADVERTISER' | 'INFLUENCER';
  fallbackPath?: string;
}

export default function RoleGate({
  children,
  allowedRole,
  fallbackPath = '/',
}: RoleGateProps) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">권한 확인 중...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">로그인이 필요합니다.</h2>
        <p className="mt-2 text-gray-600">이 기능을 사용하려면 먼저 로그인해주세요.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
          >
            로그인하러 가기
          </Link>
          <Link
            href={fallbackPath}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== allowedRole) {
    const roleMap: Record<string, string> = {
      ADMIN: '관리자',
      ADVERTISER: '사업자',
      INFLUENCER: '인플루언서',
    };

    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-8 text-center text-red-800 shadow-sm">
        <h2 className="text-xl font-bold italic">접근 권한이 없습니다.</h2>
        <p className="mt-2 font-medium">
          이 페이지는 <span className="underline decoration-2 underline-offset-4">{roleMap[allowedRole]}</span> 회원 전용입니다.
        </p>
        <div className="mt-6">
          <Link
            href={fallbackPath}
            className="inline-block rounded-lg bg-white border border-red-200 px-6 py-2.5 text-sm font-bold text-red-800 hover:bg-red-100 transition-all"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
