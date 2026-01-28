'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { User, LogOut, Package, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function UserMenu() {
    const { data: session, status } = useSession();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        toast.success('Çıkış yapıldı');
        window.location.href = '/';
    };

    // Loading state
    if (status === 'loading') {
        return (
            <Button variant="ghost" size="icon" disabled>
                <User className="h-5 w-5 animate-pulse" />
            </Button>
        );
    }

    // Not authenticated
    if (!session?.user) {
        return (
            <Link href="/giris">
                <Button variant="ghost" size="icon" title="Giriş Yap">
                    <LogIn className="h-5 w-5" />
                </Button>
            </Link>
        );
    }

    // Authenticated
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    {/* Green dot indicator for logged in */}
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user.name || 'Hesabım'}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/hesabim" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Hesabım
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/hesabim" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Siparişlerim
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
