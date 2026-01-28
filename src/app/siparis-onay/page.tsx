import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ClipboardList, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getOrder } from '@/lib/order-actions';
import { auth } from '@/auth';

interface OrderConfirmationPageProps {
    searchParams: Promise<{ id?: string }>;
}

async function OrderConfirmationContent({ orderId }: { orderId: string }) {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Giriş Yapmalısınız</h1>
                <p className="text-muted-foreground mb-8">
                    Sipariş detaylarını görmek için giriş yapın.
                </p>
                <Link href={`/giris?callbackUrl=${encodeURIComponent(`/siparis-onay?id=${orderId}`)}`}>
                    <Button>Giriş Yap</Button>
                </Link>
            </div>
        );
    }

    const order = await getOrder(orderId);

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h1>
                <p className="text-muted-foreground mb-8">
                    Aradığınız sipariş bulunamadı veya size ait değil.
                </p>
                <Link href="/">
                    <Button>Ana Sayfaya Dön</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-2xl mx-auto">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı!</h1>
                    <p className="text-muted-foreground">
                        Sipariş numaranız: <span className="font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                    </p>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-8">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-2">
                        <Package className="w-4 h-4 mr-2" />
                        Beklemede - Ödeme Bekleniyor (Demo)
                    </Badge>
                </div>

                {/* Info Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Bilgi:</strong> Demo modunda ödeme alınmamaktadır. Gerçek uygulamada
                        siparişiniz ödeme sonrası işleme alınacaktır.
                    </p>
                </div>

                {/* Order Details */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Sipariş Detayları</h2>
                            <span className="text-sm text-muted-foreground font-mono">
                                {order.id}
                            </span>
                        </div>

                        <Separator className="mb-4" />

                        {/* Customer Info */}
                        {order.address && (
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                        Müşteri Bilgileri
                                    </h3>
                                    <p className="font-medium">{order.address.fullName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.address.email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.address.phone}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                        Teslimat Adresi
                                    </h3>
                                    <p className="text-sm">
                                        {order.address.address}
                                    </p>
                                    <p className="text-sm">
                                        {order.address.neighborhood}, {order.address.district}
                                    </p>
                                    <p className="text-sm">
                                        {order.address.city}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Separator className="mb-4" />

                        {/* Items */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                Ürünler ({order.items.length} adet)
                            </h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.title.slice(0, 50)}{item.title.length > 50 ? '...' : ''}
                                            {item.quantity > 1 && ` (x${item.quantity})`}
                                            {item.variantName && ` - ${item.variantName}`}
                                        </span>
                                        <span className="font-medium">
                                            {(item.price * item.quantity).toLocaleString('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="mb-4" />

                        {/* Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Ara Toplam</span>
                                <span>
                                    {order.subtotal.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Kargo</span>
                                <span>
                                    {order.shipping === 0
                                        ? 'Ücretsiz'
                                        : order.shipping.toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        })}
                                </span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>İndirim</span>
                                    <span>
                                        -
                                        {order.discount.toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        })}
                                    </span>
                                </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                                <span>Toplam</span>
                                <span className="text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    {order.total.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link href="/urunler" className="flex-1">
                        <Button className="w-full gap-2" variant="outline">
                            <ShoppingBag className="w-4 h-4" />
                            Alışverişe Devam Et
                        </Button>
                    </Link>
                    <Link href="/hesabim" className="flex-1">
                        <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                            <ClipboardList className="w-4 h-4" />
                            Siparişlerim
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
    const params = await searchParams;
    const orderId = params.id;

    if (!orderId) {
        notFound();
    }

    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>}>
            <OrderConfirmationContent orderId={orderId} />
        </Suspense>
    );
}
