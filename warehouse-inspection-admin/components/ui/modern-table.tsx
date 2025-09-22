import { cn } from "@/lib/utils"
import { Shimmer, ShimmerTable } from "./shimmer"

interface ModernTableProps {
  children: React.ReactNode
  className?: string
}

export function ModernTable({ children, className }: ModernTableProps) {
  return (
    <div className={cn("rounded-lg shadow-md overflow-hidden", className)}>
      {children}
    </div>
  )
}

interface ModernTableHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ModernTableHeader({ children, className }: ModernTableHeaderProps) {
  return (
    <div className={cn("bg-blue-600 text-white uppercase text-sm font-medium", className)}>
      {children}
    </div>
  )
}

interface ModernTableBodyProps {
  children: React.ReactNode
  className?: string
}

export function ModernTableBody({ children, className }: ModernTableBodyProps) {
  return (
    <div className={cn("divide-y divide-gray-200", className)}>
      {children}
    </div>
  )
}

interface ModernTableRowProps {
  children: React.ReactNode
  className?: string
  isHeader?: boolean
}

export function ModernTableRow({ children, className, isHeader = false }: ModernTableRowProps) {
  return (
    <div 
      className={cn(
        "grid gap-4 px-6 py-4 items-center hover:bg-gray-100 transition-colors",
        isHeader ? "bg-blue-600 text-white" : "odd:bg-gray-50 even:bg-white",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ModernTableCellProps {
  children: React.ReactNode
  className?: string
}

export function ModernTableCell({ children, className }: ModernTableCellProps) {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  )
}

interface ShimmerTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function ShimmerTableComponent({ rows = 5, columns = 4, className }: ShimmerTableProps) {
  return (
    <div className={cn("rounded-lg shadow-md bg-white p-6", className)}>
      <ShimmerTable rows={rows} columns={columns} />
    </div>
  )
}
