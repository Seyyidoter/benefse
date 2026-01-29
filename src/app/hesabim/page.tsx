import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { ProfileForm } from '@/components/account/profile-form';
import { PasswordForm } from '@/components/account/password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hesabım | Kişisel Bilgilerim',
};

export default async function AccountPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/giris');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        // Kullanıcı veritabanında bulunamadıysa çıkış yapıp giriş sayfasına yönlendirilebilir
        redirect('/giris');
    }

    // Google kullanıcısı olup olmadığını passwordHash alanına bakarak anlıyoruz.
    // Google ile girenlerde passwordHash null olur (eğer daha önce şifre oluşturmadılarsa).
    const isGoogleUser = !user.passwordHash;
    const isAdmin = user.role === 'ADMIN';

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <AccountSidebar userName={user.name || ''} isAdmin={isAdmin} />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold mb-6">Hesap Bilgisi</h1>

                    <div className="bg-background border rounded-xl p-6 shadow-sm mb-8">
                        <ProfileForm user={user} />
                    </div>

                    {!isGoogleUser && ( // passwordHash varsa (yani şifreli giriş yapmışsa) şifre formunu göster
                        <div>
                            <h2 className="text-xl font-bold mb-4">Güvenlik</h2>
                            <div className="bg-background border rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-medium mb-4">Şifre Güncelleme</h3>
                                <PasswordForm />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
