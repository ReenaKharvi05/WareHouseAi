import { cn } from "@/lib/utils"
import { Shimmer, ShimmerCard } from "./shimmer"

interface ModernCardProps {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function ModernCard({ children, className, isLoading = false, onClick }: ModernCardProps) {
  if (isLoading) {
    return <ShimmerCard className={className} />
  }

  return (
    <div
      className={cn("rounded-xl shadow p-6 bg-white space-y-4", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

interface ModernCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ModernCardHeader({ children, className }: ModernCardHeaderProps) {
  return (
    <div className={cn("border-b border-gray-200 pb-4", className)}>
      {children}
    </div>
  )
}

interface ModernCardTitleProps {
  children: React.ReactNode
  className?: string
}

export function ModernCardTitle({ children, className }: ModernCardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  )
}

interface ModernCardContentProps {
  children: React.ReactNode
  className?: string
}

export function ModernCardContent({ children, className }: ModernCardContentProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}
