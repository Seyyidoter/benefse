'use client';

import { Settings, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Ayarlar</h1>
                <p className="text-muted-foreground mt-1">Mağaza ve sistem ayarları</p>
            </div>

            {/* Demo Mode Notice */}
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                        <Info className="h-5 w-5" />
                        Demo Modu Aktif
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                        Uygulama şu anda demo modunda çalışmaktadır. Aşağıdaki ayarlar canlı
                        sürümde aktif olacaktır:
                    </p>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1 list-disc list-inside">
                        <li>Ödeme entegrasyonu (iyzico / PayTR)</li>
                        <li>Kullanıcı kimlik doğrulama (NextAuth.js)</li>
                        <li>Veritabanı bağlantısı (PostgreSQL + Prisma)</li>
                        <li>Trendyol API entegrasyonu</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Store Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Mağaza Bilgileri</CardTitle>
                    <CardDescription>Temel mağaza ayarları</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Mağaza Adı</p>
                            <p className="font-medium">ModaShop</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Para Birimi</p>
                            <p className="font-medium">TRY (Türk Lirası)</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Ücretsiz Kargo Limiti</p>
                            <p className="font-medium">500 TL</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Varsayılan Kargo</p>
                            <p className="font-medium">49,99 TL</p>
                        </div>
                    </div>
                    <Button variant="outline" disabled>
                        Ayarları Düzenle (Demo)
                    </Button>
                </CardContent>
            </Card>

            {/* Integrations */}
            <Card>
                <CardHeader>
                    <CardTitle>Entegrasyonlar</CardTitle>
                    <CardDescription>Üçüncü parti servis bağlantıları</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Trendyol */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-lg">T</span>
                            </div>
                            <div>
                                <p className="font-medium">Trendyol API</p>
                                <p className="text-sm text-muted-foreground">
                                    Ürün ve stok senkronizasyonu
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">Bekleniyor</Badge>
                    </div>

                    {/* Payment */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 font-bold text-lg">₺</span>
                            </div>
                            <div>
                                <p className="font-medium">Ödeme Sistemi</p>
                                <p className="text-sm text-muted-foreground">
                                    iyzico / PayTR entegrasyonu
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">Demo</Badge>
                    </div>

                    {/* Auth */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg">🔐</span>
                            </div>
                            <div>
                                <p className="font-medium">Kullanıcı Girişi</p>
                                <p className="text-sm text-muted-foreground">
                                    NextAuth.js / Clerk
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">Bekleniyor</Badge>
                    </div>

                    {/* Database */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-lg">🗄️</span>
                            </div>
                            <div>
                                <p className="font-medium">Veritabanı</p>
                                <p className="text-sm text-muted-foreground">
                                    PostgreSQL + Prisma
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">Mock Data</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
                <CardHeader>
                    <CardTitle>Ortam Değişkenleri</CardTitle>
                    <CardDescription>
                        Canlıya geçiş için gerekli environment variables
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                        <p className="text-muted-foreground"># Database</p>
                        <p>DATABASE_URL=postgresql://...</p>
                        <p className="text-muted-foreground mt-2"># Auth</p>
                        <p>NEXTAUTH_SECRET=your-secret</p>
                        <p>NEXTAUTH_URL=https://yourdomain.com</p>
                        <p className="text-muted-foreground mt-2"># Payment</p>
                        <p>IYZICO_API_KEY=your-key</p>
                        <p>IYZICO_SECRET_KEY=your-secret</p>
                        <p className="text-muted-foreground mt-2"># Trendyol</p>
                        <p>TRENDYOL_SUPPLIER_ID=your-id</p>
                        <p>TRENDYOL_API_KEY=your-key</p>
                        <p>TRENDYOL_API_SECRET=your-secret</p>
                        <p className="text-muted-foreground mt-2"># Admin</p>
                        <p>ADMIN_DEMO_PASSWORD=demo123</p>
                    </div>
                </CardContent>
            </Card>

            {/* Resources */}
            <Card>
                <CardHeader>
                    <CardTitle>Faydalı Kaynaklar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <a
                        href="https://developers.trendyol.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                        <span>Trendyol Developer Portal</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                    <a
                        href="https://dev.iyzipay.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                        <span>iyzico Developer Docs</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                    <a
                        href="https://vercel.com/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                        <span>Vercel Documentation</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
