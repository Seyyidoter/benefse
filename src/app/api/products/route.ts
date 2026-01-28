import { NextResponse } from 'next/server';
import { fetchTrendyolProducts, convertTrendyolProduct } from '@/lib/trendyol-api';
import { products as mockProducts } from '@/data/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const useMock = searchParams.get('mock') === 'true';
    const size = parseInt(searchParams.get('size') || '100');
    const pageKey = searchParams.get('pageKey') || undefined;

    // If mock mode requested
    if (useMock) {
        return NextResponse.json({
            products: mockProducts,
            pagination: {
                total: mockProducts.length,
            },
            source: 'mock',
        });
    }

    try {
        console.log('Attempting to fetch from Trendyol API...');

        const result = await fetchTrendyolProducts(size, pageKey);
        const products = result.products.map(convertTrendyolProduct);

        console.log(`Successfully fetched ${products.length} products from Trendyol`);

        return NextResponse.json({
            products,
            pagination: {
                total: products.length,
                nextPageKey: result.nextPageKey,
            },
            source: 'trendyol',
        });
    } catch (error) {
        console.error('Trendyol API Error:', error);

        // Log the full error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);

        // Fallback to mock products when Trendyol API fails
        return NextResponse.json({
            products: mockProducts,
            pagination: {
                total: mockProducts.length,
            },
            source: 'mock-fallback',
            error: errorMessage,
            message: 'Trendyol API unavailable, using demo data',
        });
    }
}
