import { NextResponse } from 'next/server';
import { fetchTrendyolProducts, convertTrendyolProduct } from '@/lib/trendyol-api';
import { products as mockProducts } from '@/data/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '0');
        const size = parseInt(searchParams.get('size') || '50');
        const useMock = searchParams.get('mock') === 'true';

        // If mock mode requested
        if (useMock) {
            return NextResponse.json({
                products: mockProducts,
                pagination: {
                    page: 0,
                    size: mockProducts.length,
                    totalElements: mockProducts.length,
                    totalPages: 1,
                },
                source: 'mock',
            });
        }

        const response = await fetchTrendyolProducts(page, size);
        const products = response.content.map(convertTrendyolProduct);

        return NextResponse.json({
            products,
            pagination: {
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
            },
            source: 'trendyol',
        });
    } catch (error) {
        console.error('Products API Error:', error);

        // Fallback to mock products when Trendyol API fails
        return NextResponse.json({
            products: mockProducts,
            pagination: {
                page: 0,
                size: mockProducts.length,
                totalElements: mockProducts.length,
                totalPages: 1,
            },
            source: 'mock-fallback',
            message: 'Trendyol API unavailable, using demo data',
        });
    }
}
