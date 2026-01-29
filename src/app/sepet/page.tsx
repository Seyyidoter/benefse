'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store';
import { validateCoupon, getFreeShippingEligibility } from '@/data/shipping';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CartPage() {
    const {
        items,
        couponCode,
        couponDiscount,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        getSubtotal,
        clearCart,
    } = useCartStore();

    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const subtotal = getSubtotal();
    const hasFreeShipping = getFreeShippingEligibility(subtotal);
    const shippingCost = hasFreeShipping ? 0 : 49.99;
    const discount = couponDiscount || 0;
    const total = subtotal + shippingCost - discount;

    const handleApplyCoupon = () => {
        setCouponLoading(true);

        // Simulate API call
        setTimeout(() => {
            const result = validateCoupon(couponInput, subtotal);

            if (result.valid) {
                applyCoupon(couponInput.toUpperCase(), result.discount);
                toast.success(result.message);
                setCouponInput('');
            } else {
                toast.error(result.message);
            }

            setCouponLoading(false);
        }, 500);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
                    <p className="text-muted-foreground mb-8">
                        Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!
                    </p>
                    <Link href="/urunler">
                        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                            Alışverişe Başla
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Sepetim</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Free Shipping Banner */}
                    {!hasFreeShipping && (
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4">
                            <p className="text-sm">
                                <strong>Ücretsiz kargo</strong> için{' '}
                                <span className="font-bold text-purple-600">
                                    {(500 - subtotal).toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>{' '}
                                daha harcayın!
                            </p>
                            <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    {items.map((item) => (
                        <Card key={`${item.productId}-${item.variantId}`} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <Link href={`/urun/${item.productId}`} className="flex-shrink-0">
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="128px"
                                                />
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50" />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/urun/${item.productId}`}>
                                            <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        {item.variantName && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Beden: {item.variantName}
                                            </p>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-bold text-purple-600">
                                                {(item.salePrice || item.price).toLocaleString('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                })}
                                            </span>
                                            {item.salePrice && item.salePrice < item.price && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {item.price.toLocaleString('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity */}
                                            <div className="flex items-center border rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity - 1,
                                                            item.variantId
                                                        )
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity + 1,
                                                            item.variantId
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Remove */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => removeItem(item.productId, item.variantId)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Kaldır
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Clear Cart */}
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => {
                                clearCart();
                                toast.success('Sepet temizlendi');
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sepeti Temizle
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Sipariş Özeti</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Coupon */}
                            <div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Kupon kodu"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="pl-10"
                                            disabled={!!couponCode}
                                        />
                                    </div>
                                    {couponCode ? (
                                        <Button variant="outline" onClick={removeCoupon}>
                                            Kaldır
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={handleApplyCoupon}
                                            disabled={!couponInput || couponLoading}
                                        >
                                            Uygula
                                        </Button>
                                    )}
                                </div>
                                {couponCode && (
                                    <p className="text-sm text-green-600 mt-2">
                                        ✓ {couponCode} kodu uygulandı
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                    Dene: DEMO20 (20% indirim)
                                </p>
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ara Toplam</span>
                                    <span>
                                        {subtotal.toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Kargo</span>
                                    <span className={cn(hasFreeShipping && 'text-green-600')}>
                                        {hasFreeShipping
                                            ? 'Ücretsiz'
                                            : shippingCost.toLocaleString('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                            })}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>İndirim</span>
                                        <span>
                                            -
                                            {discount.toLocaleString('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Toplam</span>
                                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    {total.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-3">
                            <Link href="/checkout" className="w-full">
                                <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                                    Siparişi Tamamla
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/urunler" className="w-full">
                                <Button variant="outline" className="w-full">
                                    Alışverişe Devam Et
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
