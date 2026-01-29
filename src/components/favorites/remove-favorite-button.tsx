'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeFromFavorites } from '@/lib/favorite-actions';
import { toast } from 'sonner';

interface RemoveFavoriteButtonProps {
    productId: string;
}

export function RemoveFavoriteButton({ productId }: RemoveFavoriteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleRemove() {
        setIsLoading(true);
        try {
            const result = await removeFromFavorites(productId);
            if (result.success) {
                toast.success('Favorilerden kaldırıldı');
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-red-100 dark:bg-gray-900/90"
            onClick={handleRemove}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4 text-red-500" />
            )}
        </Button>
    );
}
