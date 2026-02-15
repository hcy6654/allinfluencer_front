'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';

import { useUsersQuery as useUsers } from '@/entities/user/api/useUsersQuery';
import { EmptyState, UserListCard } from '@/entities/user/ui';
import type { UserListItem } from '@/shared/types/api';

type StatusValue = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
type SortValue = 'newest' | 'oldest' | 'name';

function chipLabelFromBio(user: UserListItem) {
  if (!user.bio) return [];
  const tokens = user.bio
    .split(/[\s,./|#]+/g)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
  return tokens;
}

function TalentPoolCard({ user }: { user: UserListItem }) {
  const primary = user.displayName ?? '이름 미등록';
  const secondary = user.email ?? '이메일 정보 없음';
  const initial = (primary || secondary).charAt(0).toUpperCase();
  const chips = chipLabelFromBio(user);

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={primary}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{initial}</span>
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">{primary}</h3>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                인플루언서
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{secondary}</p>
            {chips.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          후보자 저장
        </button>
      </div>

      {user.bio && <p className="mt-3 text-sm text-gray-600 line-clamp-2">{user.bio}</p>}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">상세 보기(준비 중)</span>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          이직 제안하기
        </button>
      </div>
    </div>
  );
}

export default function AdvertiserTalentPoolPage() {
  const {
    users,
    meta,
    loading,
    error,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    canGoPrev,
    canGoNext,
    handleRetry,
    resetFilters,
  } = useUsers();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  // 화면 요구사항: 인재풀은 기본적으로 인플루언서만
  useEffect(() => {
    if (roleFilter !== 'INFLUENCER') {
      setRoleFilter('INFLUENCER');
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 화면 요구사항: 보통은 활성만 보여주는게 자연스러움(원하면 ALL로 바꿀 수 있음)
  useEffect(() => {
    if (statusFilter !== 'ACTIVE') {
      setStatusFilter('ACTIVE');
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [qOr, setQOr] = useState('');
  const [qAnd, setQAnd] = useState('');
  const [qNot, setQNot] = useState('');

  const composedSearch = useMemo(() => {
    // 현재 API 검색은 단일 search만 지원 → UI는 3칸으로 구성하되, 우선 OR/AND 키워드를 합쳐 검색어로 사용
    const base = [qOr, qAnd].map((v) => v.trim()).filter(Boolean).join(' ');
    return base;
  }, [qOr, qAnd]);

  const featured = users.slice(0, 2);

  if (loading) {
    return (
      <div className="py-10">
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm">인재풀 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 타이틀 + 액션 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">원하는 직무에 딱 맞는 우수한 인재를 찾아보세요</h2>
          <p className="mt-1 text-sm text-gray-600">키워드 검색과 필터로 인플루언서를 빠르게 찾을 수 있어요.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            검색 조건 불러오기
          </button>
          <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            검색 조건 저장
          </button>
        </div>
      </div>

      {/* 검색 빌더 */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_120px] gap-3">
          <div className="relative">
            <div className="text-xs font-medium text-gray-500 mb-1">OR (하나 이상 포함)</div>
            <input
              value={qOr}
              onChange={(e) => setQOr(e.target.value)}
              placeholder="키워드"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <div className="text-xs font-medium text-gray-500 mb-1">AND (모두 포함)</div>
            <input
              value={qAnd}
              onChange={(e) => setQAnd(e.target.value)}
              placeholder="키워드"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <div className="text-xs font-medium text-gray-500 mb-1">NOT (제외)</div>
            <input
              value={qNot}
              onChange={(e) => setQNot(e.target.value)}
              placeholder="제외 키워드"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrentPage(1);
              setSearchTerm(composedSearch);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Search className="w-4 h-4 mr-2" />
            검색
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {['사업기획', '입점/영업', '전략기획', '브랜딩', '퍼포먼스', '콘텐츠'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQOr((prev) => (prev ? `${prev} ${chip}` : chip));
              }}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
            >
              + {chip}
            </button>
          ))}
        </div>

        {qNot.trim() && (
          <p className="mt-2 text-xs text-gray-500">
            참고: 현재는 단일 검색어 API만 있어 NOT 제외 조건은 UI만 제공됩니다(추후 인재풀 검색 API에서 처리).
          </p>
        )}
      </div>

      {/* 본문: 좌측 필터 + 우측 결과 */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* 좌측 필터 */}
        <aside className="bg-white border rounded-xl p-4 shadow-sm h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">필터</h3>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              {showFilters ? '접기' : '펼치기'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">검색</label>
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  placeholder="이름/이메일"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">경력(최저)</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
                    <option>선택</option>
                    <option>신입</option>
                    <option>1년</option>
                    <option>3년</option>
                    <option>5년</option>
                    <option>10년+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">경력(최고)</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
                    <option>선택</option>
                    <option>1년</option>
                    <option>3년</option>
                    <option>5년</option>
                    <option>10년</option>
                    <option>제한 없음</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">상태</label>
                <select
                  value={statusFilter as StatusValue}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setStatusFilter(e.target.value as StatusValue);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="ACTIVE">활성</option>
                  <option value="ALL">전체</option>
                  <option value="INACTIVE">비활성</option>
                  <option value="SUSPENDED">정지</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setQOr('');
                  setQAnd('');
                  setQNot('');
                  setCurrentPage(1);
                  setRoleFilter('INFLUENCER');
                  setStatusFilter('ACTIVE');
                }}
                className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                필터 초기화
              </button>
            </div>
          )}
        </aside>

        {/* 우측 결과 */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">적극적으로 제안을 기다리는 인재</h3>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                Focus
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                필터
              </button>

              <select
                value={sortBy as SortValue}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="newest">업데이트순</option>
                <option value="name">이름순</option>
                <option value="oldest">오래된순</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                  aria-label="그리드 보기"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                  aria-label="리스트 보기"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            {meta ? `총 ${meta.total}명 중 ${users.length}명 표시` : `총 ${users.length}명`}
          </p>

          {users.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {users.map((u) => (
                <TalentPoolCard key={u.id} user={u} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <UserListCard key={u.id} user={u} />
              ))}
            </div>
          )}

          {users.length > 0 && (
            <div className="pt-2 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!canGoPrev}
                  className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-md">
                  {meta ? `${meta.page} / ${meta.totalPages}` : currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!canGoNext}
                  className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </nav>
            </div>
          )}

          {/* 하단 추천(이미지의 리스트 영역 느낌) */}
          {featured.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">추천</h4>
                <span className="text-xs text-gray-500">업데이트 24개월 이내</span>
              </div>
              <div className="space-y-3">
                {featured.map((u) => (
                  <div key={u.id} className="bg-white border rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <input type="checkbox" className="mt-1" />
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.displayName ?? '사용자'} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-700">
                              {(u.displayName ?? u.email ?? 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{u.displayName ?? '이름 미등록'}</div>
                          <div className="text-xs text-gray-500 truncate">{u.email ?? '이메일 없음'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          후보자 저장
                        </button>
                        <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                          이직 제안하기
                        </button>
                      </div>
                    </div>
                    {u.bio && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{u.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


