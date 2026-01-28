'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCard, ProductGridSkeleton } from '@/components/product';
import { getCatalogAdapter } from '@/adapters';
import { Product, ProductFilters } from '@/types';
import { categories } from '@/data/categories';

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Filter state
    const [filters, setFilters] = useState<ProductFilters>({
        search: searchParams.get('search') || undefined,
        categoryId: searchParams.get('category') || undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        inStock: searchParams.get('inStock') === 'true',
        sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || 'newest',
    });

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all products from API to perform client-side filtering
            // In a real large-scale app, we would perform filtering on the backend
            const response = await fetch('/api/products?size=100');
            const data = await response.json();

            let filteredProducts = data.products as Product[];

            // Apply Filters Client-Side
            // 1. Search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredProducts = filteredProducts.filter(p =>
                    p.title.toLowerCase().includes(searchLower) ||
                    p.description.toLowerCase().includes(searchLower)
                );
            }

            // 2. Category
            if (filters.categoryId) {
                filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
            }

            // 3. Price
            if (filters.minPrice !== undefined) {
                filteredProducts = filteredProducts.filter(p => (p.salePrice || p.price) >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                filteredProducts = filteredProducts.filter(p => (p.salePrice || p.price) <= filters.maxPrice!);
            }

            // 4. Stock
            if (filters.inStock) {
                filteredProducts = filteredProducts.filter(p => p.stock > 0);
            }

            // 5. Sort
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'price-asc':
                        filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
                        break;
                    case 'price-desc':
                        filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
                        break;
                    case 'newest':
                        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        break;
                    case 'name':
                        filteredProducts.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
                        break;
                }
            }

            setProducts(filteredProducts);
            setTotal(filteredProducts.length);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const updateFilters = (newFilters: Partial<ProductFilters>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);

        // Update URL
        const params = new URLSearchParams();
        if (updated.search) params.set('search', updated.search);
        if (updated.categoryId) params.set('category', updated.categoryId);
        if (updated.minPrice) params.set('minPrice', String(updated.minPrice));
        if (updated.maxPrice) params.set('maxPrice', String(updated.maxPrice));
        if (updated.inStock) params.set('inStock', 'true');
        if (updated.sortBy) params.set('sort', updated.sortBy);

        router.push(`/urunler?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        setFilters({ sortBy: 'newest' });
        router.push('/urunler', { scroll: false });
    };

    const activeFilterCount = [
        filters.search,
        filters.categoryId,
        filters.minPrice,
        filters.maxPrice,
        filters.inStock,
    ].filter(Boolean).length;

    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <Label className="text-sm font-medium">Ara</Label>
                <Input
                    type="search"
                    placeholder="Ürün ara..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ search: e.target.value || undefined })}
                    className="mt-2"
                />
            </div>

            <Separator />

            {/* Categories */}
            <div>
                <Label className="text-sm font-medium">Kategori</Label>
                <div className="mt-2 space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-2">
                            <Checkbox
                                id={cat.id}
                                checked={filters.categoryId === cat.id}
                                onCheckedChange={(checked) =>
                                    updateFilters({ categoryId: checked ? cat.id : undefined })
                                }
                            />
                            <Label htmlFor={cat.id} className="text-sm cursor-pointer">
                                {cat.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <Label className="text-sm font-medium">Fiyat Aralığı</Label>
                <div className="mt-2 flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) =>
                            updateFilters({
                                minPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                        className="w-full"
                    />
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) =>
                            updateFilters({
                                maxPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                        className="w-full"
                    />
                </div>
            </div>

            <Separator />

            {/* In Stock */}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="inStock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
                />
                <Label htmlFor="inStock" className="text-sm cursor-pointer">
                    Sadece stokta olanlar
                </Label>
            </div>

            <Separator />

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Filtreleri Temizle
                </Button>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Tüm Ürünler</h1>
                <p className="text-muted-foreground">
                    {total} ürün bulundu
                    {filters.search && ` "${filters.search}" için`}
                </p>
            </div>

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <Filter className="h-5 w-5" />
                            <h2 className="font-semibold">Filtreler</h2>
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary">{activeFilterCount}</Badge>
                            )}
                        </div>
                        <FilterPanel />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        {/* Mobile Filter */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filtrele
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary">{activeFilterCount}</Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Filtreler</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FilterPanel />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Sort */}
                        <div className="flex items-center gap-2 ml-auto">
                            <Label className="text-sm text-muted-foreground hidden sm:block">
                                Sırala:
                            </Label>
                            <Select
                                value={filters.sortBy || 'newest'}
                                onValueChange={(value) =>
                                    updateFilters({ sortBy: value as ProductFilters['sortBy'] })
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">En Yeni</SelectItem>
                                    <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                                    <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                                    <SelectItem value="name">İsme Göre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : products.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground mb-4">
                                Ürün bulunamadı
                            </p>
                            <Button variant="outline" onClick={clearFilters}>
                                Filtreleri Temizle
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductsContent />
        </Suspense>
    );
}
