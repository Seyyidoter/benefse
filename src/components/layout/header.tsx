'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    Search,
    ShoppingBag,
    Menu,
    X,
    User,
    ChevronDown,
    Heart,
    Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/store';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

export function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const itemCount = useCartStore((state) => state.getItemCount());

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/urunler?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full transition-all duration-300',
                isScrolled
                    ? 'bg-background/95 backdrop-blur-md shadow-md'
                    : 'bg-background'
            )}
        >
            {/* Top Bar - Demo Notice */}
            <div className="bg-[#2a2a2a] text-white text-center py-2 text-sm">
                <span className="text-[#e91e8c]">✨</span> Demo Modu - Gerçek ödeme alınmamaktadır{' '}
                <span className="text-[#e91e8c]">✨</span>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#2a2a2a]">
                            <Image
                                src="/logo.png"
                                alt="Benefse"
                                fill
                                className="object-contain p-1"
                                priority
                            />
                        </div>
                        <span className="hidden sm:block text-2xl font-serif font-bold text-[#2a2a2a] dark:text-[#f5f0e8]">
                            Benefse
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link
                            href="/"
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-[#e91e8c]',
                                pathname === '/' ? 'text-[#e91e8c]' : 'text-foreground'
                            )}
                        >
                            Ana Sayfa
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#e91e8c]">
                                Kategoriler <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-56">
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.id} asChild>
                                        <Link
                                            href={`/kategori/${category.slug}`}
                                            className="cursor-pointer"
                                        >
                                            {category.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link
                            href="/urunler"
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-[#e91e8c]',
                                pathname === '/urunler' ? 'text-[#e91e8c]' : 'text-foreground'
                            )}
                        >
                            Tüm Ürünler
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 max-w-md"
                    >
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Ürün ara..."
                                className="w-full pl-10 bg-muted/50 border-0 focus-visible:ring-[#e91e8c]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Favorites - Hidden for now */}
                        <Button variant="ghost" size="icon" className="hidden sm:flex" disabled>
                            <Heart className="h-5 w-5" />
                        </Button>

                        {/* Account */}
                        <Link href="/hesabim">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Cart */}
                        <Link href="/sepet">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBag className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#e91e8c] hover:bg-[#e91e8c]">
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#2a2a2a]">
                                            <Image
                                                src="/logo.png"
                                                alt="Benefse"
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <span className="font-serif">Benefse</span>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Mobile Search */}
                                <form onSubmit={handleSearch} className="mt-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Ürün ara..."
                                            className="w-full pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </form>

                                {/* Mobile Navigation */}
                                <nav className="mt-6 flex flex-col gap-2">
                                    <Link
                                        href="/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <Home className="h-5 w-5" />
                                        Ana Sayfa
                                    </Link>

                                    <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                                        Kategoriler
                                    </div>
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/kategori/${category.slug}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-8 py-2 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}

                                    <Link
                                        href="/urunler"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors border-t mt-2 pt-4"
                                    >
                                        Tüm Ürünler
                                    </Link>

                                    <Link
                                        href="/hesabim"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <User className="h-5 w-5" />
                                        Hesabım
                                    </Link>
                                </nav>

                                {/* Admin Link */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <Link href="/admin">
                                        <Button variant="outline" className="w-full" size="sm">
                                            Admin Paneli
                                        </Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header >
    );
}
