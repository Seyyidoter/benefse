// Trendyol API Service
// Documentation: https://developers.trendyol.com/

const TRENDYOL_API_BASE = 'https://api.trendyol.com/sapigw';

interface TrendyolConfig {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
}

interface TrendyolProduct {
    id: string;
    barcode: string;
    title: string;
    productMainId: string;
    brandId: number;
    brandName: string;
    categoryId: number;
    categoryName: string;
    quantity: number;
    stockCode: string;
    dimensionalWeight: number;
    description: string;
    currencyType: string;
    listPrice: number;
    salePrice: number;
    vatRate: number;
    cargoCompanyId: number;
    images: { url: string }[];
    attributes: { attributeId: number; attributeName: string; attributeValue: string }[];
    createDateTime: number;
    lastUpdateDate: number;
    productUrl: string;
    approved: boolean;
    archived: boolean;
    onSale: boolean;
    rejected: boolean;
    blacklisted: boolean;
    hasActiveCampaign: boolean;
}

interface TrendyolProductsResponse {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
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
        'User-Agent': `${config.supplierId} - SelfIntegration`,
        'Accept': 'application/json',
    };
}

export async function fetchTrendyolProducts(
    page: number = 0,
    size: number = 50,
    approved: boolean = true
): Promise<TrendyolProductsResponse> {
    const config = getConfig();
    const headers = getAuthHeaders(config);

    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        approved: approved.toString(),
    });

    const url = `${TRENDYOL_API_BASE}/suppliers/${config.supplierId}/products?${params}`;

    console.log('Fetching Trendyol products from:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store', // Disable cache for debugging
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Trendyol API Error:', response.status, errorText);
        throw new Error(`Trendyol API error: ${response.status}`);
    }

    return response.json();
}

export async function fetchAllTrendyolProducts(): Promise<TrendyolProduct[]> {
    const allProducts: TrendyolProduct[] = [];
    let page = 0;
    let hasMore = true;
    const maxPages = 10; // Safety limit

    while (hasMore && page < maxPages) {
        const response = await fetchTrendyolProducts(page, 50);
        allProducts.push(...response.content);

        hasMore = page < response.totalPages - 1;
        page++;
    }

    return allProducts;
}

// Convert Trendyol product to our Product type
export function convertTrendyolProduct(tp: TrendyolProduct) {
    return {
        id: tp.barcode || tp.id,
        title: tp.title,
        description: tp.description || tp.title,
        brand: tp.brandName,
        categoryId: getCategorySlug(tp.categoryName),
        categoryName: tp.categoryName,
        price: tp.listPrice,
        salePrice: tp.salePrice < tp.listPrice ? tp.salePrice : undefined,
        currency: 'TRY' as const,
        stock: tp.quantity,
        sku: tp.stockCode || tp.productMainId,
        barcode: tp.barcode,
        images: tp.images.map(img => img.url),
        tags: tp.attributes.map(attr => attr.attributeValue).filter(Boolean),
        isActive: tp.onSale && tp.approved && !tp.archived,
        trendyolUrl: tp.productUrl,
        createdAt: new Date(tp.createDateTime),
        updatedAt: new Date(tp.lastUpdateDate),
    };
}

function getCategorySlug(categoryName: string): string {
    const categoryMap: Record<string, string> = {
        'Mutfak Rafı': 'mutfak-raflari',
        'Mutfak Düzenleyici': 'mutfak-raflari',
        'Runner': 'runner-masa-ortusu',
        'Masa Örtüsü': 'runner-masa-ortusu',
        'Amerikan Servisi': 'runner-masa-ortusu',
        'Gece Lambası': 'lambalar',
        'Masa Lambası': 'lambalar',
        'Aydınlatma': 'lambalar',
        'Laptop Sehpası': 'laptop-sehpalari',
        'Ev Dekorasyon': 'ev-aksesuarlari',
    };

    // Try to find a matching category
    for (const [key, slug] of Object.entries(categoryMap)) {
        if (categoryName.toLowerCase().includes(key.toLowerCase())) {
            return slug;
        }
    }

    return 'ev-aksesuarlari'; // Default category
}

export type { TrendyolProduct, TrendyolProductsResponse };
