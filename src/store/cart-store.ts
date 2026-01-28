import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Cart } from '@/types';

interface CartState extends Cart {
    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    applyCoupon: (code: string, discount: number) => void;
    removeCoupon: () => void;

    // Computed
    getItemCount: () => number;
    getSubtotal: () => number;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            couponCode: undefined,
            couponDiscount: undefined,

            addItem: (item) => {
                const { items } = get();
                const existingIndex = items.findIndex(
                    (i) => i.productId === item.productId && i.variantId === item.variantId
                );

                if (existingIndex > -1) {
                    // Update quantity if item exists
                    const updatedItems = [...items];
                    updatedItems[existingIndex].quantity += 1;
                    set({ items: updatedItems });
                } else {
                    // Add new item
                    set({ items: [...items, { ...item, quantity: 1 }] });
                }
            },

            removeItem: (productId, variantId) => {
                const { items } = get();
                set({
                    items: items.filter(
                        (item) => !(item.productId === productId && item.variantId === variantId)
                    ),
                });
            },

            updateQuantity: (productId, quantity, variantId) => {
                const { items } = get();

                if (quantity <= 0) {
                    get().removeItem(productId, variantId);
                    return;
                }

                const updatedItems = items.map((item) =>
                    item.productId === productId && item.variantId === variantId
                        ? { ...item, quantity }
                        : item
                );

                set({ items: updatedItems });
            },

            clearCart: () => {
                set({ items: [], couponCode: undefined, couponDiscount: undefined });
            },

            applyCoupon: (code, discount) => {
                set({ couponCode: code, couponDiscount: discount });
            },

            removeCoupon: () => {
                set({ couponCode: undefined, couponDiscount: undefined });
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.salePrice || item.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const discount = get().couponDiscount || 0;
                return Math.max(0, subtotal - discount);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
