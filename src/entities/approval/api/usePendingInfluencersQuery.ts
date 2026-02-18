'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/api-client';
import { approvalKeys } from './approvalKeys';

export type PendingInfluencer = {
  userId: string;
  email: string | null;
  displayName: string | null;
  categories: string[] | null;
  submittedAt: string;
};

export type PageResult<T> = {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
};

export function usePendingInfluencersQuery(cursor?: string, limit = 30) {
  return useQuery({
    queryKey: approvalKeys.influencerList({ cursor, limit }),
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (cursor) searchParams.set('cursor', cursor);
      searchParams.set('limit', String(limit));
      return apiFetch<PageResult<PendingInfluencer>>(`/api/admin/influencers/pending?${searchParams}`);
    },
  });
}
