import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModernButtonProps {
  children: React.ReactNode
  variant?: "primary" | "approve" | "reject" | "cancel" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function ModernButton({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  onClick,
  disabled = false,
  type = "button"
}: ModernButtonProps) {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "approve":
        return "bg-green-600 hover:bg-green-700 text-white"
      case "reject":
        return "bg-red-600 hover:bg-red-700 text-white"
      case "cancel":
        return "bg-gray-300 hover:bg-gray-400 text-gray-800"
      case "outline":
        return "border border-gray-300 hover:bg-gray-50 text-gray-700"
      default: // primary
        return "bg-blue-600 hover:bg-blue-700 text-white"
    }
  }

  const getSizeStyles = (size: string) => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm"
      case "lg":
        return "px-6 py-3 text-lg"
      default: // md
        return "px-4 py-2 text-base"
    }
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        getVariantStyles(variant),
        getSizeStyles(size),
        className
      )}
    >
      {children}
    </Button>
  )
}
