'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    Menu,
    X,
    Upload,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const ADMIN_ROLE = 'ADMIN';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/urunler', label: 'Ürünler', icon: Package },
    { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
    { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.push('/');
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    // Access Control Check
    const userEmail = session?.user?.email;
    // Allow access if role is ADMIN OR if email matches the super admin email (failsafe)
    const isAdmin = (session?.user as any)?.role === ADMIN_ROLE || userEmail === 'seyyidoter3547@gmail.com';

    if (!session || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-red-600 dark:text-red-400">Erişim Reddedildi</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Bu panele erişim yetkiniz bulunmamaktadır. Sadece yöneticiler giriş yapabilir.
                        </p>

                        {!session ? (
                            <Button
                                onClick={() => router.push('/giris?callbackUrl=/admin')}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                            >
                                Giriş Yap
                            </Button>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Giriş yapılan hesap:</p>
                                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{session.user?.email}</p>
                            </div>
                        )}

                        <Link href="/">
                            <Button variant="ghost" className="w-full">
                                Ana Sayfaya Dön
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-16 flex items-center justify-between px-4">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold">M</span>
                    </div>
                    <span className="font-bold">Admin</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r transition-transform duration-300',
                    'lg:translate-x-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="font-bold">Admin Panel</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                pathname === item.href
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Trendyol Import Button */}
                <div className="p-4 border-t mt-auto">
                    <Button
                        variant="outline"
                        className="w-full gap-2 opacity-50 cursor-not-allowed"
                        disabled
                    >
                        <Upload className="h-4 w-4" />
                        Trendyol&apos;dan İçe Aktar
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        API entegrasyonu bekleniyor
                    </p>
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 mb-2">
                            <Package className="h-5 w-5" />
                            Mağazayı Görüntüle
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        Çıkış Yap
                    </Button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
