'use client';

import { useEffect, useState } from 'react';

type PendingCountResponse = { count: number };

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export default function AdminHomePage() {
  const [pendingInfluencerCount, setPendingInfluencerCount] = useState<number | null>(null);
  const [pendingAdvertiserCount, setPendingAdvertiserCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiFetch<PendingCountResponse>('/api/admin/influencers/pending/count');
        if (!mounted) return;
        setPendingInfluencerCount(data.count ?? 0);
      } catch {
        if (!mounted) return;
        setPendingInfluencerCount(null);
      }

      try {
        const data = await apiFetch<PendingCountResponse>('/api/admin/advertisers/pending/count');
        if (!mounted) return;
        setPendingAdvertiserCount(data.count ?? 0);
      } catch {
        if (!mounted) return;
        setPendingAdvertiserCount(null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <div className="text-xl font-semibold text-gray-900">관리자 대시보드</div>
        <div className="mt-2 text-sm text-gray-600">
          `admin.allinfluencer.co.kr` 전용 관리자 페이지입니다.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-5">
          <div className="text-sm font-medium text-gray-700">인플루언서 승인 대기</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {pendingInfluencerCount === null ? '—' : pendingInfluencerCount}
          </div>
          <div className="mt-2 text-xs text-gray-500">/admin/approvals 에서 처리</div>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <div className="text-sm font-medium text-gray-700">사업자 인증 대기</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {pendingAdvertiserCount === null ? '—' : pendingAdvertiserCount}
          </div>
          <div className="mt-2 text-xs text-gray-500">/admin/approvals 에서 처리</div>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <div className="text-sm font-medium text-gray-700">신고/문의</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">—</div>
          <div className="mt-2 text-xs text-gray-500">연결 예정</div>
        </div>
      </div>
    </div>
  );
}

