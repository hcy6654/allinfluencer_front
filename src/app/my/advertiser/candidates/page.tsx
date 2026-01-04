'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type LeftTab = 'JOB' | 'TALENT';

type JobPostItem = {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
  stats?: { applicationCount?: number; offerCount?: number };
};

type ApplicantsResponse = {
  jobPost?: { id: string; title: string };
  items: Array<{
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
    appliedAt: string;
    influencer: {
      id: string;
      displayName: string;
      avatar?: string | null;
      profile?: {
        headline?: string | null;
        followers?: number;
        avgEngagement?: number;
        categories?: string[];
      } | null;
    };
  }>;
};

type OffersResponse = {
  jobPost?: { id: string; title: string };
  items: Array<{
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    offeredAt: string;
    influencer: {
      id: string;
      displayName: string;
      avatar?: string | null;
      profile?: {
        headline?: string | null;
        followers?: number;
        avgEngagement?: number;
        categories?: string[];
      } | null;
    };
  }>;
};

type PipelineStageKey = 'DOC' | 'FIRST' | 'SECOND' | 'FINAL' | 'REJECTED';

const PIPELINE: Array<{ key: PipelineStageKey; label: string }> = [
  { key: 'DOC', label: '서류 전형' },
  { key: 'FIRST', label: '1차 면접' },
  { key: 'SECOND', label: '2차 면접' },
  { key: 'FINAL', label: '최종 합격' },
  { key: 'REJECTED', label: '불합격' },
];

function stageFromApplicationStatus(status: ApplicantsResponse['items'][number]['status']): PipelineStageKey {
  // 현재 백엔드 지원서 status만으로는 면접 단계가 없어 1차/2차는 추후 확장 예정
  if (status === 'PENDING') return 'DOC';
  if (status === 'ACCEPTED') return 'FINAL';
  if (status === 'REJECTED') return 'REJECTED';
  return 'REJECTED';
}

function daysSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / (24 * 60 * 60 * 1000)));
}

