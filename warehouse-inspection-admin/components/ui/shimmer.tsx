import { cn } from "@/lib/utils"

interface ShimmerProps {
  className?: string
  children?: React.ReactNode
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {children}
    </div>
  )
}

export function ShimmerCard({ className }: { className?: string }) {
  return (
    <Shimmer className={cn("rounded-xl bg-gray-200 h-32 w-full", className)} />
  )
}

export function ShimmerTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Shimmer key={i} className="h-6 bg-gray-300 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Shimmer key={colIndex} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ShimmerStatsCard() {
  return (
    <div className="rounded-xl shadow-lg p-6 bg-white">
      <Shimmer className="h-4 w-20 bg-gray-200 rounded mb-2" />
      <Shimmer className="h-8 w-16 bg-gray-200 rounded mb-2" />
      <Shimmer className="h-3 w-24 bg-gray-200 rounded" />
    </div>
  )
}

export function ShimmerInspectionDetail() {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-xl shadow p-6 bg-white">
        <Shimmer className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3 w-16 bg-gray-200 rounded" />
              <Shimmer className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Answers Card */}
      <div className="rounded-xl shadow p-6 bg-white">
        <Shimmer className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Shimmer className="h-4 w-full bg-gray-200 rounded mb-2" />
              <Shimmer className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
              <Shimmer className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Card */}
      <div className="rounded-xl shadow p-6 bg-white">
        <Shimmer className="h-6 w-20 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="aspect-square bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ShimmerSidebar() {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="flex items-center mb-6">
          <Shimmer className="h-8 w-8 bg-gray-300 rounded" />
          <div className="ml-3 space-y-2">
            <Shimmer className="h-4 w-20 bg-gray-300 rounded" />
            <Shimmer className="h-3 w-24 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-10 w-full bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
