'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Package,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getCatalogAdapter } from '@/adapters';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        product: Product | null;
    }>({ open: false, product: null });

    const loadProducts = async () => {
        setLoading(true);
        try {
            const adapter = getCatalogAdapter();
            const result = await adapter.fetchProducts(undefined, 1, 100);
            setProducts(result.items);
        } catch (error) {
            console.error('Failed to load products:', error);
            toast.error('Ürünler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (product: Product) => {
        try {
            const adapter = getCatalogAdapter();
            await adapter.deleteProduct(product.id);
            toast.success('Ürün silindi');
            setDeleteDialog({ open: false, product: null });
            loadProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Ürün silinemedi');
        }
    };

    // Filter products
    const filteredProducts = products.filter((product) => {
        // Search filter
        const matchesSearch =
            !searchQuery ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
            selectedCategory === 'all' || product.categoryId === selectedCategory;

        // Stock filter
        let matchesStock = true;
        if (stockFilter === 'in-stock') {
            matchesStock = product.stock > 0;
        } else if (stockFilter === 'low-stock') {
            matchesStock = product.stock > 0 && product.stock <= 5;
        } else if (stockFilter === 'out-of-stock') {
            matchesStock = product.stock === 0;
        }

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Ürünler</h1>
                    <p className="text-muted-foreground mt-1">
                        {products.length} ürün kayıtlı
                    </p>
                </div>
                <Link href="/admin/urunler/yeni">
                    <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                        <Plus className="h-4 w-4" />
                        Yeni Ürün
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ürün ara (isim, SKU)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Stock Filter */}
                        <Select value={stockFilter} onValueChange={setStockFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Stok Durumu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Stok</SelectItem>
                                <SelectItem value="in-stock">Stokta Var</SelectItem>
                                <SelectItem value="low-stock">Düşük Stok</SelectItem>
                                <SelectItem value="out-of-stock">Stokta Yok</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">Ürün bulunamadı</p>
                        <p className="text-muted-foreground mb-4">
                            Arama kriterlerinize uygun ürün yok.
                        </p>
                        <Link href="/admin/urunler/yeni">
                            <Button>Yeni Ürün Ekle</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Görsel</TableHead>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-right">Fiyat</TableHead>
                                    <TableHead className="text-center">Stok</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => {
                                    const category = categories.find(
                                        (c) => c.id === product.categoryId
                                    );
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                    {product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    ) : (
                                                        <Package className="w-6 h-6 m-3 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium line-clamp-1">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {product.brand}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                    {product.sku}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{category?.name || '-'}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div>
                                                    {product.salePrice && product.salePrice < product.price ? (
                                                        <>
                                                            <p className="font-medium text-purple-600">
                                                                {product.salePrice.toLocaleString('tr-TR', {
                                                                    style: 'currency',
                                                                    currency: 'TRY',
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground line-through">
                                                                {product.price.toLocaleString('tr-TR', {
                                                                    style: 'currency',
                                                                    currency: 'TRY',
                                                                })}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="font-medium">
                                                            {product.price.toLocaleString('tr-TR', {
                                                                style: 'currency',
                                                                currency: 'TRY',
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        product.stock === 0 &&
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30',
                                                        product.stock > 0 &&
                                                        product.stock <= 5 &&
                                                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
                                                        product.stock > 5 &&
                                                        'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                    )}
                                                >
                                                    {product.stock}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/urun/${product.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Görüntüle
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/urunler/${product.id}`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Düzenle
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() =>
                                                                setDeleteDialog({ open: true, product })
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Sil
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, product: null })}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ürünü Sil</DialogTitle>
                        <DialogDescription>
                            &quot;{deleteDialog.product?.title}&quot; ürününü silmek istediğinize emin misiniz?
                            Bu işlem geri alınamaz.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, product: null })}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                deleteDialog.product && handleDelete(deleteDialog.product)
                            }
                        >
                            Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
