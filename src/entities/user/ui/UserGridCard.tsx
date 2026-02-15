import type { UserListItem } from '@/shared/types/api';
import {
    formatDate,
    formatWebsite,
    getRoleBadge,
    getRoleLabel,
    getStatusBadge,
    getStatusLabel,
} from '../lib/utils';

export function UserGridCard({ user }: { user: UserListItem }) {
    const primary = user.displayName ?? '이름 미등록';
    const secondary = user.email ?? '이메일 정보 없음';
    const initial = (primary || secondary).charAt(0).toUpperCase();

    return (
        <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6">
            <div className="flex items-center space-x-3 mb-4">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={primary}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100"
                    />
                ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{initial}</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{primary}</h3>
                    <p className="text-sm text-gray-500 truncate">{secondary}</p>
                    {user.website && (
                        <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            {formatWebsite(user.website)}
                        </a>
                    )}
                </div>
            </div>

            {user.bio && (
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">{user.bio}</p>
            )}

            <div className="flex items-center justify-between mb-4">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                >
                    {getRoleLabel(user.role)}
                </span>
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}
                >
                    {getStatusLabel(user.status)}
                </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-xs text-gray-500">
                <span>가입일: {formatDate(user.createdAt)}</span>
                <span>최근 로그인: {formatDate(user.lastLoginAt)}</span>
            </div>
        </div>
    );
}
