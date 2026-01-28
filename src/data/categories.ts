import { Category } from '@/types';

export const categories: Category[] = [
    {
        id: 'mutfak-raflari',
        name: 'Mutfak Rafları',
        slug: 'mutfak-raflari',
        description: 'Şık ve fonksiyonel mutfak rafları, tezgah üstü organizatörler',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    },
    {
        id: 'runner-masa-ortusu',
        name: 'Runner & Masa Örtüsü',
        slug: 'runner-masa-ortusu',
        description: 'El yapımı keten runner, dantel masa örtüleri ve servisler',
        image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop',
    },
    {
        id: 'lambalar',
        name: 'Masa & Gece Lambaları',
        slug: 'lambalar',
        description: 'Dekoratif masa lambaları ve modern gece lambaları',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    },
    {
        id: 'ev-aksesuarlari',
        name: 'Ev Aksesuarları',
        slug: 'ev-aksesuarlari',
        description: 'Dekoratif aksesuarlar, servis setleri ve ev düzenleme ürünleri',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop',
    },
    {
        id: 'laptop-sehpalari',
        name: 'Laptop Sehpaları',
        slug: 'laptop-sehpalari',
        description: 'Ergonomik ve şık laptop sehpaları',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
    },
];

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}

