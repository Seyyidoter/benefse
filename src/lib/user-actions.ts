'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


import bcrypt from 'bcryptjs';

export async function updateProfile(data: {
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
}) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return { error: 'Oturum açmanız gerekiyor' };
        }

        if (!data.firstName || data.firstName.trim().length < 2) {
            return { error: 'Geçerli bir ad giriniz' };
        }
        if (!data.lastName || data.lastName.trim().length < 2) {
            return { error: 'Geçerli bir soyad giriniz' };
        }

        const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;

        let birthDate: Date | null = null;
        if (data.birthDate) {
            birthDate = new Date(data.birthDate);
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: fullName,
                phone: data.phone,
                gender: data.gender,
                birthDate: birthDate
            },
        });

        // Revalidate relevant paths
        revalidatePath('/hesabim');

        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { error: 'Profil güncellenirken bir hata oluştu' };
    }
}

export async function updatePassword(data: { currentPassword?: string; newPassword: string }) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: 'Oturum açmanız gerekiyor' };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: 'Kullanıcı bulunamadı' };
        }

        if (!user.passwordHash) {
            return { success: false, error: 'Google ile giriş yapan kullanıcılar şifre değiştiremez.' };
        }

        if (!data.currentPassword) {
            return { success: false, error: 'Mevcut şifrenizi girmelisiniz' };
        }

        const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
        if (!isMatch) {
            return { success: false, error: 'Mevcut şifre yanlış' };
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { passwordHash: hashedPassword },
        });

        return { success: true };
    } catch (error) {
        console.error('Password update error:', error);
        return { success: false, error: 'Şifre güncellenemedi' };
    }
}
