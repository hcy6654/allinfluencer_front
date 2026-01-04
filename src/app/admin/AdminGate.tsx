'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { AuthUser } from '@/types/api';
import { fetchCurrentUser } from '@/services/auth';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const result = await fetchCurrentUser();
      if (!mounted) return;
      setUser(result.user);
      setUnauthorized(result.unauthorized);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-600">확인 중...</div>;
  }

  if (unauthorized || !user) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <div className="text-lg font-semibold text-gray-900">관리자 로그인이 필요합니다.</div>
        <div className="mt-2 text-sm text-gray-600">
          관리자 계정으로 로그인 후 다시 시도해주세요.
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            로그인
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="rounded-lg border bg-white p-6">
        <div className="text-lg font-semibold text-gray-900">접근 권한이 없습니다.</div>
        <div className="mt-2 text-sm text-gray-600">
          이 페이지는 관리자만 접근할 수 있습니다.
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

