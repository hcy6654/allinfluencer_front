import Link from 'next/link';

import AuthButton from '@/features/auth/ui/AuthButton';
import AdminGate from './AdminGate';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-lg font-semibold text-gray-900">
                  All Influencer Admin
                </Link>
                <nav className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    대시보드
                  </Link>
                  <Link
                    href="/admin/approvals"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    승인 관리
                  </Link>
                </nav>
              </div>
              <AuthButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </AdminGate>
  );
}

