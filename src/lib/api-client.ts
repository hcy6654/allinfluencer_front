/**
 * Next.js 앱 내부에서 사용하는 간단한 API 호출 유틸.
 *
 * 클라이언트는 `/api/*`로 호출하면 next.config.js rewrite가 백엔드(`/api/v1/*`)로 프록시합니다.
 * 인증은 httpOnly 쿠키 기반이므로 `credentials: 'include'`를 항상 사용합니다.
 */

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.headers ?? {}),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err: any = new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }

  // 204 No Content 케이스 방어
  if (res.status === 204) return undefined as unknown as T;

  return (await res.json()) as T;
}


