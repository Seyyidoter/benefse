import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderDraft, OrderItem, OrderAddress, OrderTotals } from '@/types';

interface OrderState {
    drafts: OrderDraft[];
    currentDraft: Partial<OrderDraft> | null;

    // Actions
    startOrder: (items: OrderItem[], totals: Omit<OrderTotals, 'total'>) => void;
    updateCustomerInfo: (info: OrderAddress) => void;
    updateShippingAddress: (address: OrderAddress) => void;
    updateShippingMethod: (method: string, shippingCost: number) => void;
    saveDraft: () => OrderDraft | null;
    clearCurrentDraft: () => void;
    getDraftById: (id: string) => OrderDraft | undefined;
    getAllDrafts: () => OrderDraft[];
    deleteDraft: (id: string) => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            drafts: [],
            currentDraft: null,

            startOrder: (items, totals) => {
                const total = totals.subtotal + totals.shipping - totals.discount;
                set({
                    currentDraft: {
                        items,
                        totals: { ...totals, total },
                        status: 'draft',
                    },
                });
            },

            updateCustomerInfo: (info) => {
                const { currentDraft } = get();
                if (!currentDraft) return;

                set({
                    currentDraft: {
                        ...currentDraft,
                        customerInfo: info,
                    },
                });
            },

            updateShippingAddress: (address) => {
                const { currentDraft } = get();
                if (!currentDraft) return;

                set({
                    currentDraft: {
                        ...currentDraft,
                        shippingAddress: address,
                    },
                });
            },

            updateShippingMethod: (method, shippingCost) => {
                const { currentDraft } = get();
                if (!currentDraft || !currentDraft.totals) return;

                const newTotals = {
                    ...currentDraft.totals,
                    shipping: shippingCost,
                    total: currentDraft.totals.subtotal + shippingCost - currentDraft.totals.discount,
                };

                set({
                    currentDraft: {
                        ...currentDraft,
                        shippingMethod: method,
                        totals: newTotals,
                    },
                });
            },

            saveDraft: () => {
                const { currentDraft, drafts } = get();

                if (!currentDraft || !currentDraft.items || !currentDraft.customerInfo) {
                    return null;
                }

                const newDraft: OrderDraft = {
                    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    items: currentDraft.items,
                    totals: currentDraft.totals!,
                    customerInfo: currentDraft.customerInfo,
                    shippingAddress: currentDraft.shippingAddress || currentDraft.customerInfo,
                    shippingMethod: currentDraft.shippingMethod || 'standard',
                    status: 'draft',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set({
                    drafts: [newDraft, ...drafts],
                    currentDraft: null,
                });

                return newDraft;
            },

            clearCurrentDraft: () => {
                set({ currentDraft: null });
            },

            getDraftById: (id) => {
                return get().drafts.find((d) => d.id === id);
            },

            getAllDrafts: () => {
                return get().drafts;
            },

            deleteDraft: (id) => {
                const { drafts } = get();
                set({ drafts: drafts.filter((d) => d.id !== id) });
            },
        }),
        {
            name: 'order-storage',
            partialize: (state) => ({ drafts: state.drafts }),
        }
    )
);
