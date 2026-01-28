/**
 * Catalog Adapter Interface
 * 
 * Bu interface, ürün kataloğu işlemlerini soyutlar.
 * Şu anda ManualCatalogAdapter (mock JSON) kullanılıyor.
 * Trendyol API entegrasyonu için TrendyolApiAdapter eklenecek.
 */

import { Product, Category, ProductFilters, PaginatedResponse } from '@/types';

export interface CatalogAdapter {
    // Ürün işlemleri
    fetchProducts(filters?: ProductFilters, page?: number, pageSize?: number): Promise<PaginatedResponse<Product>>;
    fetchProductById(id: string): Promise<Product | null>;
    fetchProductBySku(sku: string): Promise<Product | null>;

    // Kategori işlemleri
    fetchCategories(): Promise<Category[]>;
    fetchCategoryById(id: string): Promise<Category | null>;
    fetchCategoryBySlug(slug: string): Promise<Category | null>;

    // Admin işlemleri
    createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    updateProduct(id: string, product: Partial<Product>): Promise<Product | null>;
    deleteProduct(id: string): Promise<boolean>;

    // Stok ve fiyat işlemleri
    updateStockPrice(productId: string, stock: number, price: number): Promise<boolean>;

    // Trendyol entegrasyon hazırlığı (ileride kullanılacak)
    syncFromTrendyol?(): Promise<{ success: boolean; synced: number; errors: string[] }>;
    pushToTrendyol?(productId: string): Promise<boolean>;
}

export interface TrendyolApiConfig {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
    baseUrl?: string;
}

/**
 * Trendyol API Adapter (Placeholder)
 * 
 * Bu adapter, Trendyol API entegrasyonu sağlandığında kullanılacak.
 * Şu anda devre dışı - ManualCatalogAdapter kullanılıyor.
 * 
 * Trendyol API Dökümantasyonu:
 * - https://developers.trendyol.com/
 * - Satıcı API'si ile ürün, stok ve fiyat yönetimi yapılabilir
 * - API erişimi için Trendyol satıcı hesabı gerekli
 * 
 * Entegrasyon adımları:
 * 1. Trendyol satıcı panelinden API credentials al
 * 2. TrendyolApiAdapter'ı implement et
 * 3. .env dosyasına credentials ekle
 * 4. Admin panelinde adapter seçimi yap
 */
export class TrendyolApiAdapter implements CatalogAdapter {
    private config: TrendyolApiConfig;

    constructor(config: TrendyolApiConfig) {
        this.config = config;
    }

    // Bu metodlar Trendyol API entegrasyonunda implement edilecek
    async fetchProducts(): Promise<PaginatedResponse<Product>> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil. Lütfen manuel katalog kullanın.');
    }

    async fetchProductById(): Promise<Product | null> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async fetchProductBySku(): Promise<Product | null> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async fetchCategories(): Promise<Category[]> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async fetchCategoryById(): Promise<Category | null> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async fetchCategoryBySlug(): Promise<Category | null> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async createProduct(): Promise<Product> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async updateProduct(): Promise<Product | null> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async deleteProduct(): Promise<boolean> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    async updateStockPrice(): Promise<boolean> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    /**
     * Trendyol'dan ürünleri senkronize eder
     * API erişimi sağlandığında implement edilecek
     */
    async syncFromTrendyol(): Promise<{ success: boolean; synced: number; errors: string[] }> {
        // TODO: Implement Trendyol API sync
        // const response = await fetch(`${this.config.baseUrl}/suppliers/${this.config.supplierId}/products`, {
        //   headers: {
        //     'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64')}`,
        //     'User-Agent': `${this.config.supplierId} - SelfIntegration`,
        //   }
        // });
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }

    /**
     * Ürünü Trendyol'a gönderir
     * API erişimi sağlandığında implement edilecek
     */
    async pushToTrendyol(): Promise<boolean> {
        throw new Error('Trendyol API entegrasyonu henüz aktif değil.');
    }
}
