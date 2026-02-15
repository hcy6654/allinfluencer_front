import type { ReactNode } from 'react';

export function SummaryCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
                {icon}
                <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-600">{label}</p>
                </div>
            </div>
        </div>
    );
}
