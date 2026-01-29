import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/auth';
import { getUserOrders } from '@/lib/order-actions';
import { LogoutButton } from '@/components/auth/logout-button';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';

// Status badge colors
const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    PENDING: { label: 'Beklemede', variant: 'secondary', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    PAID: { label: 'Ödendi', variant: 'secondary', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    PROCESSING: { label: 'Hazırlanıyor', variant: 'secondary', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    SHIPPED: { label: 'Kargoda', variant: 'secondary', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
    DELIVERED: { label: 'Teslim Edildi', variant: 'secondary', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    CANCELLED: { label: 'İptal Edildi', variant: 'destructive' },
};

export default async function AccountPage() {
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/giris?callbackUrl=/hesabim');
    }

    const orders = await getUserOrders();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* User Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Hesabım</h1>
                    <p className="text-muted-foreground mt-1">
                        Hoş geldin, <span className="font-medium text-foreground">{session.user.name || session.user.email}</span>
                    </p>
                </div>
                <LogoutButton />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Menu Cards */}
                <EditProfileDialog initialName={session.user.name}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                                <User className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Profil Bilgileri</h3>
                                <p className="text-sm text-muted-foreground">
                                    {session.user.name || 'Ad Yok'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {session.user.email}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </EditProfileDialog>

                <Link href="/adreslerim">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                                <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Adreslerim</h3>
                                <p className="text-sm text-muted-foreground">
                                    Kayıtlı adreslerinizi yönetin
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/favorilerim">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                                <Heart className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Favorilerim</h3>
                                <p className="text-sm text-muted-foreground">
                                    Beğendiğiniz ürünler
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Orders Section */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <Package className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Siparişlerim</h2>
                    <Badge variant="secondary">{orders.length}</Badge>
                </div>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">
                                Henüz siparişiniz bulunmuyor.
                            </p>
                            <Link href="/urunler">
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                                    Alışverişe Başla
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.PENDING;
                            return (
                                <Card key={order.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <CardTitle className="text-base font-medium font-mono">
                                                #{order.id.slice(-8).toUpperCase()}
                                            </CardTitle>
                                            <Badge variant={status.variant} className={status.className}>
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Tarih</p>
                                                <p className="font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Ürün Sayısı</p>
                                                <p className="font-medium">{order.items.length} ürün</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Teslimat</p>
                                                <p className="font-medium">{order.address?.city}, {order.address?.district}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Toplam</p>
                                                <p className="font-medium text-purple-600">
                                                    {order.total.toLocaleString('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className="my-4" />

                                        {/* Order Items Preview */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {order.items.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="text-xs bg-muted px-2 py-1 rounded"
                                                >
                                                    {item.title.slice(0, 30)}...
                                                    {item.quantity > 1 && ` x${item.quantity}`}
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="text-xs bg-muted px-2 py-1 rounded">
                                                    +{order.items.length - 3} ürün daha
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                Sipariş ID: {order.id}
                                            </p>
                                            <Link href={`/hesabim/siparis/${order.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Detaylar
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
