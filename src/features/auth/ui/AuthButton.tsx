'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';

import type { AuthUser } from '@/shared/types/api';
import { fetchCurrentUser, logout } from '../api/authService';

function roleLabel(role: AuthUser['role']) {
    switch (role) {
        case 'ADVERTISER':
            return '광고주';
        case 'INFLUENCER':
            return '인플루언서';
        case 'ADMIN':
            return '관리자';
        default:
            return '사용자';
    }
}

function myPageHref(user: AuthUser) {
    if (user.role === 'ADVERTISER') return '/my/advertiser';
    return '/my/influencer';
}

export default function AuthButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingLogout, setPendingLogout] = useState(false);
    const [open, setOpen] = useState(false);
    const hasInitializedRef = useRef(false);
    const hadUserRef = useRef(false);

    useEffect(() => {
        let mounted = true;

        async function load() {
            if (!hasInitializedRef.current) {
                setLoading(true);
            }

            const result = await fetchCurrentUser();

            if (!mounted) return;

            const hadUser = hadUserRef.current;
            const nextUser = result.user;

            if (result.unauthorized && hadUser) {
                setUser(null);
                setOpen(false);
                hadUserRef.current = false;
                hasInitializedRef.current = true;
                setLoading(false);
                router.push('/');
                router.refresh();
                return;
            }

            setUser(nextUser);
            hadUserRef.current = !!nextUser;
            hasInitializedRef.current = true;
            setLoading(false);
        }

        load();
        return () => {
            mounted = false;
        };
    }, [pathname, router]);

    useEffect(() => {
        function onDocumentClick(e: MouseEvent) {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            if (!target.closest('[data-user-menu-root="true"]')) {
                setOpen(false);
            }
        }

        document.addEventListener('click', onDocumentClick);
        return () => document.removeEventListener('click', onDocumentClick);
    }, []);

    useEffect(() => {
        async function revalidateOnFocus() {
            const result = await fetchCurrentUser();
            const hadUser = hadUserRef.current;

            if (result.unauthorized && hadUser) {
                setUser(null);
                setOpen(false);
                hadUserRef.current = false;
                router.push('/');
                router.refresh();
                return;
            }

            setUser(result.user);
            hadUserRef.current = !!result.user;
        }

        window.addEventListener('focus', revalidateOnFocus);
        return () => window.removeEventListener('focus', revalidateOnFocus);
    }, [router]);

    const handleLogout = async () => {
        setPendingLogout(true);
        try {
            await logout();
            setUser(null);
            router.push('/');
            router.refresh();
        } catch {
            alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setPendingLogout(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm text-gray-600">확인 중...</span>
            </div>
        );
    }

    if (user) {
        const primary = user.displayName || '사용자';
        const companyName = user.advertiserCompany?.companyName;
        const industry = user.advertiserCompany?.industry;
        const secondary =
            user.role === 'ADVERTISER'
                ? companyName
                    ? industry
                        ? `${companyName} · ${industry}`
                        : companyName
                    : '회사 정보 미등록'
                : roleLabel(user.role);

        return (
            <div className="relative" data-user-menu-root="true">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={open}
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={primary}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                        </div>
                    )}

                    <div className="hidden sm:flex flex-col items-start leading-tight">
                        <span className="text-sm font-semibold text-gray-800">{primary}</span>
                        <span className="text-xs text-gray-500">{secondary}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {open && (
                    <div
                        className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg overflow-hidden"
                        role="menu"
                    >
                        <div className="px-4 py-3 border-b">
                            <div className="text-sm font-semibold text-gray-900">{primary}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{secondary}</div>
                        </div>

                        <div className="py-1">
                            <Link
                                href={myPageHref(user)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                마이페이지
                            </Link>
                            <Link
                                href="/settings/accounts"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                <Settings className="w-4 h-4" />
                                계정 관리
                            </Link>
                        </div>

                        <div className="border-t">
                            <button
                                onClick={handleLogout}
                                disabled={pendingLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                role="menuitem"
                            >
                                {pendingLogout ? (
                                    <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <LogOut className="w-4 h-4" />
                                )}
                                <span>{pendingLogout ? '로그아웃 중' : '로그아웃'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
            <User className="w-4 h-4" />
            로그인
        </Link>
    );
}
