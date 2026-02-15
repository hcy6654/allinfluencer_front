import { Users as UsersIcon } from 'lucide-react';

export function EmptyState({ onReset }: { onReset: () => void }) {
    return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">조건에 맞는 사용자가 없습니다.</p>
            <button
                onClick={onReset}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                필터 초기화
            </button>
        </div>
    );
}
