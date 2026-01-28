'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    ArrowUpRight,
    Box,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCatalogAdapter } from '@/adapters';
import { useOrderStore } from '@/store';
import { Product } from '@/types';

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { drafts } = useOrderStore();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const adapter = getCatalogAdapter();
                const result = await adapter.fetchProducts(undefined, 1, 100);
                setProducts(result.items);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter((p) => p.stock === 0);
    const totalOrderDrafts = drafts.length;
    const totalRevenue = drafts.reduce((sum, d) => sum + d.totals.total, 0);

    const stats = [
        {
            title: 'Toplam Ürün',
            value: totalProducts,
            icon: Package,
            href: '/admin/urunler',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Sipariş Taslağı',
            value: totalOrderDrafts,
            icon: ShoppingCart,
            href: '/admin/siparisler',
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Demo Ciro',
            value: totalRevenue.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                maximumFractionDigits: 0,
            }),
            icon: TrendingUp,
            href: '/admin/siparisler',
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Düşük Stok',
            value: lowStockProducts.length,
            icon: AlertTriangle,
            href: '/admin/urunler?filter=low-stock',
            color: 'from-orange-500 to-red-500',
            warning: lowStockProducts.length > 0,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Mağaza yönetim paneline hoş geldiniz
                </p>
            </div>

            {/* Demo Notice */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Box className="h-6 w-6" />
                    <div>
                        <p className="font-medium">Demo Modu Aktif</p>
                        <p className="text-sm text-white/80">
                            Tüm veriler demo amaçlıdır. Gerçek satış ve ödeme yapılmamaktadır.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
                                    >
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    {stat.warning && (
                                        <Badge variant="destructive" className="animate-pulse">
                                            Dikkat
                                        </Badge>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Stok Uyarıları
                        </CardTitle>
                        <Link href="/admin/urunler">
                            <Button variant="ghost" size="sm">
                                Tümü <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-muted-foreground">Yükleniyor...</p>
                        ) : outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
                            <p className="text-muted-foreground">Stok uyarısı yok</p>
                        ) : (
                            <div className="space-y-3">
                                {outOfStockProducts.slice(0, 3).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{product.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                SKU: {product.sku}
                                            </p>
                                        </div>
                                        <Badge variant="destructive">Stokta Yok</Badge>
                                    </div>
                                ))}
                                {lowStockProducts.slice(0, 3).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{product.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                SKU: {product.sku}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                                            {product.stock} adet
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Son Sipariş Taslakları
                        </CardTitle>
                        <Link href="/admin/siparisler">
                            <Button variant="ghost" size="sm">
                                Tümü <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {drafts.length === 0 ? (
                            <p className="text-muted-foreground">Henüz sipariş taslağı yok</p>
                        ) : (
                            <div className="space-y-3">
                                {drafts.slice(0, 5).map((draft) => (
                                    <div
                                        key={draft.id}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {draft.customerInfo.fullName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {draft.items.length} ürün
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-purple-600">
                                                {draft.totals.total.toLocaleString('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                })}
                                            </p>
                                            <Badge variant="secondary">Taslak</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/admin/urunler/yeni">
                            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                <Package className="h-6 w-6" />
                                <span>Yeni Ürün Ekle</span>
                            </Button>
                        </Link>
                        <Link href="/admin/urunler">
                            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                <TrendingUp className="h-6 w-6" />
                                <span>Stok Güncelle</span>
                            </Button>
                        </Link>
                        <Link href="/admin/siparisler">
                            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                <ShoppingCart className="h-6 w-6" />
                                <span>Siparişleri Gör</span>
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                <ArrowUpRight className="h-6 w-6" />
                                <span>Mağazayı Aç</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
