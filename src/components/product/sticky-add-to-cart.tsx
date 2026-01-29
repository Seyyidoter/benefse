'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StickyAddToCartProps {
    product: Product;
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    // Scroll kontrolü: Kullanıcı sayfayı biraz aşağı kaydırdığında barı göster
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const triggerPosition = 300; // 300px aşağı inince göster
            setIsVisible(scrollPosition > triggerPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images[0] || '/placeholder.jpg',
        });
        toast.success('Sepete eklendi');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t p-3 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3">
                {/* Product Image & Title */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                            src={product.images[0] || '/placeholder.jpg'}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-medium truncate">{product.title}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#e91e8c]">
                                {(product.salePrice || product.price).toLocaleString('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY',
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Add Button */}
                <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="bg-[#e91e8c] hover:bg-[#d11a7d] text-white shrink-0"
                    disabled={product.stock === 0}
                >
                    <ShoppingBag className="w-4 h-4 mr-1.5" />
                    Ekle
                </Button>
            </div>
        </div>
    );
}
