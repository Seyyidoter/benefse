import { ShippingMethod, Coupon } from '@/types';

export const shippingMethods: ShippingMethod[] = [
    {
        id: 'ship-1',
        name: 'Standart Kargo',
        description: 'Yurtiçi Kargo ile teslimat',
        price: 49.99,
        estimatedDays: '3-5 iş günü',
    },
    {
        id: 'ship-2',
        name: 'Hızlı Kargo',
        description: 'Ekspres kargo ile hızlı teslimat',
        price: 89.99,
        estimatedDays: '1-2 iş günü',
    },
    {
        id: 'ship-3',
        name: 'Ücretsiz Kargo',
        description: '500 TL üzeri siparişlerde ücretsiz',
        price: 0,
        estimatedDays: '3-5 iş günü',
    },
];

export const coupons: Coupon[] = [
    {
        code: 'HOSGELDIN10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 200,
        isActive: true,
    },
    {
        code: 'YAZ50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 300,
        isActive: true,
    },
    {
        code: 'DEMO20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 100,
        isActive: true,
    },
];

export const validateCoupon = (code: string, orderTotal: number): { valid: boolean; discount: number; message: string } => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
        return { valid: false, discount: 0, message: 'Geçersiz kupon kodu' };
    }

    if (!coupon.isActive) {
        return { valid: false, discount: 0, message: 'Bu kupon artık geçerli değil' };
    }

    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
        return {
            valid: false,
            discount: 0,
            message: `Minimum sipariş tutarı: ${coupon.minOrderAmount} TL`
        };
    }

    const discount = coupon.discountType === 'percentage'
        ? (orderTotal * coupon.discountValue) / 100
        : coupon.discountValue;

    return {
        valid: true,
        discount,
        message: `%${coupon.discountValue} indirim uygulandı!`
    };
};

export const getShippingMethod = (id: string): ShippingMethod | undefined => {
    return shippingMethods.find((s) => s.id === id);
};

export const getFreeShippingEligibility = (orderTotal: number): boolean => {
    return orderTotal >= 500;
};
