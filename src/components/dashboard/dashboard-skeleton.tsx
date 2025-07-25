import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Bacterial Load Card Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
        
        {/* CFU Chart Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-1">
        {/* System Status Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>

        {/* Env Parameters Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
