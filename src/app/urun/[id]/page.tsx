'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronRight,
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    RotateCcw,
    Shield,
    Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductGallery, ProductCard } from '@/components/product';
import { Skeleton } from '@/components/ui/skeleton';
import { getCatalogAdapter } from '@/adapters';
import { useCartStore } from '@/store';
import { Product } from '@/types';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const adapter = getCatalogAdapter();
                const p = await adapter.fetchProductById(productId);
                setProduct(p);

                // Select first variant if exists
                if (p?.variants && p.variants.length > 0) {
                    setSelectedVariant(p.variants[0].id);
                }
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        notFound();
    }

    const category = categories.find((c) => c.id === product.categoryId);
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
        : 0;
    const displayPrice = product.salePrice || product.price;
    const isOutOfStock = product.stock === 0;

    // Get selected variant stock
    const selectedVariantData = product.variants?.find(
        (v) => v.id === selectedVariant
    );
    const currentStock = selectedVariantData?.stock ?? product.stock;
    const variantOutOfStock = currentStock === 0;

    // Get similar products
    const similarProducts = products
        .filter(
            (p) =>
                p.categoryId === product.categoryId &&
                p.id !== product.id &&
                p.isActive
        )
        .slice(0, 4);

    const handleAddToCart = () => {
        if (isOutOfStock || variantOutOfStock) {
            toast.error('Bu ürün stokta yok');
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addItem({
                productId: product.id,
                title: product.title,
                price: product.price,
                salePrice: product.salePrice,
                image: product.images[0] || '/placeholder.jpg',
                variantId: selectedVariant || undefined,
                variantName: selectedVariantData?.value,
            });
        }

        toast.success('Ürün sepete eklendi', {
            description: `${quantity}x ${product.title}`,
            action: {
                label: 'Sepete Git',
                onClick: () => (window.location.href = '/sepet'),
            },
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-primary transition-colors">
                    Ana Sayfa
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/urunler" className="hover:text-primary transition-colors">
                    Ürünler
                </Link>
                {category && (
                    <>
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href={`/kategori/${category.slug}`}
                            className="hover:text-primary transition-colors"
                        >
                            {category.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium line-clamp-1">
                    {product.title}
                </span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Gallery */}
                <ProductGallery images={product.images} title={product.title} />

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Brand & Title */}
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            {product.brand}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            {displayPrice.toLocaleString('tr-TR', {
                                style: 'currency',
                                currency: product.currency,
                            })}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xl text-muted-foreground line-through">
                                    {product.price.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: product.currency,
                                    })}
                                </span>
                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                                    %{discountPercent} İndirim
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div>
                        {isOutOfStock ? (
                            <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                Stokta Yok
                            </Badge>
                        ) : currentStock <= 5 ? (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                Son {currentStock} adet!
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Stokta
                            </Badge>
                        )}
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-3">
                                {product.variants[0].name}: {selectedVariantData?.value}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant.id)}
                                        disabled={variant.stock === 0}
                                        className={cn(
                                            'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                                            selectedVariant === variant.id
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50',
                                            variant.stock === 0 && 'opacity-50 cursor-not-allowed line-through'
                                        )}
                                    >
                                        {variant.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Add to Cart */}
                    <div className="flex gap-4">
                        <div className="flex items-center border rounded-lg">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                disabled={quantity >= currentStock}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            className={cn(
                                'flex-1 gap-2',
                                isOutOfStock || variantOutOfStock
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
                            )}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || variantOutOfStock}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {isOutOfStock || variantOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 gap-2">
                            <Heart className="h-5 w-5" />
                            Favorilere Ekle
                        </Button>
                        <Button variant="outline" size="icon">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    <Separator />

                    {/* Product Features */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 rounded-lg bg-muted">
                                <Truck className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium">Hızlı Kargo</p>
                                <p className="text-muted-foreground">1-3 iş günü</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 rounded-lg bg-muted">
                                <RotateCcw className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium">Kolay İade</p>
                                <p className="text-muted-foreground">14 gün içinde</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 rounded-lg bg-muted">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium">Güvenli Ödeme</p>
                                <p className="text-muted-foreground">SSL korumalı</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 rounded-lg bg-muted">
                                <Package className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium">SKU</p>
                                <p className="text-muted-foreground">{product.sku}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="description">
                            <AccordionTrigger>Ürün Açıklaması</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="shipping">
                            <AccordionTrigger>Kargo ve Teslimat</AccordionTrigger>
                            <AccordionContent>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>• Standart kargo: 1-3 iş günü (49,99 TL)</li>
                                    <li>• Ekspres kargo: 1 iş günü (89,99 TL)</li>
                                    <li>• 500 TL üzeri siparişlerde ücretsiz kargo</li>
                                    <li>• Tüm Türkiye&apos;ye teslimat</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="returns">
                            <AccordionTrigger>İade ve Değişim</AccordionTrigger>
                            <AccordionContent>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>• 14 gün içinde koşulsuz iade</li>
                                    <li>• Ürün etiketi sökülmemiş olmalı</li>
                                    <li>• Orijinal ambalajında olmalı</li>
                                    <li>• İade kargo ücretsiz</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section className="mt-16 md:mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Benzer Ürünler</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {similarProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
