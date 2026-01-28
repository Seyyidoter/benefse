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

const ADMIN_PASSWORD_KEY = 'admin_authenticated';
const DEMO_PASSWORD = 'demo123'; // In production, use env variable

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/urunler', label: 'Ürünler', icon: Package },
    { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
    { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Check if already authenticated
        const auth = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
        if (auth === 'true') {
            setIsAuthenticated(true);
        } else {
            setShowLoginDialog(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = () => {
        if (password === DEMO_PASSWORD) {
            sessionStorage.setItem(ADMIN_PASSWORD_KEY, 'true');
            setIsAuthenticated(true);
            setShowLoginDialog(false);
            toast.success('Admin paneline giriş yapıldı');
        } else {
            toast.error('Yanlış şifre');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
        setIsAuthenticated(false);
        router.push('/');
        toast.success('Çıkış yapıldı');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    // Login Dialog
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <CardTitle>Admin Paneli</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-orange-700 dark:text-orange-300">
                                        Demo şifresi: <strong>demo123</strong>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password">Şifre</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Admin şifresi"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                    className="mt-2"
                                />
                            </div>

                            <Button
                                onClick={handleLogin}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                            >
                                Giriş Yap
                            </Button>

                            <Link href="/">
                                <Button variant="ghost" className="w-full">
                                    Ana Sayfaya Dön
                                </Button>
                            </Link>
                        </div>
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
