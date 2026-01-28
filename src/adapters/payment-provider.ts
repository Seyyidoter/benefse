/**
 * Payment Provider Interface
 * 
 * Bu interface, ödeme işlemlerini soyutlar.
 * Şu anda DemoPaymentProvider kullanılıyor (ödeme kapalı).
 * Canlıya geçişte iyzico veya PayTR entegrasyonu yapılacak.
 * 
 * Türkiye için önerilen ödeme çözümleri:
 * 
 * 1. iyzico (https://www.iyzico.com/)
 *    - CheckoutForm ile kolay entegrasyon
 *    - 3D Secure desteği
 *    - Tüm kartları destekler
 *    - Kurulum: npm install iyzipay
 * 
 * 2. PayTR (https://www.paytr.com/)
 *    - iFrame API ile entegrasyon
 *    - Sanal POS desteği
 *    - Link ile ödeme
 * 
 * 3. Stripe (https://stripe.com/)
 *    - Global çözüm ama TRY desteği sınırlı
 *    - Kurulum: npm install stripe @stripe/stripe-js
 */

import { OrderDraft } from '@/types';

export interface PaymentResult {
    success: boolean;
    redirectUrl?: string;
    iframeToken?: string;
    transactionId?: string;
    error?: string;
}

export interface PaymentCallbackResult {
    status: 'success' | 'failed' | 'pending';
    transactionId?: string;
    orderId?: string;
    error?: string;
}

export interface PaymentProvider {
    /**
     * Ödeme sürecini başlatır
     */
    startPayment(orderDraft: OrderDraft): Promise<PaymentResult>;

    /**
     * Ödeme callback'ini işler (webhook/redirect sonrası)
     */
    handleCallback(request: Request): Promise<PaymentCallbackResult>;

    /**
     * Ödeme durumunu kontrol eder
     */
    checkPaymentStatus(transactionId: string): Promise<PaymentCallbackResult>;

    /**
     * İade işlemi başlatır
     */
    refundPayment?(transactionId: string, amount?: number): Promise<PaymentResult>;
}

/**
 * Demo Payment Provider
 * 
 * Geliştirme aşamasında kullanılır.
 * Gerçek ödeme almaz, sadece sipariş taslağı kaydeder.
 */
export class DemoPaymentProvider implements PaymentProvider {
    async startPayment(orderDraft: OrderDraft): Promise<PaymentResult> {
        // Demo modda ödeme başarısız döner ve kullanıcıya bilgi verilir
        console.log('[DEMO] Payment attempt for order:', orderDraft.id);

        return {
            success: false,
            error: 'Ödeme sistemi şu anda demo modundadır. Gerçek ödeme alınmamaktadır.',
        };
    }

    async handleCallback(): Promise<PaymentCallbackResult> {
        return {
            status: 'failed',
            error: 'Demo modunda callback işlenmez.',
        };
    }

    async checkPaymentStatus(): Promise<PaymentCallbackResult> {
        return {
            status: 'pending',
            error: 'Demo modunda ödeme durumu kontrol edilemez.',
        };
    }
}

/**
 * iyzico Payment Provider (Placeholder)
 * 
 * Canlıya geçişte implement edilecek.
 * Gerekli credentials:
 * - IYZICO_API_KEY
 * - IYZICO_SECRET_KEY
 * - IYZICO_BASE_URL (sandbox veya production)
 */
export class IyzicoPaymentProvider implements PaymentProvider {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    private apiKey: string;
    private secretKey: string;
    private baseUrl: string;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    constructor(apiKey: string, secretKey: string, baseUrl: string = 'https://sandbox-api.iyzipay.com') {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.baseUrl = baseUrl;
    }

    async startPayment(): Promise<PaymentResult> {
        // TODO: Implement iyzico CheckoutForm integration
        // const Iyzipay = require('iyzipay');
        // const iyzipay = new Iyzipay({
        //   apiKey: this.apiKey,
        //   secretKey: this.secretKey,
        //   uri: this.baseUrl
        // });

        throw new Error('iyzico entegrasyonu henüz implement edilmedi.');
    }

    async handleCallback(): Promise<PaymentCallbackResult> {
        throw new Error('iyzico entegrasyonu henüz implement edilmedi.');
    }

    async checkPaymentStatus(): Promise<PaymentCallbackResult> {
        throw new Error('iyzico entegrasyonu henüz implement edilmedi.');
    }
}

/**
 * PayTR Payment Provider (Placeholder)
 * 
 * Canlıya geçişte implement edilecek.
 * Gerekli credentials:
 * - PAYTR_MERCHANT_ID
 * - PAYTR_MERCHANT_KEY
 * - PAYTR_MERCHANT_SALT
 */
export class PayTRPaymentProvider implements PaymentProvider {
    async startPayment(): Promise<PaymentResult> {
        // TODO: Implement PayTR iFrame API integration
        throw new Error('PayTR entegrasyonu henüz implement edilmedi.');
    }

    async handleCallback(): Promise<PaymentCallbackResult> {
        throw new Error('PayTR entegrasyonu henüz implement edilmedi.');
    }

    async checkPaymentStatus(): Promise<PaymentCallbackResult> {
        throw new Error('PayTR entegrasyonu henüz implement edilmedi.');
    }
}

// Default provider - Demo mode
let paymentProviderInstance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
    if (!paymentProviderInstance) {
        // Check environment for provider type
        const providerType = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'demo';

        switch (providerType) {
            case 'iyzico':
            // paymentProviderInstance = new IyzicoPaymentProvider(
            //   process.env.IYZICO_API_KEY!,
            //   process.env.IYZICO_SECRET_KEY!,
            //   process.env.IYZICO_BASE_URL
            // );
            // break;
            case 'paytr':
            // paymentProviderInstance = new PayTRPaymentProvider();
            // break;
            case 'demo':
            default:
                paymentProviderInstance = new DemoPaymentProvider();
        }
    }

    return paymentProviderInstance;
}
