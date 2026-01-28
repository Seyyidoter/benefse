import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb Skeleton */}
            <div className="flex gap-2 mb-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
            </div>

            {/* Header Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-5 w-96 mb-2" />
                <Skeleton className="h-4 w-24" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
