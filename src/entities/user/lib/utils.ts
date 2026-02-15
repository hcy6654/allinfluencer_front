import type { UserRole, UserStatus } from '@/shared/types/api';

export function formatDate(value?: string) {
    if (!value) {
        return '기록 없음';
    }
    return new Date(value).toLocaleDateString();
}

export function formatWebsite(url: string) {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace(/^www\./, '') ?? url;
    } catch {
        return url;
    }
}

export function getRoleBadge(role: UserRole) {
    switch (role) {
        case 'ADMIN':
            return 'bg-red-100 text-red-800';
        case 'ADVERTISER':
            return 'bg-green-100 text-green-800';
        case 'INFLUENCER':
        default:
            return 'bg-blue-100 text-blue-800';
    }
}

export function getRoleLabel(role: UserRole) {
    switch (role) {
        case 'ADMIN':
            return '관리자';
        case 'ADVERTISER':
            return '광고주';
        case 'INFLUENCER':
        default:
            return '인플루언서';
    }
}

export function getStatusBadge(status: UserStatus) {
    switch (status) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-800';
        case 'SUSPENDED':
            return 'bg-red-100 text-red-800';
        case 'INACTIVE':
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export function getStatusLabel(status: UserStatus) {
    switch (status) {
        case 'ACTIVE':
            return '활성';
        case 'SUSPENDED':
            return '정지';
        case 'INACTIVE':
        default:
            return '비활성';
    }
}

export function sortUsers<T extends { createdAt: string; displayName?: string | null }>(
    list: T[],
    sortKey: 'newest' | 'oldest' | 'name',
): T[] {
    switch (sortKey) {
        case 'oldest':
            return list.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );
        case 'name':
            return list.sort((a, b) =>
                (a.displayName ?? '').localeCompare(b.displayName ?? ''),
            );
        case 'newest':
        default:
            return list.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
    }
}
