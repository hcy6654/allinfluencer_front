import AdminInfluencerApprovals from './sections/AdminInfluencerApprovals';
import AdminAdvertiserApprovals from './sections/AdminAdvertiserApprovals';

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <div className="text-xl font-semibold text-gray-900">승인 관리</div>
        <div className="mt-2 text-sm text-gray-600">
          관리자 승인(인플루언서 가입) 및 인증 상태를 관리합니다.
        </div>
      </div>

      <AdminInfluencerApprovals />
      <AdminAdvertiserApprovals />
    </div>
  );
}

