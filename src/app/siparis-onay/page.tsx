'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '@/store';
import { OrderDraft } from '@/types';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const { getDraftById } = useOrderStore();

    const [order, setOrder] = useState<OrderDraft | null>(null);

    useEffect(() => {
        if (orderId) {
            const draft = getDraftById(orderId);
            if (draft) {
                setOrder(draft);
            }
        }
    }, [orderId, getDraftById]);

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h1>
                <p className="text-muted-foreground mb-8">
                    Aradığınız sipariş taslağı bulunamadı.
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
                    <h1 className="text-3xl font-bold mb-2">Sipariş Taslağı Oluşturuldu!</h1>
                    <p className="text-muted-foreground">
                        Demo modunda çalıştığınız için siparişiniz taslak olarak kaydedildi.
                    </p>
                </div>

                {/* Demo Notice */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                        <strong>Not:</strong> Bu bir demo sipariştir. Gerçek ödeme alınmamış
                        ve sipariş işleme alınmamıştır. Canlıya geçişte ödeme entegrasyonu
                        eklenecektir.
                    </p>
                </div>

                {/* Order Details */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Sipariş Detayları</h2>
                            <span className="text-sm text-muted-foreground">
                                {order.id}
                            </span>
                        </div>

                        <Separator className="mb-4" />

                        {/* Customer Info */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                    Müşteri Bilgileri
                                </h3>
                                <p className="font-medium">{order.customerInfo.fullName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {order.customerInfo.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {order.customerInfo.phone}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                    Teslimat Adresi
                                </h3>
                                <p className="text-sm">
                                    {order.shippingAddress.address}
                                </p>
                                <p className="text-sm">
                                    {order.shippingAddress.neighborhood}, {order.shippingAddress.district}
                                </p>
                                <p className="text-sm">
                                    {order.shippingAddress.city}
                                </p>
                            </div>
                        </div>

                        <Separator className="mb-4" />

                        {/* Items */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                Ürünler
                            </h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.title}
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
                                    {order.totals.subtotal.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Kargo</span>
                                <span>
                                    {order.totals.shipping === 0
                                        ? 'Ücretsiz'
                                        : order.totals.shipping.toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        })}
                                </span>
                            </div>
                            {order.totals.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>İndirim</span>
                                    <span>
                                        -
                                        {order.totals.discount.toLocaleString('tr-TR', {
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
                                    {order.totals.total.toLocaleString('tr-TR', {
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

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
