import type {
  PaginatedResponse,
  UserListItem,
  UserRole,
  UserStatus,
} from '@/types/api';
import { unwrapApiResponse } from '@/types/api';
import { apiFetch } from '@/lib/api-client';

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

const DEFAULT_LIMIT = 12;

export async function fetchUsers(
  params: FetchUsersParams = {},
): Promise<PaginatedResponse<UserListItem>> {
  const query = {
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_LIMIT,
    role: params.role,
    status: params.status,
    search: params.search?.trim() || undefined,
  };

  try {
    const qs = new URLSearchParams();
    qs.set('page', String(query.page));
    qs.set('limit', String(query.limit));
    if (query.role) qs.set('role', query.role);
    if (query.status) qs.set('status', query.status);
    if (query.search) qs.set('search', query.search);

    const raw = await apiFetch<any>(`/api/users?${qs.toString()}`);
    return normalizePaginatedResponse<UserListItem>(unwrapApiResponse(raw));
  } catch (error: any) {
    // 401 에러는 인증이 필요한 경우이므로 빈 결과 반환
    if (error?.status === 401) {
      return {
        data: [],
        meta: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    // 다른 에러는 재발생
    throw error;
  }
}

function normalizePaginatedResponse<T>(payload: any): PaginatedResponse<T> {
  const baseMeta = {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  if (Array.isArray(payload)) {
    return {
      data: payload,
      meta: { ...baseMeta, limit: payload.length, total: payload.length },
    };
  }

  const data = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {
    ...baseMeta,
    limit: data.length,
    total: data.length,
  };

  return {
    data,
    meta,
  };
}

