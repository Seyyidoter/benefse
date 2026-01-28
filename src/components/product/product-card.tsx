'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store';
import { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images[0] || '/placeholder.jpg',
        });

        toast.success('Sepete eklendi', {
            description: product.title,
        });
    };

    return (
        <Link href={`/urun/${product.id}`}>
            <Card
                className={cn(
                    'group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300',
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#f5f0e8] dark:bg-[#2a2a2a]">
                    <Image
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {hasDiscount && (
                            <Badge className="bg-[#e91e8c] hover:bg-[#e91e8c]">
                                %{discountPercentage}
                            </Badge>
                        )}
                        {product.stock === 0 && (
                            <Badge variant="secondary" className="bg-gray-800 text-white">
                                Tükendi
                            </Badge>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                            <Badge variant="secondary" className="bg-[#c9a962] text-[#2a2a2a]">
                                Son {product.stock}
                            </Badge>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div
                        className={cn(
                            'absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300',
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        )}
                    >
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.info('Favorilere eklendi');
                            }}
                        >
                            <Heart className="h-4 w-4 text-[#2a2a2a]" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md"
                        >
                            <Eye className="h-4 w-4 text-[#2a2a2a]" />
                        </Button>
                    </div>

                    {/* Add to Cart */}
                    {product.stock > 0 && (
                        <div
                            className={cn(
                                'absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300',
                                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            )}
                        >
                            <Button
                                className="w-full bg-[#e91e8c] hover:bg-[#d11a7d] text-white gap-2"
                                size="sm"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Sepete Ekle
                            </Button>
                        </div>
                    )}
                </div>

                {/* Info */}
                <CardContent className="p-4">
                    <p className="text-xs text-[#e91e8c] font-medium mb-1">
                        {product.brand}
                    </p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-[#e91e8c] transition-colors">
                        {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="font-bold text-[#e91e8c]">
                                    {product.salePrice!.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    {product.price.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </>
                        ) : (
                            <span className="font-bold text-foreground">
                                {product.price.toLocaleString('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY',
                                })}
                            </span>
                        )}
                    </div>

                    {/* Free Shipping Badge */}
                    {(product.salePrice || product.price) >= 500 && (
                        <div className="mt-2">
                            <span className="text-xs text-[#c9a962] font-medium">
                                🚚 Ücretsiz Kargo
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
