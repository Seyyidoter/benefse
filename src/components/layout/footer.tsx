import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { categories } from '@/data/categories';

export function Footer() {
    return (
        <footer className="bg-[#2a2a2a] text-[#f5f0e8]">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="Benefse"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-[#a0a0a0] mb-4">
                            Evinize şıklık ve fonksiyonellik katan ev dekorasyon ürünleri.
                            Mutfak rafları, runner masa örtüleri, lambalar ve daha fazlası.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#3a3a3a] hover:bg-[#e91e8c] transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#3a3a3a] hover:bg-[#e91e8c] transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Kategoriler</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={`/kategori/${category.slug}`}
                                        className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Müşteri Hizmetleri</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/hakkimizda"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/iletisim"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sikca-sorulan-sorular"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    S.S.S.
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kargo-ve-iade"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    Kargo ve İade
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/gizlilik-politikasi"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    Gizlilik Politikası
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">İletişim</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-[#e91e8c] flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-[#a0a0a0]">
                                    Trendyol Mağazası
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-[#e91e8c] flex-shrink-0" />
                                <a
                                    href="tel:+905551234567"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    0555 123 45 67
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-[#e91e8c] flex-shrink-0" />
                                <a
                                    href="mailto:info@benefse.com"
                                    className="text-sm text-[#a0a0a0] hover:text-[#e91e8c] transition-colors"
                                >
                                    info@benefse.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-[#e91e8c] flex-shrink-0" />
                                <span className="text-sm text-[#a0a0a0]">
                                    Pzt-Cmt: 09:00 - 18:00
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Trendyol Badge */}
            <div className="border-t border-[#3a3a3a]">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#f27a1a] text-white px-3 py-1 rounded text-sm font-medium">
                                Trendyol Satıcısı
                            </div>
                            <span className="text-sm text-[#a0a0a0]">
                                Resmi Trendyol Mağazası
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[#a0a0a0]">Güvenli Ödeme:</span>
                            <div className="flex gap-2">
                                <div className="bg-[#3a3a3a] px-2 py-1 rounded text-xs">VISA</div>
                                <div className="bg-[#3a3a3a] px-2 py-1 rounded text-xs">MC</div>
                                <div className="bg-[#3a3a3a] px-2 py-1 rounded text-xs">TROY</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#3a3a3a]">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[#6b6b6b]">
                            © 2024 Benefse. Tüm hakları saklıdır.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-[#6b6b6b]">
                            <span className="text-[#e91e8c]">♥</span> ile yapıldı
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
