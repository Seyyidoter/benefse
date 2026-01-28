import { NextResponse } from 'next/server';
import { fetchTrendyolProducts, convertTrendyolProduct } from '@/lib/trendyol-api';
import { products as mockProducts } from '@/data/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const useMock = searchParams.get('mock') === 'true';
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '50');
    const barcode = searchParams.get('barcode') || undefined;

    // If mock mode requested
    if (useMock) {
        return NextResponse.json({
            products: mockProducts,
            pagination: {
                total: mockProducts.length,
                page: 0,
                totalPages: 1,
            },
            source: 'mock',
        });
    }

    try {
        console.log('Attempting to fetch from Trendyol API...');
        console.log('Environment check:', {
            hasSupplierId: !!process.env.TRENDYOL_SUPPLIER_ID,
            hasApiKey: !!process.env.TRENDYOL_API_KEY,
            hasApiSecret: !!process.env.TRENDYOL_API_SECRET,
        });

        const result = await fetchTrendyolProducts(page, size, barcode);
        const products = result.content.map(convertTrendyolProduct);

        console.log(`Successfully fetched ${products.length} products from Trendyol`);

        return NextResponse.json({
            products,
            pagination: {
                total: result.totalElements,
                page: result.page,
                totalPages: result.totalPages,
                size: result.size,
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
                page: 0,
                totalPages: 1,
            },
            source: 'mock-fallback',
            error: errorMessage,
            message: 'Trendyol API unavailable, using demo data',
        });
    }
}
