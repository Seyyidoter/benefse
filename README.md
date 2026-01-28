# ModaShop - Trendyol Mağaza E-Ticaret MVP

Modern ve şık bir e-ticaret web sitesi demo'su. Trendyol'da satış yapan mağazalar için hazırlanmış, Vercel'de kolayca deploy edilebilen bir MVP.

![ModaShop](https://via.placeholder.com/1200x630/7c3aed/ffffff?text=ModaShop+E-Commerce+MVP)

## 🚀 Özellikler

### Mevcut (Demo Modu)
- ✅ Modern ve responsive tasarım (TailwindCSS + shadcn/ui)
- ✅ Ürün listeleme ve filtreleme
- ✅ Ürün detay sayfası (galeri, varyant seçimi)
- ✅ Sepet yönetimi (Zustand + localStorage)
- ✅ Kupon kodu desteği
- ✅ Checkout akışı (adres, kargo, demo ödeme)
- ✅ Sipariş taslak sistemi
- ✅ Admin paneli (ürün CRUD, sipariş görüntüleme)
- ✅ Demo parola koruması
- ✅ Dark mode desteği

### Planlanan (Canlı Sürüm)
- ⏳ Veritabanı entegrasyonu (PostgreSQL + Prisma)
- ⏳ Kullanıcı kimlik doğrulama (NextAuth.js/Clerk)
- ⏳ Ödeme entegrasyonu (iyzico/PayTR)
- ⏳ Trendyol API entegrasyonu
- ⏳ E-posta bildirimleri

## 📦 Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Stil:** TailwindCSS + shadcn/ui
- **State Management:** Zustand
- **Form:** react-hook-form + zod
- **İkonlar:** Lucide React
- **Bildirimler:** Sonner

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- npm veya pnpm

### Adımlar

1. **Repoyu klonlayın:**
```bash
git clone https://github.com/your-username/modashop.git
cd modashop
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables oluşturun:**
```bash
cp .env.example .env.local
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcıda açın:** http://localhost:3000

## 📁 Proje Yapısı

```
src/
├── adapters/           # Veri katmanı soyutlaması
│   ├── catalog-adapter.ts      # Ürün/kategori adapter interface
│   ├── manual-catalog-adapter.ts   # Mock data adapter
│   └── payment-provider.ts     # Ödeme provider interface
├── app/                # Next.js App Router sayfaları
│   ├── admin/          # Admin paneli
│   ├── kategori/       # Kategori sayfaları
│   ├── urun/           # Ürün detay
│   ├── urunler/        # Ürün listeleme
│   ├── sepet/          # Sepet
│   ├── checkout/       # Ödeme adımları
│   └── hesabim/        # Hesap sayfası
├── components/         # React bileşenleri
│   ├── layout/         # Header, Footer
│   ├── product/        # Ürün kartları, galeri
│   └── ui/             # shadcn/ui bileşenleri
├── data/               # Mock veriler
├── store/              # Zustand stores
└── types/              # TypeScript tipleri
```

## 🔐 Admin Paneli

Demo admin paneline erişim:
- **URL:** `/admin`
- **Şifre:** `demo123`

### Admin Özellikleri:
- Dashboard (istatistikler, stok uyarıları)
- Ürün yönetimi (ekleme, düzenleme, silme)
- Sipariş taslakları görüntüleme
- Ayarlar ve entegrasyon durumu

## 🎨 Demo Kupon Kodları

- **DEMO20:** %20 indirim
- **HOSGELDIN10:** %10 indirim
- **ILKSIPARIS:** 50 TL indirim (min. 200 TL)
- **KARGO:** Ücretsiz kargo

## ⚙️ Environment Variables

```env
# Database (Canlı için)
DATABASE_URL=postgresql://...

# Auth (Canlı için)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://yourdomain.com

# Payment (Canlı için)
IYZICO_API_KEY=your-key
IYZICO_SECRET_KEY=your-secret
IYZICO_BASE_URL=https://api.iyzipay.com

# Trendyol (Canlı için)
TRENDYOL_SUPPLIER_ID=your-supplier-id
TRENDYOL_API_KEY=your-api-key
TRENDYOL_API_SECRET=your-api-secret

# Admin
ADMIN_DEMO_PASSWORD=demo123
```

## 🚀 Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/modashop)

1. Vercel hesabınızla giriş yapın
2. GitHub reposunu seçin
3. Environment variables ekleyin (opsiyonel)
4. Deploy'a tıklayın!

## 📋 Canlıya Geçiş Checklist

### 1. Veritabanı Kurulumu
- [ ] PostgreSQL veritabanı oluştur (Neon, Supabase, vb.)
- [ ] Prisma şemasını oluştur
- [ ] Migrasyon çalıştır
- [ ] Mock adapter'ı Prisma adapter ile değiştir

### 2. Kimlik Doğrulama
- [ ] NextAuth.js veya Clerk kur
- [ ] Provider'ları yapılandır
- [ ] Korumalı route'ları ekle

### 3. Ödeme Entegrasyonu
- [ ] iyzico/PayTR hesabı oluştur
- [ ] Test ortamında API'yi entegre et
- [ ] DemoPaymentProvider'ı gerçek provider ile değiştir
- [ ] Webhook endpoint'leri ekle

### 4. Trendyol Entegrasyonu
- [ ] Trendyol seller API erişimi al
- [ ] TrendyolApiAdapter'ı tamamla
- [ ] Ürün senkronizasyonu kur
- [ ] Stok güncelleme webhook'ları ekle

### 5. Son Kontroller
- [ ] Error boundary'ler ekle
- [ ] Loading state'leri optimize et
- [ ] SEO meta tag'lerini kontrol et
- [ ] Performance audit yap
- [ ] Mobile test

## 🔗 Faydalı Linkler

- [Trendyol Developer Portal](https://developers.trendyol.com/)
- [iyzico Entegrasyon Dokümanı](https://dev.iyzipay.com/)
- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [shadcn/ui Bileşenler](https://ui.shadcn.com/)

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👤 İletişim

Sorularınız için issue açabilirsiniz veya doğrudan iletişime geçebilirsiniz.

---

**ModaShop** - Modern E-Commerce MVP 🛍️
