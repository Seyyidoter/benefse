// Trendyol API Service - Türkiye Marketplace
// Documentation: https://developers.trendyol.com/docs/urun-filtreleme-filterproducts

const TRENDYOL_API_BASE = 'https://apigw.trendyol.com/integration';

interface TrendyolConfig {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
}

// Trendyol Türkiye Marketplace Product Format
interface TrendyolProduct {
    id: string;
    approved: boolean;
    archived: boolean;
    productCode: number;
    supplierId: number;
    createDateTime: number;
    lastUpdateDate: number;
    gender?: string;
    brand: string;
    barcode: string;
    title: string;
    categoryName: string;
    productMainId: string;
    description: string;
    stockUnitType: string;
    quantity: number;
    listPrice: number;
    salePrice: number;
    vatRate: number;
    dimensionalWeight?: number;
    stockCode: string;
    images: { url: string }[];
    attributes?: {
        attributeId: number;
        attributeName: string;
        attributeValueId?: number;
        attributeValue?: string;
    }[];
    hasActiveCampaign: boolean;
    locked: boolean;
    brandId: number;
    color?: string;
    size?: string;
    onsale: boolean;
    productUrl?: string;
}

interface TrendyolProductsResponse {
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    content: TrendyolProduct[];
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

function getAuthHeaders(config: TrendyolConfig): HeadersInit {
    const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');

    return {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `${config.supplierId} - SelfIntegration`,
    };
}

export async function fetchTrendyolProducts(
    page: number = 0,
    size: number = 50,
    barcode?: string,
    approved: boolean = true
): Promise<TrendyolProductsResponse> {
    const config = getConfig();
    const headers = getAuthHeaders(config);

    // Build URL with query params
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        approved: approved.toString(),
        supplierId: config.supplierId,
    });

    if (barcode) {
        params.append('barcode', barcode);
    }

    // Correct endpoint for Türkiye Marketplace
    const url = `${TRENDYOL_API_BASE}/product/sellers/${config.supplierId}/products?${params}`;

    console.log('Fetching Trendyol products from:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Trendyol API Error:', response.status, errorText);
        throw new Error(`Trendyol API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data;
}

export async function fetchAllTrendyolProducts(): Promise<TrendyolProduct[]> {
    const allProducts: TrendyolProduct[] = [];
    let page = 0;
    const maxPages = 10; // Safety limit

    do {
        const result = await fetchTrendyolProducts(page, 50, undefined);
        allProducts.push(...result.content);

        console.log(`Fetched page ${page + 1}/${result.totalPages}, got ${result.content.length} products, total: ${allProducts.length}`);

        page++;

        if (page >= result.totalPages) break;
    } while (page < maxPages);

    return allProducts;
}

// Convert Trendyol product to our Product type
export function convertTrendyolProduct(tp: TrendyolProduct) {
    return {
        id: tp.barcode || tp.id,
        title: tp.title,
        description: tp.description || tp.title,
        brand: tp.brand,
        categoryId: getCategorySlug(tp.categoryName),
        price: tp.listPrice,
        salePrice: tp.salePrice > 0 && tp.salePrice < tp.listPrice ? tp.salePrice : undefined,
        currency: 'TRY',
        stock: tp.quantity,
        sku: tp.stockCode || tp.productMainId,
        barcode: tp.barcode,
        images: tp.images?.map(img => img.url) || [],
        tags: tp.attributes?.map(attr => attr.attributeValue).filter(Boolean) as string[] || [],
        isActive: tp.approved && tp.onsale && !tp.archived,
        trendyolUrl: tp.productUrl,
        createdAt: new Date(tp.createDateTime),
        updatedAt: new Date(tp.lastUpdateDate),
    };
}

function getCategorySlug(categoryName: string): string {
    if (!categoryName) return 'ev-aksesuarlari';

    const name = categoryName.toLowerCase();

    if (name.includes('raf') || name.includes('mutfak')) return 'mutfak-raflari';
    if (name.includes('runner') || name.includes('masa örtüsü') || name.includes('örtü')) return 'runner-masa-ortusu';
    if (name.includes('lamba') || name.includes('aydınlatma')) return 'lambalar';
    if (name.includes('laptop') || name.includes('sehpa')) return 'laptop-sehpalari';

    return 'ev-aksesuarlari';
}

export type { TrendyolProduct, TrendyolProductsResponse };
