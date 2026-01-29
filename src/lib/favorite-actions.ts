'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export interface FavoriteItem {
    id: string;
    productId: string;
    title: string;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
}

// Add product to favorites
export async function addToFavorites(data: {
    productId: string;
    title: string;
    price: number;
    imageUrl?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        // Check if already in favorites
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: data.productId,
                },
            },
        });

        if (existing) {
            return { success: false, error: 'Bu ürün zaten favorilerinizde' };
        }

        await prisma.favorite.create({
            data: {
                userId: session.user.id,
                productId: data.productId,
                title: data.title,
                price: data.price,
                imageUrl: data.imageUrl || null,
            },
        });

        revalidatePath('/hesabim');
        revalidatePath('/favorilerim');

        return { success: true };
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return { success: false, error: 'Bir hata oluştu' };
    }
}

// Remove product from favorites
export async function removeFromFavorites(productId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        await prisma.favorite.deleteMany({
            where: {
                userId: session.user.id,
                productId: productId,
            },
        });

        revalidatePath('/hesabim');
        revalidatePath('/favorilerim');

        return { success: true };
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return { success: false, error: 'Bir hata oluştu' };
    }
}

// Get user's favorites
export async function getUserFavorites(): Promise<FavoriteItem[]> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return [];
        }

        const favorites = await prisma.favorite.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return favorites;
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

// Check if product is in favorites
export async function isProductFavorite(productId: string): Promise<boolean> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return false;
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId,
                },
            },
        });

        return !!favorite;
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
}

// Toggle favorite status
export async function toggleFavorite(data: {
    productId: string;
    title: string;
    price: number;
    imageUrl?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız', isFavorite: false };
        }

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: data.productId,
                },
            },
        });

        if (existing) {
            await prisma.favorite.delete({
                where: {
                    id: existing.id,
                },
            });
            revalidatePath('/hesabim');
            revalidatePath('/favorilerim');
            return { success: true, isFavorite: false };
        } else {
            await prisma.favorite.create({
                data: {
                    userId: session.user.id,
                    productId: data.productId,
                    title: data.title,
                    price: data.price,
                    imageUrl: data.imageUrl || null,
                },
            });
            revalidatePath('/hesabim');
            revalidatePath('/favorilerim');
            return { success: true, isFavorite: true };
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return { success: false, error: 'Bir hata oluştu', isFavorite: false };
    }
}
