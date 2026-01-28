import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, RefreshCw, Shield, Headphones, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product';
import { categories } from '@/data/categories';
import { fetchTrendyolProducts, convertTrendyolProduct } from '@/lib/trendyol-api';
import { products as mockProducts } from '@/data/products';

export default async function HomePage() {
  let products = [];

  try {
    const trendyolData = await fetchTrendyolProducts(0, 50); // Fetch more to ensure we have enough in-stock items
    products = trendyolData.content.map(convertTrendyolProduct).filter(p => p.stock > 0);
  } catch (error) {
    console.error('Homepage fetch error, using mock data:', error);
    products = mockProducts.filter(p => p.stock > 0);
  }

  const featuredProducts = products.slice(0, 4);
  const newProducts = products.slice(-4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#2a2a2a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e91e8c]/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-[#e91e8c] hover:bg-[#e91e8c]/80">
              Trendyol Satıcısı
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Evinize <span className="text-[#e91e8c]">Şıklık</span> Katın
            </h1>
            <p className="text-lg md:text-xl text-[#a0a0a0] mb-8 max-w-xl">
              Mutfak rafları, el yapımı runner masa örtüleri, dekoratif lambalar
              ve ev aksesuarları ile yaşam alanlarınızı güzelleştirin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/urunler">
                <Button size="lg" className="bg-[#e91e8c] hover:bg-[#d11a7d] text-white gap-2">
                  Ürünleri Keşfet
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kategori/runner-masa-ortusu">
                <Button size="lg" variant="secondary" className="hover:bg-gray-100">
                  Yeni Koleksiyon
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=1000&fit=crop"
              alt="Ev Dekorasyon"
              fill
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a] to-transparent" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-[#f5f0e8] dark:bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: '500₺ Üzeri', subtitle: 'Ücretsiz Kargo' },
              { icon: RefreshCw, title: '14 Gün İçinde', subtitle: 'Kolay İade' },
              { icon: Shield, title: 'Güvenli', subtitle: 'Ödeme' },
              { icon: Headphones, title: '7/24', subtitle: 'Destek' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-white dark:bg-[#2a2a2a]">
                  <feature.icon className="h-5 w-5 text-[#e91e8c]" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold">Kategoriler</h2>
              <p className="text-muted-foreground mt-1">
                İhtiyacınıza uygun ürünleri keşfedin
              </p>
            </div>
            <Link href="/urunler">
              <Button variant="ghost" className="gap-2 text-[#e91e8c]">
                Tümünü Gör <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/kategori/${category.slug}`}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image || '/placeholder.jpg'}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-medium text-white text-sm md:text-base">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#f5f0e8] dark:bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2 bg-[#e91e8c]">İndirimli</Badge>
              <h2 className="text-3xl font-serif font-bold">Öne Çıkan Ürünler</h2>
            </div>
            <Link href="/urunler?sale=true">
              <Button variant="ghost" className="gap-2 text-[#e91e8c]">
                Tümünü Gör <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a]">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=400&fit=crop"
                alt="Runner Koleksiyonu"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a] to-transparent" />
            </div>

            <div className="relative z-10 p-8 md:p-12 max-w-xl">
              <Badge className="mb-4 bg-[#c9a962] text-[#2a2a2a]">
                El Yapımı
              </Badge>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Runner & Masa Örtüsü Koleksiyonu
              </h3>
              <p className="text-[#a0a0a0] mb-6">
                Duck keten kumaş, örme dantel detayları ve el yapımı püsküller ile
                sofranıza zarafet katın.
              </p>
              <Link href="/kategori/runner-masa-ortusu">
                <Button className="bg-[#e91e8c] hover:bg-[#d11a7d] gap-2">
                  Koleksiyonu Keşfet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2 bg-[#c9a962] text-[#2a2a2a]">Yeni</Badge>
              <h2 className="text-3xl font-serif font-bold">Yeni Gelenler</h2>
            </div>
            <Link href="/urunler?sort=newest">
              <Button variant="ghost" className="gap-2 text-[#e91e8c]">
                Tümünü Gör <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trendyol Store Info */}
      <section className="py-16 bg-[#2a2a2a] text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Benefse"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">Benefse</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-[#c9a962]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#a0a0a0]">9.2 Satıcı Puanı</span>
                  </div>
                </div>
              </div>
              <p className="text-[#a0a0a0] mb-6">
                Trendyol&apos;da resmi satıcı olarak, ev dekorasyon ürünlerinde güvenilir
                alışveriş deneyimi sunuyoruz. Binlerce mutlu müşteri ve yüksek satıcı
                puanımız ile hizmetinizdeyiz.
              </p>
              <a
                href="https://www.trendyol.com/magaza/benefse-m-830401"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#f27a1a] hover:bg-[#e06a0a] gap-2">
                  Trendyol Mağazamız
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-6 rounded-xl bg-[#3a3a3a]">
                <div className="text-3xl font-bold text-[#e91e8c]">48+</div>
                <div className="text-sm text-[#a0a0a0] mt-1">Ürün</div>
              </div>
              <div className="p-6 rounded-xl bg-[#3a3a3a]">
                <div className="text-3xl font-bold text-[#e91e8c]">16.8K</div>
                <div className="text-sm text-[#a0a0a0] mt-1">Takipçi</div>
              </div>
              <div className="p-6 rounded-xl bg-[#3a3a3a]">
                <div className="text-3xl font-bold text-[#e91e8c]">9.2</div>
                <div className="text-sm text-[#a0a0a0] mt-1">Puan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Yeniliklerden Haberdar Olun
            </h2>
            <p className="text-muted-foreground mb-6">
              Yeni ürünler, indirimler ve özel fırsatlardan ilk siz haberdar olun.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-[#e91e8c]"
              />
              <Button className="bg-[#e91e8c] hover:bg-[#d11a7d] px-8">
                Abone Ol
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
