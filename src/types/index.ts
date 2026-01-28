// ============ Product Types ============
export interface ProductVariant {
    id: string;
    name: string; // e.g., "Beden" or "Renk"
    value: string; // e.g., "M" or "Kırmızı"
    stock: number;
    priceModifier?: number; // Additional price for this variant
}

export interface Product {
    id: string;
    title: string;
    description: string;
    brand: string;
    categoryId: string;
    tags: string[];
    images: string[];
    price: number;
    salePrice?: number;
    currency: string;
    stock: number;
    sku: string;
    barcode?: string;
    variants?: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    parentId?: string;
}

// ============ Cart Types ============
export interface CartItem {
    productId: string;
    title: string;
    price: number;
    salePrice?: number;
    quantity: number;
    image: string;
    variantId?: string;
    variantName?: string;
}

export interface Cart {
    items: CartItem[];
    couponCode?: string;
    couponDiscount?: number;
}

// ============ Order Types ============
export interface OrderAddress {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    postalCode?: string;
}

export interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    variantId?: string;
    variantName?: string;
}

export interface OrderTotals {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
}

export type OrderStatus = 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderDraft {
    id: string;
    items: OrderItem[];
    totals: OrderTotals;
    customerInfo: OrderAddress;
    shippingAddress: OrderAddress;
    shippingMethod: string;
    status: OrderStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============ Inventory Types ============
export interface InventoryLog {
    id: string;
    productId: string;
    delta: number;
    reason: string;
    createdAt: Date;
}

// ============ Shipping Types ============
export interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
}

// ============ Coupon Types ============
export interface Coupon {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount?: number;
    isActive: boolean;
    expiresAt?: Date;
}

// ============ Filter Types ============
export interface ProductFilters {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    brand?: string;
    tags?: string[];
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name';
}

// ============ API Response Types ============
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
