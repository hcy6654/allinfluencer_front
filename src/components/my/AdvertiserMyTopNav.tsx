import Link from 'next/link';

const ITEMS = [
  { href: '/my/advertiser', label: '요약' },
  { href: '/my/advertiser/job-posts', label: '공고' },
  { href: '/my/advertiser/talent-pool', label: '인재풀' },
  { href: '/my/advertiser/candidates', label: '후보자' },
  { href: '/my/advertiser/applicants', label: '지원자' },
  { href: '/my/advertiser/products', label: '상품' },
  { href: '/my/advertiser/analytics', label: '분석' },
  { href: '/my/advertiser/messages', label: '메시지' },
];

export default function AdvertiserMyTopNav() {
  return (
    <nav className="border-t bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-3">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

