import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeProduct(p: any): Product {
  if (!p) {
    return {
      id: 'unknown',
      title: 'Ürün Bulunamadı',
      description: '',
      brand: 'Bilinmeyen Marka',
      categoryId: 'unknown',
      tags: [],
      images: ['/placeholder.jpg'],
      price: 0,
      currency: 'TRY',
      stock: 0,
      sku: 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
    };
  }

  return {
    ...p,
    id: p.id || 'unknown', // ID garantisi
    title: p.title || 'İsimsiz Ürün',
    tags: Array.isArray(p.tags) ? p.tags : [],
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/placeholder.jpg'],
    createdAt: p.createdAt ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? new Date().toISOString(),
    price: typeof p.price === 'number' ? p.price : 0,
    stock: typeof p.stock === 'number' ? p.stock : 0,
    isActive: p.isActive ?? true,
  };
}
