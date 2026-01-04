import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Briefcase, Eye, PlusCircle, Star, Users } from 'lucide-react';

async function getAdvertiserOverview() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const cookieStore = cookies();

    const response = await fetch(`${API_URL}/api/v1/my/advertiser/overview`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      redirect('/auth/login');
    }

    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }

    console.error('Failed to fetch advertiser overview:', response.statusText);
    return null;
  } catch (error) {
    console.error('Error fetching advertiser overview:', error);
    return null;
  }
}

export default async function AdvertiserJobsPage() {
  const overview = await getAdvertiserOverview();

  // 임시 데모 데이터 (API가 없는 경우)
  const demoOverview = {
    jobPosts: {
      total: 12,
      draft: 2,
      open: 5,
      closed: 3,
      completed: 2,
      cancelled: 0,
    },
    recentStats: {
      recentApplications: 47,
      activeContracts: 8,
      avgRating: 4.6,
    },
  };

  const data = overview || demoOverview;
  const { jobPosts, recentStats } = data;

  return (
    <div className="space-y-8">
      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">총 공고</dt>
                  <dd className="text-lg font-semibold text-gray-900">{jobPosts.total}개</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">활성 공고</dt>
                  <dd className="text-lg font-semibold text-gray-900">{jobPosts.open}개</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">최근 지원자</dt>
                  <dd className="text-lg font-semibold text-gray-900">{recentStats.recentApplications}명</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">평균 평점</dt>
                  <dd className="text-lg font-semibold text-gray-900 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                    {recentStats.avgRating.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">공고 현황</h3>
            <Link href="/my/advertiser/jobs" className="text-sm text-blue-600 hover:text-blue-500">
              전체 보기 →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">임시보관</span>
              <span className="font-medium text-gray-700">{jobPosts.draft}건</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">모집중</span>
              <span className="font-medium text-green-600">{jobPosts.open}건</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">모집완료</span>
              <span className="font-medium text-blue-600">{jobPosts.closed}건</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">완료</span>
              <span className="font-medium text-purple-600">{jobPosts.completed}건</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t">
            <Link
              href="/jobs/create"
              className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              새 공고 작성
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">후보자 현황</h3>
            <Link href="/my/advertiser/candidates" className="text-sm text-blue-600 hover:text-blue-500">
              후보자 보기 →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">이번달 지원자</span>
              <span className="font-medium text-gray-900">{recentStats.recentApplications}명</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">진행중 계약</span>
              <span className="font-medium text-green-600">{recentStats.activeContracts}건</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 응답률</span>
              <span className="font-medium text-blue-600">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">완료율</span>
              <span className="font-medium text-purple-600">94%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 공고 활동</h3>
          <div className="space-y-4">
            {[
              { title: '뷰티 신제품 런칭 캠페인', applicants: 12, status: 'open', time: '2시간 전' },
              { title: '홈카페 브랜드 협업', applicants: 8, status: 'closed', time: '1일 전' },
              { title: '피트니스 웨어 모델링', applicants: 15, status: 'open', time: '3일 전' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    {activity.applicants}명 지원 <span className="mx-2">•</span> {activity.time}
                  </div>
                </div>
                <div
                  className={[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    activity.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800',
                  ].join(' ')}
                >
                  {activity.status === 'open' ? '모집중' : '모집완료'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">안내</h3>
            <Link href="/my/advertiser/products" className="text-sm text-blue-600 hover:text-blue-500">
              채용 상품 보기 →
            </Link>
          </div>
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              인재풀/후보자/채용 상품 메뉴를 통해 더 빠르게 채용을 진행할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


