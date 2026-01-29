'use client';

import { useState } from 'react';
import { MapPin, Edit2, Trash2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteAddress, setDefaultAddress, SavedAddressItem } from '@/lib/address-actions';
import { toast } from 'sonner';
import { EditAddressDialog } from './edit-address-dialog';

interface AddressCardProps {
    address: SavedAddressItem;
}

export function AddressCard({ address }: AddressCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSettingDefault, setIsSettingDefault] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            const result = await deleteAddress(address.id);
            if (result.success) {
                toast.success('Adres silindi');
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch {
            toast.error('Bir hata oluştu');
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleSetDefault() {
        if (address.isDefault) return;

        setIsSettingDefault(true);
        try {
            const result = await setDefaultAddress(address.id);
            if (result.success) {
                toast.success('Varsayılan adres güncellendi');
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch {
            toast.error('Bir hata oluştu');
        } finally {
            setIsSettingDefault(false);
        }
    }

    return (
        <Card className={address.isDefault ? 'border-purple-500 border-2' : ''}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{address.title}</h3>
                            {address.isDefault && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                    Varsayılan
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {!address.isDefault && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleSetDefault}
                                disabled={isSettingDefault}
                                title="Varsayılan yap"
                            >
                                {isSettingDefault ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Star className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                        <EditAddressDialog address={address} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Adresi Sil</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        &quot;{address.title}&quot; adresini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="space-y-1 text-sm">
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-muted-foreground">{address.phone}</p>
                    <p className="text-muted-foreground">
                        {address.neighborhood}, {address.address}
                    </p>
                    <p className="text-muted-foreground">
                        {address.district}/{address.city} {address.postalCode}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
