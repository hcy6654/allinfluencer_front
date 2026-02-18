export const approvalKeys = {
  all: ['approvals'] as const,
  influencerList: (params: { cursor?: string; limit?: number }) =>
    ['approvals', 'influencers', 'pending', params] as const,
  influencerCount: () => ['approvals', 'influencers', 'pending', 'count'] as const,
  advertiserList: (params: { cursor?: string; limit?: number }) =>
    ['approvals', 'advertisers', 'pending', params] as const,
  advertiserCount: () => ['approvals', 'advertisers', 'pending', 'count'] as const,
};
