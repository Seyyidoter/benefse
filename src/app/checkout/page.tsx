'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    MapPin,
    Truck,
    Check,
    AlertCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useCartStore, useOrderStore } from '@/store';
import { shippingMethods, getFreeShippingEligibility } from '@/data/shipping';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Address Schema
const addressSchema = z.object({
    fullName: z.string().min(2, 'İsim en az 2 karakter olmalı'),
    phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    city: z.string().min(2, 'Şehir seçin'),
    district: z.string().min(2, 'İlçe girin'),
    neighborhood: z.string().min(2, 'Mahalle girin'),
    address: z.string().min(10, 'Adres en az 10 karakter olmalı'),
    postalCode: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const steps = [
    { id: 1, title: 'Adres', icon: MapPin },
    { id: 2, title: 'Kargo', icon: Truck },
    { id: 3, title: 'Ödeme', icon: CreditCard },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, couponDiscount, clearCart } = useCartStore();
    const { startOrder, updateCustomerInfo, updateShippingMethod, saveDraft } = useOrderStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id);
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getSubtotal();
    const hasFreeShipping = getFreeShippingEligibility(subtotal);
    const selectedShippingMethod = shippingMethods.find((s) => s.id === selectedShipping);
    const shippingCost = hasFreeShipping && selectedShippingMethod?.id === 'ship-3' ? 0 : (selectedShippingMethod?.price || 0);
    const discount = couponDiscount || 0;
    const total = subtotal + shippingCost - discount;

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            city: '',
            district: '',
            neighborhood: '',
            address: '',
            postalCode: '',
        },
    });

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/sepet');
        }
    }, [items.length, router]);

    // Initialize order when entering checkout
    useEffect(() => {
        if (items.length > 0) {
            startOrder(
                items.map((item) => ({
                    productId: item.productId,
                    title: item.title,
                    price: item.salePrice || item.price,
                    quantity: item.quantity,
                    variantId: item.variantId,
                    variantName: item.variantName,
                })),
                {
                    subtotal,
                    shipping: shippingCost,
                    discount,
                }
            );
        }
    }, [items, subtotal, shippingCost, discount, startOrder]);

    const handleAddressSubmit = (data: AddressFormData) => {
        updateCustomerInfo(data);
        setCurrentStep(2);
    };

    const handleShippingSubmit = () => {
        updateShippingMethod(selectedShipping, shippingCost);
        setCurrentStep(3);
    };

    const handlePaymentSubmit = () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            const savedDraft = saveDraft();

            if (savedDraft) {
                clearCart();
                toast.success('Sipariş taslağı kaydedildi!', {
                    description: `Sipariş No: ${savedDraft.id}`,
                });
                router.push(`/siparis-onay?id=${savedDraft.id}`);
            } else {
                toast.error('Sipariş oluşturulamadı');
            }

            setIsProcessing(false);
        }, 1500);
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Progress Steps */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                                        currentStep >= step.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                                            : 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    {currentStep > step.id ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'text-sm mt-2',
                                        currentStep >= step.id
                                            ? 'text-foreground font-medium'
                                            : 'text-muted-foreground'
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <div
                                        className={cn(
                                            'h-1 rounded transition-all',
                                            currentStep > step.id
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-500'
                                                : 'bg-muted'
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Area */}
                <div className="lg:col-span-2">
                    {/* Step 1: Address */}
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Teslimat Adresi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(handleAddressSubmit)}
                                        className="space-y-4"
                                    >
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ad Soyad</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Adınız Soyadınız" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Telefon</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="05XX XXX XX XX" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>E-posta</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="ornek@email.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Şehir</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="İstanbul" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="district"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>İlçe</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Kadıköy" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="neighborhood"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mahalle</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Caferağa" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Açık Adres</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Sokak, bina no, daire no..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-between pt-4">
                                            <Link href="/sepet">
                                                <Button variant="ghost" type="button">
                                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                                    Sepete Dön
                                                </Button>
                                            </Link>
                                            <Button
                                                type="submit"
                                                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                            >
                                                Devam Et
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Shipping */}
                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Kargo Seçimi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={selectedShipping}
                                    onValueChange={setSelectedShipping}
                                    className="space-y-4"
                                >
                                    {shippingMethods.map((method) => {
                                        const isFreeEligible =
                                            method.id === 'ship-3' && hasFreeShipping;
                                        const displayPrice = isFreeEligible ? 0 : method.price;

                                        return (
                                            <div
                                                key={method.id}
                                                className={cn(
                                                    'flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer',
                                                    selectedShipping === method.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                )}
                                                onClick={() =>
                                                    !(method.id === 'ship-3' && !hasFreeShipping) &&
                                                    setSelectedShipping(method.id)
                                                }
                                            >
                                                <RadioGroupItem
                                                    value={method.id}
                                                    id={method.id}
                                                    disabled={method.id === 'ship-3' && !hasFreeShipping}
                                                />
                                                <Label
                                                    htmlFor={method.id}
                                                    className="flex-1 cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium">{method.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {method.description}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Tahmini teslimat: {method.estimatedDays}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            {displayPrice === 0 ? (
                                                                <span className="font-bold text-green-600">
                                                                    Ücretsiz
                                                                </span>
                                                            ) : (
                                                                <span className="font-bold">
                                                                    {displayPrice.toLocaleString('tr-TR', {
                                                                        style: 'currency',
                                                                        currency: 'TRY',
                                                                    })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>

                                <div className="flex justify-between pt-6">
                                    <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Geri
                                    </Button>
                                    <Button
                                        onClick={handleShippingSubmit}
                                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                    >
                                        Devam Et
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Ödeme
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Demo Warning */}
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-orange-800 dark:text-orange-200">
                                                Demo Modu
                                            </h4>
                                            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                                Ödeme sistemi şu anda demo modundadır. Gerçek ödeme
                                                alınmamaktadır. Siparişiniz taslak olarak kaydedilecektir.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Fake Payment Form */}
                                <div className="space-y-4 opacity-50 pointer-events-none">
                                    <div>
                                        <Label>Kart Numarası</Label>
                                        <Input placeholder="XXXX XXXX XXXX XXXX" disabled />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Son Kullanma</Label>
                                            <Input placeholder="AA/YY" disabled />
                                        </div>
                                        <div>
                                            <Label>CVV</Label>
                                            <Input placeholder="XXX" disabled />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Geri
                                    </Button>
                                    <Button
                                        onClick={handlePaymentSubmit}
                                        disabled={isProcessing}
                                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                İşleniyor...
                                            </>
                                        ) : (
                                            <>
                                                Siparişi Tamamla (Demo)
                                                <Check className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Sipariş Özeti</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Items */}
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.variantId}`}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.title.slice(0, 30)}...
                                            {item.quantity > 1 && ` x${item.quantity}`}
                                        </span>
                                        <span>
                                            {((item.salePrice || item.price) * item.quantity).toLocaleString(
                                                'tr-TR',
                                                { style: 'currency', currency: 'TRY' }
                                            )}
                                        </span>
                                    </div>
                                ))}
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
                                    <span className={cn(shippingCost === 0 && 'text-green-600')}>
                                        {shippingCost === 0
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
                    </Card>
                </div>
            </div>
        </div>
    );
}
