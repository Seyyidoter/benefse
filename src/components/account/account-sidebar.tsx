'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    User,
    MapPin,
    Package,
    Heart,
    LogOut,
    Store
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
    { href: '/hesabim', label: 'Kişisel Bilgilerim', icon: User },
    { href: '/adreslerim', label: 'Adres Bilgileri', icon: MapPin },
    // { href: '/siparislerim', label: 'Siparişlerim', icon: Package }, // Bunu daha sonra ekleyebiliriz veya varsa aktif ederiz
    { href: '/favorilerim', label: 'Favorilerim', icon: Heart },
];

export function AccountSidebar({ userName, isAdmin }: { userName?: string, isAdmin?: boolean }) {
    const pathname = usePathname();

    return (
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="hidden md:block px-4">
                <h2 className="text-xl font-bold">Hoşgeldiniz</h2>
                <p className="text-lg font-medium text-primary mt-1">{userName}</p>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-sm text-gray-500 hover:text-red-500 mt-2 underline"
                >
                    Çıkış Yap
                </button>
            </div>

            <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                                isActive
                                    ? 'bg-gradient-to-r from-purple-600/10 to-pink-500/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <Store className="w-4 h-4" />
                        Yönetici Paneli
                    </Link>
                )}

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left mt-4"
                >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                </button>
            </nav>
        </div>
    );
}
