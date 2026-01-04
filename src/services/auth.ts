import type { AuthUser } from '@/types/api';
import { unwrapApiResponse } from '@/types/api';
import { apiFetch } from '@/lib/api-client';

interface AuthMeResponse {
  success?: boolean;
  user?: AuthUser;
}

export type FetchCurrentUserResult = {
  user: AuthUser | null;
  unauthorized: boolean;
};

export async function fetchCurrentUser(): Promise<FetchCurrentUserResult> {
  try {
    const raw = await apiFetch<AuthMeResponse | { data: AuthMeResponse }>('/api/auth/me');
    const payload = unwrapApiResponse<AuthMeResponse>(raw as any);
    return { user: payload.user ?? null, unauthorized: false };
  } catch (error: any) {
    // 401 에러는 로그인하지 않은 상태에서 정상적인 응답이므로 조용히 처리
    if (error?.status === 401) {
      return { user: null, unauthorized: true };
    }
    // 다른 에러는 개발 환경에서만 로그
    if (process.env.NODE_ENV !== 'production') {
      console.debug('fetchCurrentUser error', error);
    }
    return { user: null, unauthorized: false };
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('logout error', error);
    }
    throw error;
  }
}

