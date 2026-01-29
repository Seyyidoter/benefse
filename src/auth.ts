import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt', // Use JWT for credentials provider
    },
    pages: {
        signIn: '/giris',
        // newUser removed - Google OAuth should auto-create user
    },
    providers: [
        // Google OAuth Provider
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Email/Password Provider
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }

            // Always ensure we have the role, fetch from DB if necessary or on update
            if (!token.role || (trigger === "update" && session)) {
                if (trigger === "update" && session) {
                    token = { ...token, ...session };
                }

                // Fetch fresh role from DB to be sure
                if (token.id) {
                    try {
                        const dbUser = await (prisma.user as any).findUnique({
                            where: { id: token.id as string },
                            select: { role: true },
                        });
                        if (dbUser) {
                            token.role = dbUser.role;
                        }
                    } catch (error) {
                        console.error("Error fetching user role inside JWT callback:", error);
                        // Continue authentication even if role fetch fails
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
});
