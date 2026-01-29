'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { categories } from '@/data/categories';
import { ProductFilters } from '@/types';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
    filters: ProductFilters;
    onUpdate: (filters: Partial<ProductFilters>) => void;
    onClear: () => void;
    className?: string;
}

export function FilterSidebar({ filters, onUpdate, onClear, className }: FilterSidebarProps) {
    // Local state to prevent focus loss and re-renders while typing
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');

    // Sync remote filters to local state when they change URL-side
    useEffect(() => {
        setLocalMinPrice(filters.minPrice?.toString() || '');
        setLocalMaxPrice(filters.maxPrice?.toString() || '');
    }, [filters.minPrice, filters.maxPrice]);

    const handlePriceBlur = () => {
        onUpdate({
            minPrice: localMinPrice ? Number(localMinPrice) : undefined,
            maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
        });
    };

    const handlePriceKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handlePriceBlur();
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between lg:hidden">
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <Filter className="h-5 w-5" />
                    Filtreler
                </div>
                {/* Clear Filters (Mobile) */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4 mr-2" />
                    Temizle
                </Button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center gap-2 font-semibold text-lg mb-4">
                <Filter className="h-5 w-5" />
                Filtreler
            </div>

            {/* Search */}
            <div>
                <Label htmlFor="search-input" className="text-sm font-medium">Ara</Label>
                <Input
                    id="search-input"
                    placeholder="Ürün ara..."
                    value={filters.search || ''}
                    onChange={(e) => onUpdate({ search: e.target.value || undefined })}
                    className="mt-2"
                />
            </div>

            <Separator />

            {/* Categories */}
            <div>
                <Label className="text-sm font-medium mb-3 block">Kategori</Label>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <Label className="flex items-center gap-2 text-sm cursor-pointer font-normal hover:text-primary transition-colors">
                                <Checkbox
                                    checked={filters.categoryId === cat.id}
                                    onCheckedChange={(checked) =>
                                        onUpdate({ categoryId: checked ? cat.id : undefined })
                                    }
                                />
                                <span>{cat.name}</span>
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
                        aria-label="En düşük fiyat"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        onBlur={handlePriceBlur}
                        onKeyDown={handlePriceKeyDown}
                        className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Input
                        type="number"
                        placeholder="Max"
                        aria-label="En yüksek fiyat"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        onBlur={handlePriceBlur}
                        onKeyDown={handlePriceKeyDown}
                        className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>

            <Separator />

            {/* Clear Filters (Desktop) */}
            <Button
                variant="outline"
                className="w-full hidden lg:flex"
                onClick={onClear}
            >
                <X className="h-4 w-4 mr-2" />
                Filtreleri Temizle
            </Button>
        </div>
    );
}
