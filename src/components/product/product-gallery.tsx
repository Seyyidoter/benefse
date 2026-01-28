'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultipleImages = images.length > 1;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (images.length === 0) {
        return (
            <div className="relative aspect-square bg-muted rounded-2xl flex items-center justify-center">
                <span className="text-muted-foreground">Görsel yok</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                <Image
                    src={images[currentIndex] || '/placeholder.jpg'}
                    alt={`${title} - Görsel ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Zoom Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                        >
                            <ZoomIn className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        <div className="relative aspect-square">
                            <Image
                                src={images[currentIndex] || '/placeholder.jpg'}
                                alt={`${title} - Görsel ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="80vw"
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200',
                                currentIndex === index
                                    ? 'ring-2 ring-primary ring-offset-2'
                                    : 'opacity-70 hover:opacity-100'
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${title} - Küçük görsel ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
