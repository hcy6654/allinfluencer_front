import type { UserListItem } from '@/types/api';
import { formatDate, getRoleBadge, getRoleLabel, getStatusBadge, getStatusLabel } from './utils';

export function UserListCard({ user }: { user: UserListItem }) {
  const primary = user.displayName ?? '이름 미등록';
  const secondary = user.email ?? '이메일 정보 없음';
  const initial = (primary || secondary).charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img src={user.avatar} alt={primary} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{initial}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{primary}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
              {getStatusLabel(user.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2 truncate">{secondary}</p>
          {user.bio && (
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">{user.bio}</p>
          )}
        </div>

        <div className="text-right text-xs text-gray-500 space-y-1">
          <p>가입 {formatDate(user.createdAt)}</p>
          <p>최근 {formatDate(user.lastLoginAt)}</p>
        </div>
      </div>
    </div>
  );
}

