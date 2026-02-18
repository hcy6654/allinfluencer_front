'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/api-client';
import { approvalKeys } from './approvalKeys';

interface PendingCountResponse {
  count: number;
}

export function usePendingAdvertiserCountQuery() {
  return useQuery({
    queryKey: approvalKeys.advertiserCount(),
    queryFn: () => apiFetch<PendingCountResponse>('/api/admin/advertisers/pending/count'),
  });
}
