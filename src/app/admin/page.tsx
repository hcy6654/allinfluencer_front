'use client';

import { usePendingInfluencerCountQuery, usePendingAdvertiserCountQuery } from '@/entities/approval/api';
import Link from 'next/link';

export default function AdminHomePage() {
  const { data: influencerData, isLoading: influencerLoading } = usePendingInfluencerCountQuery();
  const { data: advertiserData, isLoading: advertiserLoading } = usePendingAdvertiserCountQuery();

  const pendingInfluencerCount = influencerData?.count ?? 0;
  const pendingAdvertiserCount = advertiserData?.count ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">관리자 대시보드</h2>
          <p className="mt-2 text-gray-400 max-w-xl">
            All-Influencer 플랫폼의 운영 현황을 한눈에 파악하고 관리하세요. 
            승인 대기 중인 요청들을 신속하게 처리하여 사용자 경험을 개선하세요.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 인플루언서 승인 대기 */}
        <Link href="/admin/approvals">
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">승인 필요</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">인플루언서 승인 대기</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {influencerLoading ? '...' : pendingInfluencerCount}
                </span>
                <span className="text-sm text-gray-400">명</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
              승인 관리로 이동
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* 사업자 인증 대기 */}
        <Link href="/admin/approvals">
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">인증 필요</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">사업자 인증 대기</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {advertiserLoading ? '...' : pendingAdvertiserCount}
                </span>
                <span className="text-sm text-gray-400">건</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-indigo-600 font-medium">
              인증 관리로 이동
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* 유저 관리 */}
        <Link href="/admin/users">
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">전체 사용자 관리</h3>
              <div className="mt-1">
                <span className="text-sm text-gray-400 italic">상세 목록 및 강퇴 제어</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-purple-600 font-medium">
              유저 관리로 이동
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
