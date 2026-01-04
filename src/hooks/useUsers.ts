import { useEffect, useMemo, useState } from 'react';
import { fetchUsers } from '@/services/users';
import type { ApiMeta, UserListItem, UserRole, UserStatus } from '@/types/api';
import { sortUsers } from '@/components/users/utils';

type RoleFilter = 'ALL' | UserRole;
type StatusFilter = 'ALL' | UserStatus;
type SortKey = 'newest' | 'oldest' | 'name';

const PAGE_SIZE = 12;

export function useUsers() {
  const [rawUsers, setRawUsers] = useState<UserListItem[]>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [reloadFlag, setReloadFlag] = useState(0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const payload = await fetchUsers({
          page: currentPage,
          limit: PAGE_SIZE,
          role: roleFilter === 'ALL' ? undefined : roleFilter,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          search: debouncedSearch || undefined,
        });

        if (cancelled) {
          return;
        }

        setRawUsers(payload.data);
        setMeta(payload.meta);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setRawUsers([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : '사용자 목록을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [currentPage, roleFilter, statusFilter, debouncedSearch, reloadFlag]);

  // Sort users
  useEffect(() => {
    setUsers(sortUsers([...rawUsers], sortBy));
  }, [rawUsers, sortBy]);

  const summary = useMemo(() => {
    const activeCount = rawUsers.filter((user) => user.status === 'ACTIVE').length;
    const recentCount = rawUsers.filter((user) => {
      if (!user.lastLoginAt) {
        return false;
      }
      const diff = Date.now() - new Date(user.lastLoginAt).getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      total: meta?.total ?? rawUsers.length,
      pageCount: rawUsers.length,
      activeCount,
      recentCount,
    };
  }, [rawUsers, meta]);

  const canGoPrev = meta?.hasPrev ?? currentPage > 1;
  const canGoNext = meta?.hasNext ?? false;

  const handleRetry = () => setReloadFlag((flag) => flag + 1);

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return {
    users,
    meta,
    loading,
    error,
    summary,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    canGoPrev,
    canGoNext,
    handleRetry,
    resetFilters,
  };
}

