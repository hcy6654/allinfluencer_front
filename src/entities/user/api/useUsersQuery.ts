'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserRole, UserStatus } from '@/shared/types/api';
import { fetchUsers } from './fetchUsers';
import { sortUsers } from '../lib/utils';

type RoleFilter = 'ALL' | UserRole;
type StatusFilter = 'ALL' | UserStatus;
type SortKey = 'newest' | 'oldest' | 'name';

const PAGE_SIZE = 12;

export const usersKeys = {
    all: ['users'] as const,
    list: (params: object) => ['users', 'list', params] as const,
};

export function useUsersQuery() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [sortBy, setSortBy] = useState<SortKey>('newest');

    // Debounce search term
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        clearTimeout((handleSearchChange as any)._timer);
        (handleSearchChange as any)._timer = setTimeout(() => setDebouncedSearch(value), 300);
    };

    const queryParams = {
        page: currentPage,
        limit: PAGE_SIZE,
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: debouncedSearch || undefined,
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: usersKeys.list(queryParams),
        queryFn: () => fetchUsers(queryParams),
    });

    const rawUsers = data?.data ?? [];
    const meta = data?.meta ?? null;

    const users = useMemo(() => sortUsers([...rawUsers], sortBy), [rawUsers, sortBy]);

    const summary = useMemo(() => {
        const activeCount = rawUsers.filter((user) => user.status === 'ACTIVE').length;
        const recentCount = rawUsers.filter((user) => {
            if (!user.lastLoginAt) return false;
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

    const resetFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setRoleFilter('ALL');
        setStatusFilter('ALL');
        setSortBy('newest');
        setCurrentPage(1);
    };

    return {
        users,
        meta,
        loading: isLoading,
        error: error ? (error instanceof Error ? error.message : '사용자 목록을 불러오지 못했습니다.') : null,
        summary,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm: handleSearchChange,
        roleFilter,
        setRoleFilter,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        canGoPrev,
        canGoNext,
        handleRetry: refetch,
        resetFilters,
    };
}
