'use client';

import { User, Package, Heart, MapPin, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '@/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function AccountPage() {
    const { drafts } = useOrderStore();
    const hydrated = useHydrated();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Hesabım</h1>

            {/* Demo Notice */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                    <LogIn className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-orange-800 dark:text-orange-200">
                            Demo Modu - Giriş Yapılmadı
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                            Kullanıcı girişi şu anda demo modunda devre dışıdır. Canlıya geçişte
                            NextAuth.js veya Clerk ile kimlik doğrulama eklenecektir.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Menu Cards */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                            <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Profil Bilgileri</h3>
                            <p className="text-sm text-muted-foreground">
                                Kişisel bilgilerinizi düzenleyin
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                            <MapPin className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Adreslerim</h3>
                            <p className="text-sm text-muted-foreground">
                                Kayıtlı adreslerinizi yönetin
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                            <Heart className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Favorilerim</h3>
                            <p className="text-sm text-muted-foreground">
                                Beğendiğiniz ürünler
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                            <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Ayarlar</h3>
                            <p className="text-sm text-muted-foreground">
                                Hesap ayarlarınız
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Drafts */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <Package className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Sipariş Taslakları</h2>
                    <Badge variant="secondary">{hydrated ? drafts.length : 0}</Badge>
                </div>

                {drafts.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                Henüz sipariş taslağınız bulunmuyor.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {drafts.map((draft) => (
                            <Card key={draft.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium">
                                            {draft.id}
                                        </CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                        >
                                            Taslak
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Müşteri</p>
                                            <p className="font-medium">{draft.customerInfo.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Ürün Sayısı</p>
                                            <p className="font-medium">{draft.items.length} ürün</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Toplam</p>
                                            <p className="font-medium text-purple-600">
                                                {draft.totals.total.toLocaleString('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Oluşturulma: {new Date(draft.createdAt).toLocaleString('tr-TR')}
                                        </p>
                                        <Button variant="outline" size="sm" disabled>
                                            Detaylar (Demo)
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Auth Placeholder */}
            <div className="mt-12">
                <Card className="bg-muted/50">
                    <CardContent className="p-6 text-center">
                        <h3 className="font-semibold mb-2">Giriş Yap / Kayıt Ol</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Demo modunda kullanıcı girişi devre dışıdır. Canlı sürümde
                            bu özellik aktif olacaktır.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button disabled>Giriş Yap</Button>
                            <Button variant="outline" disabled>
                                Kayıt Ol
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
