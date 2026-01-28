'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, User, Search } from 'lucide-react';
import { useCartStore } from '@/store';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { categories } from '@/data/categories';
import Image from 'next/image';

export function MobileNav() {
    const pathname = usePathname();
    const itemCount = useCartStore((state) => state.getItemCount());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/urunler?q=${encodeURIComponent(searchQuery)}`;
            setIsMenuOpen(false);
        }
    };

    const navItems = [
        {
            href: '/',
            label: 'Ana Sayfa',
            icon: Home,
            isActive: pathname === '/',
        },
        {
            label: 'Kategoriler',
            icon: Grid,
            isTrigger: true, // Special handling for opening menu
        },
        {
            href: '/sepet',
            label: 'Sepetim',
            icon: ShoppingBag,
            isActive: pathname === '/sepet',
            badge: itemCount,
        },
        {
            href: '/hesabim',
            label: 'Hesabım',
            icon: User,
            isActive: pathname === '/hesabim',
        },
    ];

    return (
        <>
            {/* Spacer to prevent content from being hidden behind the fixed nav */}
            <div className="h-16 md:hidden" />

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 md:hidden safe-area-bottom shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
                <nav className="flex items-center justify-around h-16">
                    {navItems.map((item, index) => {
                        if (item.isTrigger) {
                            return (
                                <Sheet key={index} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                    <SheetTrigger asChild>
                                        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-primary transition-colors">
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-[10px] font-medium">{item.label}</span>
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                                        <SheetHeader className="pb-4 border-b">
                                            <SheetTitle className="text-left flex items-center gap-2">
                                                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#2a2a2a]">
                                                    <Image
                                                        src="/logo.png"
                                                        alt="Benefse"
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                Kategoriler & Arama
                                            </SheetTitle>
                                        </SheetHeader>

                                        <div className="py-6 space-y-6 overflow-y-auto max-h-full pb-20">
                                            {/* Search */}
                                            <form onSubmit={handleSearch} className="relative">
                                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="search"
                                                    placeholder="Ürün, kategori veya marka ara..."
                                                    className="w-full pl-10 h-12 bg-muted/50"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    autoFocus
                                                />
                                            </form>

                                            {/* Categories Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {categories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/kategori/${category.slug}`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="group relative h-24 overflow-hidden rounded-xl border bg-muted/30 hover:border-primary/50 transition-all"
                                                    >
                                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
                                                        <Image
                                                            src={category.image || '/placeholder.jpg'}
                                                            alt={category.name}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <span className="absolute bottom-3 left-3 right-3 z-20 text-xs font-medium text-white line-clamp-2">
                                                            {category.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                                <Link
                                                    href="/urunler"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-dashed bg-muted/30 hover:bg-muted/50 transition-colors"
                                                >
                                                    <Grid className="w-6 h-6 text-muted-foreground" />
                                                    <span className="text-xs font-medium">Tüm Ürünler</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href || '#'}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative",
                                    item.isActive
                                        ? "text-[#e91e8c]"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="relative">
                                    <item.icon className={cn("w-5 h-5", item.isActive && "fill-current")} />
                                    {item.badge && item.badge > 0 && (
                                        <Badge className="absolute -top-2 -right-3 h-4 min-w-[16px] flex items-center justify-center p-0.5 text-[10px] bg-[#e91e8c] text-white border-2 border-background">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
