// Trendyol API Service
// Documentation: https://developers.trendyol.com/docs/api-endpointleri

const TRENDYOL_API_BASE = 'https://apigw.trendyol.com/integration/ecgw';

interface TrendyolConfig {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
}

// Trendyol İhracat Merkezi Product Format
interface TrendyolProduct {
    barcode: string;
    sellerBarcode?: string;
    rrpPrice: number;
    buyingPrice: number;
    stock: number;
    origin?: string;
    composition?: string;
    description: string;
    currency: string;
    gtip?: string;
    categoryId: number;
    careInstructions?: string;
    attributes?: {
        attributeId: number;
        attributeName: string;
        valueId: number | null;
        valueName: string;
    }[];
}

function getConfig(): TrendyolConfig {
    const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
    const apiKey = process.env.TRENDYOL_API_KEY;
    const apiSecret = process.env.TRENDYOL_API_SECRET;

    if (!supplierId || !apiKey || !apiSecret) {
        throw new Error('Trendyol API credentials are not configured');
    }

    return { supplierId, apiKey, apiSecret };
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getAuthHeaders(config: TrendyolConfig): HeadersInit {
    const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');

    return {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `${config.supplierId} - SelfIntegration`,
        'x-agentname': `${config.supplierId} - SelfIntegration`,
        'x-correlationid': generateUUID(),
        'x-clientip': '127.0.0.1', // Will be replaced by server IP
    };
}

export async function fetchTrendyolProducts(
    size: number = 100,
    pageKey?: string
): Promise<{ products: TrendyolProduct[]; nextPageKey?: string }> {
    const config = getConfig();
    const headers = getAuthHeaders(config);

    // Build URL with query params
    const params = new URLSearchParams({
        size: size.toString(),
    });

    if (pageKey) {
        params.set('pageKey', pageKey);
    }

    const url = `${TRENDYOL_API_BASE}/v2/${config.supplierId}/products?${params}`;

    console.log('Fetching Trendyol products from:', url);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Trendyol API Error:', response.status, errorText);
        throw new Error(`Trendyol API error: ${response.status} - ${errorText}`);
    }

    const products: TrendyolProduct[] = await response.json();

    // Get next page key from response headers
    const nextPageKey = response.headers.get('x-paging-key') || undefined;

    return { products, nextPageKey };
}

export async function fetchAllTrendyolProducts(): Promise<TrendyolProduct[]> {
    const allProducts: TrendyolProduct[] = [];
    let pageKey: string | undefined = undefined;
    let pageCount = 0;
    const maxPages = 10; // Safety limit

    do {
        const result = await fetchTrendyolProducts(100, pageKey);
        allProducts.push(...result.products);
        pageKey = result.nextPageKey;
        pageCount++;

        console.log(`Fetched page ${pageCount}, got ${result.products.length} products, total: ${allProducts.length}`);
    } while (pageKey && pageCount < maxPages);

    return allProducts;
}

// Convert Trendyol product to our Product type
export function convertTrendyolProduct(tp: TrendyolProduct) {
    // Get product title from attributes or description
    const colorAttr = tp.attributes?.find(a => a.attributeName === 'Renk');
    const title = tp.description || `Ürün - ${tp.barcode}`;

    return {
        id: tp.barcode,
        title: title,
        description: tp.description || title,
        brand: 'Benefse',
        categoryId: getCategorySlug(tp.categoryId),
        price: tp.rrpPrice,
        salePrice: tp.buyingPrice < tp.rrpPrice ? tp.buyingPrice : undefined,
        currency: tp.currency || 'TRY',
        stock: tp.stock,
        sku: tp.sellerBarcode || tp.barcode,
        barcode: tp.barcode,
        images: [], // Trendyol İhracat API doesn't return images
        tags: tp.attributes?.map(attr => attr.valueName).filter(Boolean) || [],
        isActive: tp.stock > 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function getCategorySlug(categoryId: number): string {
    // Map Trendyol category IDs to our slugs
    // You can expand this based on your actual categories
    const categoryMap: Record<number, string> = {
        // Add your Trendyol category IDs here
    };

    return categoryMap[categoryId] || 'ev-aksesuarlari';
}

export type { TrendyolProduct };
