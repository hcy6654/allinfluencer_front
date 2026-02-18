'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/api-client';
import { approvalKeys } from './approvalKeys';

interface PendingCountResponse {
  count: number;
}

export function usePendingInfluencerCountQuery() {
  return useQuery({
    queryKey: approvalKeys.influencerCount(),
    queryFn: () => apiFetch<PendingCountResponse>('/api/admin/influencers/pending/count'),
  });
}
