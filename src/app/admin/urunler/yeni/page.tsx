'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getCatalogAdapter } from '@/adapters';
import { categories } from '@/data/categories';
import { toast } from 'sonner';

const productSchema = z.object({
    title: z.string().min(3, 'Ürün adı en az 3 karakter olmalı'),
    description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
    brand: z.string().min(1, 'Marka seçin'),
    categoryId: z.string().min(1, 'Kategori seçin'),
    price: z.coerce.number().positive('Fiyat 0\'dan büyük olmalı'),
    salePrice: z.coerce.number().optional(),
    stock: z.coerce.number().int().min(0, 'Stok 0 veya daha fazla olmalı'),
    sku: z.string().min(1, 'SKU gerekli'),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            description: '',
            brand: '',
            categoryId: '',
            price: 0,
            salePrice: undefined,
            stock: 0,
            sku: '',
            barcode: '',
            isActive: true,
        },
    });

    const addImage = () => {
        if (newImageUrl && !images.includes(newImageUrl)) {
            setImages([...images, newImageUrl]);
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag.toLowerCase()]);
            setNewTag('');
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        try {
            const adapter = getCatalogAdapter();

            await adapter.createProduct({
                ...data,
                images,
                tags,
                currency: 'TRY',
                salePrice: data.salePrice || undefined,
                barcode: data.barcode || undefined,
            });

            toast.success('Ürün eklendi');
            router.push('/admin/urunler');
        } catch (error) {
            console.error('Failed to create product:', error);
            toast.error('Ürün eklenemedi');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/urunler">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Ürün</h1>
                    <p className="text-muted-foreground mt-1">Yeni bir ürün ekleyin</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Temel Bilgiler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ürün Adı</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ürün adını girin" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Açıklama</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ürün açıklamasını girin"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marka</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Marka adı" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Kategori seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <FormLabel>Etiketler</FormLabel>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        placeholder="Etiket ekle"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-muted px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(index)}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Görseller</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="Görsel URL'si girin"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                />
                                <Button type="button" onClick={addImage} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ekle
                                </Button>
                            </div>
                            <FormDescription className="mb-4">
                                Görsel URL&apos;lerini ekleyin. İlk görsel ana görsel olarak kullanılır.
                            </FormDescription>
                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                                        >
                                            <img
                                                src={url}
                                                alt={`Ürün görseli ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                                    Ana
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                    <p>Henüz görsel eklenmedi</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pricing & Stock */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fiyat ve Stok</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fiyat (TRY)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="salePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İndirimli Fiyat (Opsiyonel)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Yoksa boş bırakın"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stok Adedi</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SKU</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Örn: ME-BLZ-001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="barcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Barkod (Opsiyonel)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Barkod numarası" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="!mt-0">Ürün aktif (mağazada görünsün)</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Link href="/admin/urunler">
                            <Button type="button" variant="outline">
                                İptal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        >
                            {isSubmitting ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
