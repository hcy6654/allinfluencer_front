'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/features/auth/api/authService';

export function useCurrentUser() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return {
    user: data?.user ?? null,
    isLoading,
    isError,
    error,
  };
}
