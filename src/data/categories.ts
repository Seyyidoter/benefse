import { Category } from '@/types';

export const categories: Category[] = [
    {
        id: 'mutfak-raflari',
        name: 'Mutfak Rafları',
        slug: 'mutfak-raflari',
        description: 'Şık ve fonksiyonel mutfak rafları, tezgah üstü organizatörler',
        image: 'https://cdn.dsmcdn.com/ty1816/prod/QC_PREP/20260126/21/473f7ed0-f747-3029-8e65-325c13c792a8/1_org_zoom.jpg',
    },
    {
        id: 'runner-masa-ortusu',
        name: 'Runner & Masa Örtüsü',
        slug: 'runner-masa-ortusu',
        description: 'El yapımı keten runner, dantel masa örtüleri ve servisler',
        image: 'https://cdn.dsmcdn.com/ty1703/prod/QC_PREP/20250702/15/8f903b88-5300-3981-b848-d30f7eaa2bde/1_org_zoom.jpg',
    },
    {
        id: 'lambalar',
        name: 'Masa & Gece Lambaları',
        slug: 'lambalar',
        description: 'Dekoratif masa lambaları ve modern gece lambaları',
        image: 'https://cdn.dsmcdn.com/ty1813/prod/QC_PREP/20260121/23/7965425b-048b-31e7-9940-ec01c434629e/1_org_zoom.jpg',
    },
    {
        id: 'ev-aksesuarlari',
        name: 'Ev Aksesuarları',
        slug: 'ev-aksesuarlari',
        description: 'Dekoratif aksesuarlar, servis setleri ve ev düzenleme ürünleri',
        image: 'https://cdn.dsmcdn.com/ty1575/prod/QC/20241003/15/c8a0ad97-7dcb-3ff7-9c24-d754e60e4ddb/1_org_zoom.jpg',
    },
];

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}
