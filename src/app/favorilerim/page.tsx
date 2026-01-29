import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/auth';
import { getUserFavorites } from '@/lib/favorite-actions';
import { RemoveFavoriteButton } from '@/components/favorites/remove-favorite-button';
import { AddToCartButton } from '@/components/favorites/add-to-cart-button';

export const metadata = {
    title: 'Favorilerim | Benefse',
    description: 'Beğendiğiniz ürünleri buradan görüntüleyebilirsiniz.',
};

export default async function FavoritesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/giris?callbackUrl=/favorilerim');
    }

    const favorites = await getUserFavorites();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/hesabim">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
                        Favorilerim
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {favorites.length} ürün
                    </p>
                </div>
            </div>

            {favorites.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-pink-100 dark:bg-pink-900/30">
                            <Heart className="h-12 w-12 text-pink-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Henüz favoriniz yok</h2>
                        <p className="text-muted-foreground max-w-md">
                            Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.
                        </p>
                        <Link href="/urunler">
                            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                                Ürünleri Keşfet
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((favorite) => (
                        <Card key={favorite.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                                {favorite.imageUrl ? (
                                    <Image
                                        src={favorite.imageUrl}
                                        alt={favorite.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        Görsel yok
                                    </div>
                                )}
                                <RemoveFavoriteButton productId={favorite.productId} />
                            </div>
                            <CardContent className="p-4">
                                <Link href={`/urun/${favorite.productId}`}>
                                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors mb-2">
                                        {favorite.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary">
                                        ₺{favorite.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                    <AddToCartButton
                                        productId={favorite.productId}
                                        title={favorite.title}
                                        price={favorite.price}
                                        imageUrl={favorite.imageUrl || undefined}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
