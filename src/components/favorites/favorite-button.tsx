'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavorite, isProductFavorite } from '@/lib/favorite-actions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    productId: string;
    title: string;
    price: number;
    imageUrl?: string;
    variant?: 'default' | 'icon';
    className?: string;
}

export function FavoriteButton({
    productId,
    title,
    price,
    imageUrl,
    variant = 'default',
    className,
}: FavoriteButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check if product is already in favorites
    useEffect(() => {
        async function checkFavorite() {
            if (status === 'loading') return;
            if (!session?.user) {
                setIsChecking(false);
                return;
            }

            try {
                const result = await isProductFavorite(productId);
                setIsFavorite(result);
            } catch (error) {
                console.error('Error checking favorite:', error);
            } finally {
                setIsChecking(false);
            }
        }

        checkFavorite();
    }, [productId, session, status]);

    async function handleToggle() {
        if (!session?.user) {
            toast.error('Favorilere eklemek için giriş yapmalısınız');
            router.push(`/giris?callbackUrl=/urun/${productId}`);
            return;
        }

        setIsLoading(true);
        try {
            const result = await toggleFavorite({
                productId,
                title,
                price,
                imageUrl,
            });

            if (result.success) {
                setIsFavorite(result.isFavorite);
                toast.success(result.isFavorite ? 'Favorilere eklendi' : 'Favorilerden kaldırıldı');
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    if (variant === 'icon') {
        return (
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    'h-9 w-9 rounded-full',
                    isFavorite && 'text-pink-500',
                    className
                )}
                onClick={handleToggle}
                disabled={isLoading || isChecking}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
                )}
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            className={cn('flex-1 gap-2', isFavorite && 'text-pink-500 border-pink-500', className)}
            onClick={handleToggle}
            disabled={isLoading || isChecking}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
            )}
            {isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}
        </Button>
    );
}
