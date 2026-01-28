'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

// ============================================
// Validation Schemas
// ============================================

const registerSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalı').optional(),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: z
        .string()
        .min(6, 'Şifre en az 6 karakter olmalı')
        .max(100, 'Şifre çok uzun'),
});

const loginSchema = z.object({
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: z.string().min(1, 'Şifre gerekli'),
});

// ============================================
// Types
// ============================================

export type AuthResult = {
    success: boolean;
    error?: string;
};

// ============================================
// Register Action
// ============================================

export async function register(formData: FormData): Promise<AuthResult> {
    try {
        const rawData = {
            name: formData.get('name') as string | undefined,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        // Validate input
        const validatedData = registerSchema.safeParse(rawData);
        if (!validatedData.success) {
            return {
                success: false,
                error: validatedData.error.issues[0]?.message || 'Geçersiz veri',
            };
        }

        const { name, email, password } = validatedData.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                error: 'Bu e-posta adresi zaten kullanımda',
            };
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        await prisma.user.create({
            data: {
                name: name || null,
                email,
                passwordHash,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Register error:', error);
        return {
            success: false,
            error: 'Kayıt sırasında bir hata oluştu',
        };
    }
}

// ============================================
// Login Action
// ============================================

export async function login(formData: FormData): Promise<AuthResult> {
    try {
        const rawData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        // Validate input
        const validatedData = loginSchema.safeParse(rawData);
        if (!validatedData.success) {
            return {
                success: false,
                error: validatedData.error.issues[0]?.message || 'Geçersiz veri',
            };
        }

        await signIn('credentials', {
            email: rawData.email,
            password: rawData.password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        success: false,
                        error: 'E-posta veya şifre hatalı',
                    };
                default:
                    return {
                        success: false,
                        error: 'Giriş sırasında bir hata oluştu',
                    };
            }
        }
        throw error; // Rethrow if it's not an AuthError (e.g., redirect)
    }
}

// ============================================
// Logout Action
// ============================================

export async function logout(): Promise<void> {
    await signOut({ redirect: false });
}
