'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: { name: string }) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return { error: 'Oturum açmanız gerekiyor' };
        }

        if (!data.name || data.name.trim().length < 2) {
            return { error: 'Geçerli bir isim giriniz' };
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: { name: data.name.trim() },
        });

        // Revalidate relevant paths
        revalidatePath('/hesabim');

        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { error: 'Profil güncellenirken bir hata oluştu' };
    }
}
