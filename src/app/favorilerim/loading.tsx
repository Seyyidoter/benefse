import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 min-w-0 space-y-6">
                    <Skeleton className="h-8 w-40 mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-48 w-full rounded-xl" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
