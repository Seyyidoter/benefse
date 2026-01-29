'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createAddress } from '@/lib/address-actions';
import { toast } from 'sonner';

interface AddAddressDialogProps {
    variant?: 'icon' | 'button';
}

export function AddAddressDialog({ variant = 'icon' }: AddAddressDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await createAddress({
                title: formData.get('title') as string,
                fullName: formData.get('fullName') as string,
                phone: formData.get('phone') as string,
                city: formData.get('city') as string,
                district: formData.get('district') as string,
                neighborhood: formData.get('neighborhood') as string,
                address: formData.get('address') as string,
                postalCode: formData.get('postalCode') as string || undefined,
                isDefault: formData.get('isDefault') === 'on',
            });

            if (result.success) {
                toast.success('Adres eklendi');
                setOpen(false);
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === 'button' ? (
                    <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Adres Ekle
                    </Button>
                ) : (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Adres
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Adres Ekle</DialogTitle>
                    <DialogDescription>
                        Teslimat adresinizi ekleyin. Tüm alanları doldurun.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Adres Başlığı</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ev, İş, vb."
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Ad Soyad</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Ad Soyad"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="05XX XXX XX XX"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">İl</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="İstanbul"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="district">İlçe</Label>
                                <Input
                                    id="district"
                                    name="district"
                                    placeholder="Kadıköy"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="neighborhood">Mahalle</Label>
                            <Input
                                id="neighborhood"
                                name="neighborhood"
                                placeholder="Mahalle adı"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Açık Adres</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Sokak, Bina No, Daire No"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="postalCode">Posta Kodu (Opsiyonel)</Label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                placeholder="34000"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isDefault" name="isDefault" />
                            <Label htmlFor="isDefault" className="text-sm font-normal">
                                Varsayılan adres olarak ayarla
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Ekleniyor...
                                </>
                            ) : (
                                'Ekle'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
