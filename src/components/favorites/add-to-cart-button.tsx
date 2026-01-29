'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';

interface AddToCartButtonProps {
    productId: string;
    title: string;
    price: number;
    imageUrl?: string;
}

export function AddToCartButton({ productId, title, price, imageUrl }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);

    function handleAddToCart() {
        addItem({
            productId: productId,
            title,
            price,
            image: imageUrl,
        });
        toast.success('Sepete eklendi');
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleAddToCart}
        >
            <ShoppingCart className="h-4 w-4" />
        </Button>
    );
}
