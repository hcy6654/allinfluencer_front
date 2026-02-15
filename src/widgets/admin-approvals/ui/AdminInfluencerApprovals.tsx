'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/shared/api/api-client';

type PendingInfluencer = {
    userId: string;
    email: string | null;
    displayName: string | null;
    categories: string[] | null;
    submittedAt: string;
};

type PageResult<T> = {
    items: T[];
    hasMore: boolean;
    nextCursor: string | null;
};

export default function AdminInfluencerApprovals() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<PendingInfluencer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [actingUserId, setActingUserId] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [search, setSearch] = useState('');

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

    const empty = useMemo(() => !loading && filtered.length === 0, [filtered.length, loading]);

    async function load(reset = true) {
        setLoading(true);
        setError(null);
        try {
            const url = new URL('/api/admin/influencers/pending', window.location.origin);
            url.searchParams.set('limit', '30');
            if (!reset && nextCursor) url.searchParams.set('cursor', nextCursor);

            const data = await apiFetch<PageResult<PendingInfluencer>>(url.toString());
            setHasMore(!!data.hasMore);
            setNextCursor(data.nextCursor ?? null);
            setItems((prev) => (reset ? data.items ?? [] : [...prev, ...(data.items ?? [])]));
        } catch (e: any) {
            setError(e?.message ?? '조회에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(true);
    }, []);

    async function approve(userId: string) {
        setActingUserId(userId);
        setError(null);
        try {
            await apiFetch<void>(`/api/admin/influencers/${encodeURIComponent(userId)}/approve`, {
                method: 'PATCH',
            });
            await load(true);
        } catch (e: any) {
            setError(e?.message ?? '승인에 실패했습니다.');
        } finally {
            setActingUserId(null);
        }
    }

    async function reject(userId: string) {
        setActingUserId(userId);
        setError(null);
        try {
            await apiFetch<void>(`/api/admin/influencers/${encodeURIComponent(userId)}/reject`, {
                method: 'PATCH',
            });
            await load(true);
        } catch (e: any) {
            setError(e?.message ?? '반려에 실패했습니다.');
        } finally {
            setActingUserId(null);
        }
    }

    return (
        <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold text-gray-900">인플루언서 가입 승인</div>
                    <div className="mt-1 text-sm text-gray-600">
                        가입 요청(PENDING)을 승인/반려합니다.
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => load(true)}
                    className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                >
                    새로고침
                </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="이메일/이름/전문분야 검색"
                    className="w-full sm:max-w-md rounded-md border px-3 py-2 text-sm"
                />
            </div>

            {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mt-6 text-sm text-gray-600">불러오는 중...</div>
            ) : empty ? (
                <div className="mt-6 text-sm text-gray-600">
                    승인 대기 중인 인플루언서가 없습니다.
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 text-left text-gray-700">
                                <th className="px-3 py-2 font-medium">이메일</th>
                                <th className="px-3 py-2 font-medium">이름</th>
                                <th className="px-3 py-2 font-medium">전문분야</th>
                                <th className="px-3 py-2 font-medium">요청일</th>
                                <th className="px-3 py-2 font-medium">처리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row) => {
                                const busy = actingUserId === row.userId;
                                return (
                                    <tr key={row.userId} className="border-b">
                                        <td className="px-3 py-2 text-gray-900">{row.email ?? '-'}</td>
                                        <td className="px-3 py-2 text-gray-900">
                                            {row.displayName ?? '-'}
                                        </td>
                                        <td className="px-3 py-2 text-gray-700">
                                            {row.categories?.length ? row.categories.join(', ') : '-'}
                                        </td>
                                        <td className="px-3 py-2 text-gray-700">
                                            {row.submittedAt
                                                ? new Date(row.submittedAt).toLocaleString()
                                                : '-'}
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => approve(row.userId)}
                                                    disabled={busy}
                                                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    승인
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => reject(row.userId)}
                                                    disabled={busy}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            {hasMore ? '더 불러올 수 있습니다.' : '마지막 항목입니다.'}
                        </div>
                        {hasMore && (
                            <button
                                type="button"
                                onClick={() => load(false)}
                                className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                disabled={loading}
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
