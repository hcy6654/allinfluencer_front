'use client';

import { useMemo, useState } from 'react';
import { usePendingInfluencersQuery } from '@/entities/approval/api';
import { useApproveInfluencer, useRejectInfluencer } from '@/features/approvals/api/useInfluencerApproval';

export default function AdminInfluencerApprovals() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error, refetch } = usePendingInfluencersQuery(cursor);
  const approveMutation = useApproveInfluencer();
  const rejectMutation = useRejectInfluencer();

  const items = data?.items ?? [];
  const hasMore = data?.hasMore ?? false;
  const nextCursor = data?.nextCursor;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      const hay = [x.email ?? '', x.displayName ?? '', (x.categories ?? []).join(',')]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const empty = !isLoading && filtered.length === 0;

  const handleApprove = (userId: string) => {
    if (window.confirm('이 인플루언서를 승인하시겠습니까?')) {
      approveMutation.mutate(userId);
    }
  };

  const handleReject = (userId: string) => {
    if (window.confirm('이 인플루언서 요청을 반려하시겠습니까?')) {
      rejectMutation.mutate(userId);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      setCursor(nextCursor);
    }
  };

  const handleReset = () => {
    setCursor(undefined);
    refetch();
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-lg font-bold text-gray-900">인플루언서 가입 승인</div>
          <div className="mt-1 text-sm text-gray-500">
            신규 인플루언서의 가입 요청을 검토하고 승인하거나 반려합니다.
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          새로고침
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이메일, 이름 또는 전문분야 검색"
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {isError && (
        <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          데이터를 불러오는 중 오류가 발생했습니다: {error?.message}
        </div>
      )}

      {isLoading && items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center py-12 text-gray-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-sm">데이터를 불러오는 중입니다...</p>
        </div>
      ) : empty ? (
        <div className="mt-12 text-center py-12 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 font-medium">
          승인 대기 중인 인플루언서가 없습니다.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 border-b border-gray-100">
                  <th className="px-5 py-3 font-semibold">이메일</th>
                  <th className="px-5 py-3 font-semibold">이름</th>
                  <th className="px-5 py-3 font-semibold">전문분야</th>
                  <th className="px-5 py-3 font-semibold">요청일</th>
                  <th className="px-5 py-3 font-semibold text-center">처리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((row) => {
                  const acting = approveMutation.isPending || rejectMutation.isPending;
                  return (
                    <tr key={row.userId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{row.email ?? '-'}</td>
                      <td className="px-5 py-4 text-gray-700">{row.displayName ?? '-'}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {row.categories?.map((cat, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                              {cat}
                            </span>
                          )) || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {row.submittedAt ? new Date(row.submittedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(row.userId)}
                            disabled={acting}
                            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                          >
                            승인
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(row.userId)}
                            disabled={acting}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
                          >
                            반려
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-4">
            <div className="text-xs text-gray-500 font-medium">
              {hasMore ? '데이터가 더 존재합니다.' : '마지막 항목입니다.'}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-all"
                disabled={isLoading}
              >
                더 보기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
