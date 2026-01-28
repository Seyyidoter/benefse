'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { products as mockProducts } from '@/data/products';

interface UseProductsOptions {
    useTrendyol?: boolean;
    categoryId?: string;
    page?: number;
    size?: number;
}

interface UseProductsResult {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        totalPages: number;
        totalElements: number;
    } | null;
    refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
    const { useTrendyol = true, categoryId, page = 0, size = 50 } = options;

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<UseProductsResult['pagination']>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (useTrendyol) {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: size.toString(),
                });

                const response = await fetch(`/api/products?${params}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch from Trendyol');
                }

                const data = await response.json();

                let fetchedProducts = data.products as Product[];

                // Filter by category if specified
                if (categoryId) {
                    fetchedProducts = fetchedProducts.filter(p => p.categoryId === categoryId);
                }

                setProducts(fetchedProducts);
                setPagination(data.pagination);
            } else {
                // Use mock products
                let filteredProducts = [...mockProducts];

                if (categoryId) {
                    filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
                }

                setProducts(filteredProducts);
                setPagination({
                    page: 0,
                    totalPages: 1,
                    totalElements: filteredProducts.length,
                });
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');

            // Fallback to mock products on error
            let filteredProducts = [...mockProducts];
            if (categoryId) {
                filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
            }
            setProducts(filteredProducts);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [useTrendyol, categoryId, page, size]);

    return {
        products,
        isLoading,
        error,
        pagination,
        refetch: fetchProducts,
    };
}
