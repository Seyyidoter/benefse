/**
 * Manual Catalog Adapter
 * 
 * Mock JSON verisi kullanarak ürün kataloğu işlemlerini yönetir.
 * Veritabanı entegrasyonu yapılana kadar bu adapter kullanılır.
 * 
 * LocalStorage ile veri kalıcılığı sağlanır (client-side).
 * Server-side için JSON dosyası veya memory cache kullanılır.
 */

import { CatalogAdapter } from './catalog-adapter';
import { Product, Category, ProductFilters, PaginatedResponse } from '@/types';
import { products as initialProducts } from '@/data/products';
import { categories as initialCategories } from '@/data/categories';

// In-memory storage for server-side operations
let productsStore: Product[] = [...initialProducts];
let categoriesStore: Category[] = [...initialCategories];

const PRODUCTS_STORAGE_KEY = 'catalog_products';
const CATEGORIES_STORAGE_KEY = 'catalog_categories';

export class ManualCatalogAdapter implements CatalogAdapter {
    private isClient: boolean;

    constructor() {
        this.isClient = typeof window !== 'undefined';
        if (this.isClient) {
            this.loadFromLocalStorage();
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);

            if (storedProducts) {
                productsStore = JSON.parse(storedProducts).map((p: Product) => ({
                    ...p,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt),
                }));
            }

            if (storedCategories) {
                categoriesStore = JSON.parse(storedCategories);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    }

    private saveToLocalStorage(): void {
        if (this.isClient) {
            try {
                localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsStore));
                localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesStore));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        }
    }

    async fetchProducts(
        filters?: ProductFilters,
        page: number = 1,
        pageSize: number = 12
    ): Promise<PaginatedResponse<Product>> {
        let filtered = [...productsStore].filter(p => p.isActive);

        if (filters) {
            // Category filter
            if (filters.categoryId) {
                filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
            }

            // Search filter
            if (filters.search) {
                const query = filters.search.toLowerCase();
                filtered = filtered.filter(
                    (p) =>
                        p.title.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query) ||
                        p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
                        p.brand.toLowerCase().includes(query)
                );
            }

            // Price filters
            if (filters.minPrice !== undefined) {
                filtered = filtered.filter((p) => (p.salePrice || p.price) >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                filtered = filtered.filter((p) => (p.salePrice || p.price) <= filters.maxPrice!);
            }

            // In stock filter
            if (filters.inStock) {
                filtered = filtered.filter((p) => p.stock > 0);
            }

            // Brand filter
            if (filters.brand) {
                filtered = filtered.filter((p) => p.brand === filters.brand);
            }

            // Tags filter
            if (filters.tags && filters.tags.length > 0) {
                filtered = filtered.filter((p) =>
                    filters.tags!.some((tag) => p.tags.includes(tag))
                );
            }

            // Sorting
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'price-asc':
                        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
                        break;
                    case 'price-desc':
                        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
                        break;
                    case 'newest':
                        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        break;
                    case 'name':
                        filtered.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
                        break;
                }
            }
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        return {
            items,
            total,
            page,
            pageSize,
            totalPages,
        };
    }

    async fetchProductById(id: string): Promise<Product | null> {
        return productsStore.find((p) => p.id === id) || null;
    }

    async fetchProductBySku(sku: string): Promise<Product | null> {
        return productsStore.find((p) => p.sku === sku) || null;
    }

    async fetchCategories(): Promise<Category[]> {
        return [...categoriesStore];
    }

    async fetchCategoryById(id: string): Promise<Category | null> {
        return categoriesStore.find((c) => c.id === id) || null;
    }

    async fetchCategoryBySlug(slug: string): Promise<Category | null> {
        return categoriesStore.find((c) => c.slug === slug) || null;
    }

    async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        const newProduct: Product = {
            ...product,
            id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        productsStore.push(newProduct);
        this.saveToLocalStorage();

        return newProduct;
    }

    async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
        const index = productsStore.findIndex((p) => p.id === id);

        if (index === -1) {
            return null;
        }

        productsStore[index] = {
            ...productsStore[index],
            ...updates,
            updatedAt: new Date(),
        };

        this.saveToLocalStorage();

        return productsStore[index];
    }

    async deleteProduct(id: string): Promise<boolean> {
        const index = productsStore.findIndex((p) => p.id === id);

        if (index === -1) {
            return false;
        }

        // Soft delete - mark as inactive
        productsStore[index].isActive = false;
        productsStore[index].updatedAt = new Date();

        this.saveToLocalStorage();

        return true;
    }

    async updateStockPrice(productId: string, stock: number, price: number): Promise<boolean> {
        const product = await this.updateProduct(productId, { stock, price });
        return product !== null;
    }

    // Admin utility: Get all products including inactive
    async fetchAllProducts(): Promise<Product[]> {
        return [...productsStore];
    }

    // Admin utility: Hard delete product
    async hardDeleteProduct(id: string): Promise<boolean> {
        const index = productsStore.findIndex((p) => p.id === id);

        if (index === -1) {
            return false;
        }

        productsStore.splice(index, 1);
        this.saveToLocalStorage();

        return true;
    }

    // Reset to initial data (for testing)
    async resetToInitialData(): Promise<void> {
        productsStore = [...initialProducts];
        categoriesStore = [...initialCategories];
        this.saveToLocalStorage();
    }
}

// Singleton instance
let catalogAdapterInstance: ManualCatalogAdapter | null = null;

export function getCatalogAdapter(): ManualCatalogAdapter {
    if (!catalogAdapterInstance) {
        catalogAdapterInstance = new ManualCatalogAdapter();
    }
    return catalogAdapterInstance;
}
