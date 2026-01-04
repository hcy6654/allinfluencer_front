import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import AdvertiserMyTopNav from '@/components/my/AdvertiserMyTopNav';

export default function AdvertiserMyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">사업자 마이페이지</h1>
              <p className="text-sm text-gray-600 mt-1">공고/인재풀/후보자/채용 상품을 한 곳에서 관리하세요.</p>
            </div>
            <Link
              href="/jobs/create"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              공고 등록
            </Link>
          </div>
        </div>
        <AdvertiserMyTopNav />
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}


