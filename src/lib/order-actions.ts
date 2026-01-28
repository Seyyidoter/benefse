'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// ============================================
// Types
// ============================================

export type OrderItem = {
    productId: string;
    barcode?: string;
    title: string;
    price: number;
    quantity: number;
    variantId?: string;
    variantName?: string;
    imageUrl?: string;
};

export type AddressData = {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    postalCode?: string;
};

export type CreateOrderData = {
    items: OrderItem[];
    address: AddressData;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    notes?: string;
};

export type OrderResult = {
    success: boolean;
    orderId?: string;
    error?: string;
};

// ============================================
// Create Order Action
// ============================================

export async function createOrder(data: CreateOrderData): Promise<OrderResult> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Sipariş oluşturmak için giriş yapmalısınız',
            };
        }

        const userId = session.user.id;

        // Create order with items and address in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: 'PENDING',
                    subtotal: data.subtotal,
                    shipping: data.shipping,
                    discount: data.discount,
                    total: data.total,
                    notes: data.notes,
                },
            });

            // Create order items
            await tx.orderItem.createMany({
                data: data.items.map((item) => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    barcode: item.barcode,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    variantId: item.variantId,
                    variantName: item.variantName,
                    imageUrl: item.imageUrl,
                })),
            });

            // Create address
            await tx.address.create({
                data: {
                    orderId: newOrder.id,
                    fullName: data.address.fullName,
                    phone: data.address.phone,
                    email: data.address.email,
                    city: data.address.city,
                    district: data.address.district,
                    neighborhood: data.address.neighborhood,
                    address: data.address.address,
                    postalCode: data.address.postalCode,
                },
            });

            return newOrder;
        });

        // Revalidate user's orders page
        revalidatePath('/hesabim');
        revalidatePath('/hesabim/siparisler');

        return {
            success: true,
            orderId: order.id,
        };
    } catch (error) {
        console.error('Create order error:', error);
        return {
            success: false,
            error: 'Sipariş oluşturulurken bir hata oluştu',
        };
    }
}

// ============================================
// Get User Orders
// ============================================

export async function getUserOrders() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return [];
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: true,
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return orders;
    } catch (error) {
        console.error('Get orders error:', error);
        return [];
    }
}

// ============================================
// Get Single Order
// ============================================

export async function getOrder(orderId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return null;
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: session.user.id, // Ensure user can only see their own orders
            },
            include: {
                items: true,
                address: true,
            },
        });

        return order;
    } catch (error) {
        console.error('Get order error:', error);
        return null;
    }
}
