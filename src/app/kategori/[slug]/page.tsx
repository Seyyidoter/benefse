import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product';
import { fetchAllTrendyolProducts, convertTrendyolProduct } from '@/lib/trendyol-api';
import { categories, getCategoryBySlug } from '@/data/categories';
import { Product } from '@/types';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Kategori Bulunamadı',
        };
    }

    return {
        title: category.name,
        description: category.description || `${category.name} kategorisindeki ürünleri keşfedin.`,
    };
}

export function generateStaticParams() {
    return categories.map((cat) => ({
        slug: cat.slug,
    }));
}

// Revalidate this page every hour to avoid hitting API limits and slow loads
export const revalidate = 3600;

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    let categoryProducts: Product[] = [];

    try {
        console.log(`Fetching products for category: ${category.name} (${category.id})`);
        const trendyolData = await fetchAllTrendyolProducts();

        categoryProducts = trendyolData
            .map(convertTrendyolProduct)
            .filter((p) => p.categoryId === category.id && p.stock > 0);

        console.log(`Found ${categoryProducts.length} products for category ${category.slug}`);
    } catch (error) {
        console.error('Error fetching category products:', error);
    }

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
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{category.name}</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
                {category.description && (
                    <p className="text-muted-foreground">{category.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                    {categoryProducts.length} ürün
                </p>
            </div>

            {/* Products Grid */}
            {categoryProducts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground mb-4">
                        Bu kategoride henüz ürün bulunmuyor
                    </p>
                    <Link
                        href="/urunler"
                        className="text-primary hover:underline"
                    >
                        Tüm ürünleri görüntüle
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