export default function AdvertiserCandidatesPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  const [tab, setTab] = useState<LeftTab>('JOB');
  const [jobSearch, setJobSearch] = useState('');
  const [jobs, setJobs] = useState<JobPostItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [candidateSearch, setCandidateSearch] = useState('');
  const [stage, setStage] = useState<PipelineStageKey>('DOC');
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<ApplicantsResponse | null>(null);

  const [offerStatus, setOfferStatus] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'ALL'>('ALL');
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [offers, setOffers] = useState<OffersResponse | null>(null);

  // 공고 목록 로드
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingJobs(true);
      setJobsError(null);
      try {
        const res = await fetch(`${API_BASE}/my/advertiser/job-posts?limit=50`, {
          credentials: 'include',
        });
        if (res.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        if (!res.ok) throw new Error('공고 목록을 불러오지 못했습니다.');
        const json = await res.json();
        const items: JobPostItem[] = json?.items ?? [];
        if (!cancelled) {
          setJobs(items);
          setSelectedJobId((prev) => prev ?? items[0]?.id ?? null);
        }
      } catch (e) {
        if (!cancelled) setJobsError(e instanceof Error ? e.message : '공고 목록 오류');
      } finally {
        if (!cancelled) setLoadingJobs(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  // 지원자 로드
  useEffect(() => {
    let cancelled = false;
    async function loadApplicants(jobId: string) {
      setLoadingApplicants(true);
      setApplicantsError(null);
      try {
        const res = await fetch(`${API_BASE}/my/advertiser/job-posts/${jobId}/applicants?limit=50`, {
          credentials: 'include',
        });
        if (res.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        if (!res.ok) throw new Error('후보자 목록을 불러오지 못했습니다.');
        const json = (await res.json()) as ApplicantsResponse;
        if (!cancelled) setApplicants(json);
      } catch (e) {
        if (!cancelled) setApplicantsError(e instanceof Error ? e.message : '후보자 목록 오류');
        if (!cancelled) setApplicants(null);
      } finally {
        if (!cancelled) setLoadingApplicants(false);
      }
    }

    if (tab === 'JOB' && selectedJobId) {
      loadApplicants(selectedJobId);
    } else {
      setApplicants(null);
    }

    return () => {
      cancelled = true;
    };
  }, [API_BASE, selectedJobId, tab]);

  // 제안(오퍼) 로드
  useEffect(() => {
    let cancelled = false;
    async function loadOffers(jobId: string) {
      setLoadingOffers(true);
      setOffersError(null);
      try {
        const url = new URL(`${API_BASE}/my/advertiser/job-posts/${jobId}/offers`);
        url.searchParams.set('limit', '50');
        if (offerStatus !== 'ALL') {
          url.searchParams.set('status', offerStatus);
        }

        const res = await fetch(url.toString(), { credentials: 'include' });
        if (res.status === 401) throw new Error('로그인이 필요합니다.');
        if (!res.ok) throw new Error('제안 후보자 목록을 불러오지 못했습니다.');
        const json = (await res.json()) as OffersResponse;
        if (!cancelled) setOffers(json);
      } catch (e) {
        if (!cancelled) setOffersError(e instanceof Error ? e.message : '제안 후보자 목록 오류');
        if (!cancelled) setOffers(null);
      } finally {
        if (!cancelled) setLoadingOffers(false);
      }
    }

    if (tab === 'TALENT' && selectedJobId) {
      loadOffers(selectedJobId);
    } else {
      setOffers(null);
    }

    return () => {
      cancelled = true;
    };
  }, [API_BASE, selectedJobId, tab, offerStatus]);

  const filteredJobs = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => j.title.toLowerCase().includes(q));
  }, [jobs, jobSearch]);

  const offeredJobs = useMemo(() => {
    // 좌측 "인재풀" 탭에서는 '제안한 공고들'만 보여주기
    return filteredJobs.filter((j) => (j.stats?.offerCount ?? 0) > 0);
  }, [filteredJobs]);

  const allApplicants = applicants?.items ?? [];
  const allOffers = offers?.items ?? [];

  const stageCounts = useMemo(() => {
    const base = Object.fromEntries(PIPELINE.map((p) => [p.key, 0])) as Record<PipelineStageKey, number>;
    for (const a of allApplicants) {
      const key = stageFromApplicationStatus(a.status);
      base[key] += 1;
    }
    return base;
  }, [allApplicants]);

  const offerCounts = useMemo(() => {
    const base = { ALL: allOffers.length, PENDING: 0, ACCEPTED: 0, REJECTED: 0, EXPIRED: 0 } as const;
    const mutable = { ...base };
    for (const o of allOffers) {
      mutable[o.status] += 1;
    }
    return mutable;
  }, [allOffers]);

  const visibleApplicants = useMemo(() => {
    const q = candidateSearch.trim().toLowerCase();
    return allApplicants
      .filter((a) => stageFromApplicationStatus(a.status) === stage)
      .filter((a) => {
        if (!q) return true;
        const name = a.influencer.displayName?.toLowerCase() ?? '';
        const headline = a.influencer.profile?.headline?.toLowerCase() ?? '';
        return name.includes(q) || headline.includes(q);
      });
  }, [allApplicants, candidateSearch, stage]);

  const visibleOffers = useMemo(() => {
    const q = candidateSearch.trim().toLowerCase();
    return allOffers.filter((o) => {
      if (!q) return true;
      const name = o.influencer.displayName?.toLowerCase() ?? '';
      const headline = o.influencer.profile?.headline?.toLowerCase() ?? '';
      return name.includes(q) || headline.includes(q);
    });
  }, [allOffers, candidateSearch]);

  const selectedJobTitle = useMemo(() => {
    const fromApplicants = applicants?.jobPost?.title;
    if (fromApplicants) return fromApplicants;
    return jobs.find((j) => j.id === selectedJobId)?.title ?? '공고를 선택하세요';
  }, [applicants?.jobPost?.title, jobs, selectedJobId]);

  const selectedOfferJobTitle = useMemo(() => {
    const fromOffers = offers?.jobPost?.title;
    if (fromOffers) return fromOffers;
    return jobs.find((j) => j.id === selectedJobId)?.title ?? '공고를 선택하세요';
  }, [offers?.jobPost?.title, jobs, selectedJobId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* 좌측: 공고 리스트 */}
      <aside className="bg-white border rounded-xl shadow-sm overflow-hidden h-fit lg:sticky lg:top-24">
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTab('JOB')}
              className={[
                'rounded-lg border px-3 py-2 text-sm font-medium',
                tab === 'JOB' ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
              ].join(' ')}
            >
              공고
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('TALENT');
                setOfferStatus('ALL');
                // 인재풀 탭에서는 offerCount>0 중 첫 번째를 선택하도록 보정
                const first = offeredJobs[0]?.id ?? null;
                setSelectedJobId((prev) => prev && offeredJobs.some((j) => j.id === prev) ? prev : first);
              }}
              className={[
                'rounded-lg border px-3 py-2 text-sm font-medium',
                tab === 'TALENT' ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
              ].join(' ')}
            >
              인재풀
            </button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="공고, 후보자 검색"
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          {loadingJobs ? (
            <div className="p-4 text-sm text-gray-600">공고 불러오는 중...</div>
          ) : jobsError ? (
            <div className="p-4">
              <p className="text-sm text-red-700">{jobsError}</p>
              <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700">
                로그인 하러가기 →
              </Link>
            </div>
          ) : (tab === 'TALENT' ? offeredJobs.length === 0 : filteredJobs.length === 0) ? (
            <div className="p-4 text-sm text-gray-600">
              {tab === 'TALENT' ? '포지션 제안한 공고가 없습니다.' : '표시할 공고가 없습니다.'}
            </div>
          ) : (
            <ul className="divide-y">
              {(tab === 'TALENT' ? offeredJobs : filteredJobs).map((job) => {
                const active = job.id === selectedJobId;
                return (
                  <li key={job.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedJobId(job.id)}
                      className={[
                        'w-full text-left px-4 py-3 hover:bg-gray-50',
                        active ? 'bg-blue-50' : 'bg-white',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${active ? 'text-blue-700' : 'text-gray-900'} line-clamp-2`}>
                          {job.title}
                        </span>
                        <span className="text-xs text-gray-500 shrink-0">
                          {tab === 'TALENT' ? (job.stats?.offerCount ?? 0) : (job.stats?.applicationCount ?? 0)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {tab === 'TALENT'
                          ? `제안 ${job.stats?.offerCount ?? 0}건`
                          : job.status === 'OPEN'
                            ? '모집중'
                            : job.status === 'CLOSED'
                              ? '모집완료'
                              : '진행상태'}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* 우측: 후보자 파이프라인 + 테이블 */}
      <section className="space-y-4">
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {tab === 'TALENT' ? selectedOfferJobTitle : selectedJobTitle}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {tab === 'TALENT'
                    ? '공고에 대해 포지션 제안한 후보자들을 관리합니다.'
                    : '공고별 후보자 파이프라인을 관리합니다.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  placeholder="후보자 검색"
                  className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                {tab === 'TALENT' ? (
                  <>
                    전체 제안 <span className="font-semibold text-gray-900">{allOffers.length}</span>명
                  </>
                ) : (
                  <>
                    전체 후보자 <span className="font-semibold text-gray-900">{allApplicants.length}</span>명
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 단계/상태 탭 */}
        {tab === 'JOB' ? (
          <div className="flex gap-2 overflow-x-auto">
            {PIPELINE.map((p) => {
              const active = p.key === stage;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setStage(p.key)}
                  className={[
                    'flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap',
                    active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {p.label}
                  <span className={active ? 'text-white/90' : 'text-blue-600'}>{stageCounts[p.key]}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto">
            {(
              [
                { key: 'ALL', label: '전체' },
                { key: 'PENDING', label: '제안 발송' },
                { key: 'ACCEPTED', label: '수락' },
                { key: 'REJECTED', label: '거절' },
                { key: 'EXPIRED', label: '만료' },
              ] as const
            ).map((p) => {
              const active = p.key === offerStatus;
              const count =
                p.key === 'ALL'
                  ? offerCounts.ALL
                  : p.key === 'PENDING'
                    ? offerCounts.PENDING
                    : p.key === 'ACCEPTED'
                      ? offerCounts.ACCEPTED
                      : p.key === 'REJECTED'
                        ? offerCounts.REJECTED
                        : offerCounts.EXPIRED;

              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setOfferStatus(p.key)}
                  className={[
                    'flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap',
                    active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {p.label}
                  <span className={active ? 'text-white/90' : 'text-blue-600'}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 후보자 리스트 */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">
              {tab === 'TALENT'
                ? `제안 후보자 (${allOffers.length})`
                : `${PIPELINE.find((p) => p.key === stage)?.label} (${stageCounts[stage]})`}
            </div>
            <div className="text-xs text-gray-500">채용설정/채용관리자/채용보고서 버튼은 생략</div>
          </div>

          {tab === 'JOB' ? (
            loadingApplicants ? (
              <div className="p-6 text-sm text-gray-600">후보자 불러오는 중...</div>
            ) : applicantsError ? (
              <div className="p-6">
                <p className="text-sm text-red-700">{applicantsError}</p>
                <p className="mt-2 text-sm text-gray-600">
                  로그인 상태(광고주 계정)인지 확인하고, 공고를 하나 선택해 주세요.
                </p>
              </div>
            ) : visibleApplicants.length === 0 ? (
              <div className="p-6 text-sm text-gray-600">해당 단계에 후보자가 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">
                        <input type="checkbox" />
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">후보자</th>
                      <th className="px-5 py-3 text-left font-semibold">경력</th>
                      <th className="px-5 py-3 text-left font-semibold">학력</th>
                      <th className="px-5 py-3 text-left font-semibold">채용 현황</th>
                      <th className="px-5 py-3 text-left font-semibold">경과일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {visibleApplicants.map((a) => {
                      const name = a.influencer.displayName || '이름 미등록';
                      const headline = a.influencer.profile?.headline ?? '';
                      const categories = a.influencer.profile?.categories ?? [];
                      const initial = name.charAt(0).toUpperCase();
                      const elapsed = daysSince(a.appliedAt);

                      return (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <input type="checkbox" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {a.influencer.avatar ? (
                                <img
                                  src={a.influencer.avatar}
                                  alt={name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                                  {initial}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900">{name}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {headline || (categories.length ? categories.join(' · ') : '프로필 정보 없음')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-700">-</td>
                          <td className="px-5 py-4 text-gray-700">-</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                              지원 ({new Date(a.appliedAt).toLocaleDateString()})
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-semibold text-gray-900">{elapsed}</span>
                            <span className="text-gray-500 ml-1">일</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : loadingOffers ? (
            <div className="p-6 text-sm text-gray-600">제안 후보자 불러오는 중...</div>
          ) : offersError ? (
            <div className="p-6">
              <p className="text-sm text-red-700">{offersError}</p>
              <p className="mt-2 text-sm text-gray-600">인재풀 탭에서는 “제안한 공고”를 선택해야 합니다.</p>
            </div>
          ) : visibleOffers.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">해당 조건의 제안 후보자가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">
                      <input type="checkbox" />
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">후보자</th>
                    <th className="px-5 py-3 text-left font-semibold">제안 상태</th>
                    <th className="px-5 py-3 text-left font-semibold">제안일</th>
                    <th className="px-5 py-3 text-left font-semibold">경과일</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleOffers.map((o) => {
                    const name = o.influencer.displayName || '이름 미등록';
                    const headline = o.influencer.profile?.headline ?? '';
                    const categories = o.influencer.profile?.categories ?? [];
                    const initial = name.charAt(0).toUpperCase();
                    const elapsed = daysSince(o.offeredAt);
                    const statusLabel =
                      o.status === 'PENDING'
                        ? '제안 발송'
                        : o.status === 'ACCEPTED'
                          ? '수락'
                          : o.status === 'REJECTED'
                            ? '거절'
                            : '만료';

                    return (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <input type="checkbox" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {o.influencer.avatar ? (
                              <img
                                src={o.influencer.avatar}
                                alt={name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                                {initial}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900">{name}</div>
                              <div className="text-xs text-gray-500 line-clamp-1">
                                {headline || (categories.length ? categories.join(' · ') : '프로필 정보 없음')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-700">{new Date(o.offeredAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">{elapsed}</span>
                          <span className="text-gray-500 ml-1">일</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


