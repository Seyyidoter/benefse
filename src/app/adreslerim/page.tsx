import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/auth';
import { getUserAddresses } from '@/lib/address-actions';
import { AddressCard } from '@/components/address/address-card';
import { AddAddressDialog } from '@/components/address/add-address-dialog';

export const metadata = {
    title: 'Adreslerim | Benefse',
    description: 'Kayıtlı teslimat adreslerinizi yönetin.',
};

export default async function AddressesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/giris?callbackUrl=/adreslerim');
    }

    const addresses = await getUserAddresses();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/hesabim">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                            <MapPin className="h-8 w-8 text-purple-500" />
                            Adreslerim
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {addresses.length} kayıtlı adres
                        </p>
                    </div>
                </div>
                <AddAddressDialog />
            </div>

            {addresses.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <MapPin className="h-12 w-12 text-purple-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Henüz adresiniz yok</h2>
                        <p className="text-muted-foreground max-w-md">
                            Teslimat adresinizi ekleyerek siparişlerinizi hızlıca tamamlayabilirsiniz.
                        </p>
                        <AddAddressDialog variant="button" />
                    </div>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </div>
            )}
        </div>
    );
}
