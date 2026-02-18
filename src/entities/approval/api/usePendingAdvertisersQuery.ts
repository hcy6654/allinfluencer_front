'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/api-client';
import { approvalKeys } from './approvalKeys';

export type PendingAdvertiser = {
  userId: string;
  email: string | null;
  businessName: string | null;
  representativeName: string | null;
  businessNumber: string | null;
  submittedAt: string;
};

export type PageResult<T> = {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
};

export function usePendingAdvertisersQuery(cursor?: string, limit = 30) {
  return useQuery({
    queryKey: approvalKeys.advertiserList({ cursor, limit }),
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (cursor) searchParams.set('cursor', cursor);
      searchParams.set('limit', String(limit));
      return apiFetch<PageResult<PendingAdvertiser>>(`/api/admin/advertisers/pending?${searchParams}`);
    },
  });
}
