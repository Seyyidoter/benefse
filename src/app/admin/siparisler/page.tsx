'use client';

import { ShoppingCart, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '@/store';
import { OrderDraft } from '@/types';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
    const { drafts, deleteDraft } = useOrderStore();

    const handleDelete = (id: string) => {
        deleteDraft(id);
        toast.success('Sipariş taslağı silindi');
    };

    const OrderDetailDialog = ({ order }: { order: OrderDraft }) => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Detay
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Sipariş Detayları</DialogTitle>
                    <DialogDescription>{order.id}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-6 p-1">
                        {/* Customer Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Müşteri Bilgileri</h4>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <span className="text-muted-foreground">Ad Soyad:</span>{' '}
                                        {order.customerInfo.fullName}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">E-posta:</span>{' '}
                                        {order.customerInfo.email}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">Telefon:</span>{' '}
                                        {order.customerInfo.phone}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Teslimat Adresi</h4>
                                <div className="text-sm space-y-1">
                                    <p>{order.shippingAddress.address}</p>
                                    <p>
                                        {order.shippingAddress.neighborhood},{' '}
                                        {order.shippingAddress.district}
                                    </p>
                                    <p>{order.shippingAddress.city}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Items */}
                        <div>
                            <h4 className="font-medium mb-3">Ürünler</h4>
                            <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            {item.variantName && (
                                                <p className="text-sm text-muted-foreground">
                                                    Beden: {item.variantName}
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                Adet: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            {(item.price * item.quantity).toLocaleString('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Ara Toplam</span>
                                <span>
                                    {order.totals.subtotal.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Kargo</span>
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
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Toplam</span>
                                <span className="text-purple-600">
                                    {order.totals.total.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Siparişler</h1>
                <p className="text-muted-foreground mt-1">
                    {drafts.length} sipariş taslağı
                </p>
            </div>

            {/* Info Notice */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>Demo Modu:</strong> Bu sayfadaki siparişler demo amaçlı taslak
                    olarak kaydedilmiştir. Gerçek sipariş işleme, ödeme entegrasyonu
                    sonrasında aktif olacaktır.
                </p>
            </div>

            {/* Orders Table */}
            {drafts.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">Sipariş bulunamadı</p>
                        <p className="text-muted-foreground">
                            Henüz sipariş taslağı oluşturulmamış.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sipariş No</TableHead>
                                    <TableHead>Müşteri</TableHead>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead className="text-right">Toplam</TableHead>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="w-32"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drafts.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {order.id.slice(0, 15)}...
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {order.customerInfo.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.customerInfo.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {order.items.length} ürün
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold text-purple-600">
                                                {order.totals.total.toLocaleString('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="bg-orange-100 text-orange-700 dark:bg-orange-900/30"
                                            >
                                                Taslak
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <OrderDetailDialog order={order} />
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Siparişi Sil</DialogTitle>
                                                            <DialogDescription>
                                                                Bu sipariş taslağını silmek istediğinize emin
                                                                misiniz? Bu işlem geri alınamaz.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline">İptal</Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDelete(order.id)}
                                                            >
                                                                Sil
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Summary */}
            {drafts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Özet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Toplam Sipariş</p>
                                <p className="text-2xl font-bold">{drafts.length}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Toplam Ürün</p>
                                <p className="text-2xl font-bold">
                                    {drafts.reduce((sum, o) => sum + o.items.length, 0)}
                                </p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Demo Ciro</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {drafts
                                        .reduce((sum, o) => sum + o.totals.total, 0)
                                        .toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
