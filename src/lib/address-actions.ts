'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export interface SavedAddressData {
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    postalCode?: string;
    isDefault?: boolean;
}

export interface SavedAddressItem {
    id: string;
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    postalCode: string | null;
    isDefault: boolean;
    createdAt: Date;
}

// Create new address
export async function createAddress(data: SavedAddressData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        // If this is set as default, unset other defaults
        if (data.isDefault) {
            await prisma.savedAddress.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            });
        }

        // Check if this is the first address (make it default)
        const existingCount = await prisma.savedAddress.count({
            where: { userId: session.user.id },
        });

        const address = await prisma.savedAddress.create({
            data: {
                userId: session.user.id,
                title: data.title,
                fullName: data.fullName,
                phone: data.phone,
                city: data.city,
                district: data.district,
                neighborhood: data.neighborhood,
                address: data.address,
                postalCode: data.postalCode || null,
                isDefault: existingCount === 0 ? true : data.isDefault || false,
            },
        });

        revalidatePath('/hesabim');
        revalidatePath('/adreslerim');
        revalidatePath('/checkout');

        return { success: true, address };
    } catch (error) {
        console.error('Error creating address:', error);
        return { success: false, error: 'Bir hata oluştu' };
    }
}

// Update address
export async function updateAddress(addressId: string, data: Partial<SavedAddressData>) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        // Verify ownership
        const existing = await prisma.savedAddress.findUnique({
            where: { id: addressId },
        });

        if (!existing || existing.userId !== session.user.id) {
            return { success: false, error: 'Adres bulunamadı' };
        }

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await prisma.savedAddress.updateMany({
                where: { userId: session.user.id, id: { not: addressId } },
                data: { isDefault: false },
            });
        }

        const address = await prisma.savedAddress.update({
            where: { id: addressId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.fullName && { fullName: data.fullName }),
                ...(data.phone && { phone: data.phone }),
                ...(data.city && { city: data.city }),
                ...(data.district && { district: data.district }),
                ...(data.neighborhood && { neighborhood: data.neighborhood }),
                ...(data.address && { address: data.address }),
                ...(data.postalCode !== undefined && { postalCode: data.postalCode || null }),
                ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
            },
        });

        revalidatePath('/hesabim');
        revalidatePath('/adreslerim');
        revalidatePath('/checkout');

        return { success: true, address };
    } catch (error) {
        console.error('Error updating address:', error);
        return { success: false, error: 'Bir hata oluştu' };
    }
}

// Delete address
export async function deleteAddress(addressId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        // Verify ownership
        const existing = await prisma.savedAddress.findUnique({
            where: { id: addressId },
        });

        if (!existing || existing.userId !== session.user.id) {
            return { success: false, error: 'Adres bulunamadı' };
        }

        await prisma.savedAddress.delete({
            where: { id: addressId },
        });

        // If deleted was default, set another as default
        if (existing.isDefault) {
            const firstAddress = await prisma.savedAddress.findFirst({
                where: { userId: session.user.id },
            });
            if (firstAddress) {
                await prisma.savedAddress.update({
                    where: { id: firstAddress.id },
                    data: { isDefault: true },
                });
            }
        }

        revalidatePath('/hesabim');
        revalidatePath('/adreslerim');
        revalidatePath('/checkout');

        return { success: true };
    } catch (error) {
        console.error('Error deleting address:', error);
        return { success: false, error: 'Bir hata oluştu' };
    }
}

// Get user's addresses
export async function getUserAddresses(): Promise<SavedAddressItem[]> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return [];
        }

        const addresses = await prisma.savedAddress.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        return addresses;
    } catch (error) {
        console.error('Error getting addresses:', error);
        return [];
    }
}

// Get single address
export async function getAddress(addressId: string): Promise<SavedAddressItem | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return null;
        }

        const address = await prisma.savedAddress.findUnique({
            where: { id: addressId },
        });

        if (!address || address.userId !== session.user.id) {
            return null;
        }

        return address;
    } catch (error) {
        console.error('Error getting address:', error);
        return null;
    }
}

// Set address as default
export async function setDefaultAddress(addressId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        // Verify ownership
        const existing = await prisma.savedAddress.findUnique({
            where: { id: addressId },
        });

        if (!existing || existing.userId !== session.user.id) {
            return { success: false, error: 'Adres bulunamadı' };
        }

        // Unset all defaults
        await prisma.savedAddress.updateMany({
            where: { userId: session.user.id },
            data: { isDefault: false },
        });

        // Set this as default
        await prisma.savedAddress.update({
            where: { id: addressId },
            data: { isDefault: true },
        });

        revalidatePath('/hesabim');
        revalidatePath('/adreslerim');
        revalidatePath('/checkout');

        return { success: true };
    } catch (error) {
        console.error('Error setting default address:', error);
        return { success: false, error: 'Bir hata oluştu' };
    }
}
