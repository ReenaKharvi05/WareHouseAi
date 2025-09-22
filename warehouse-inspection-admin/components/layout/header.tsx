"use client"

import { MobileSidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Shimmer } from "@/components/ui/shimmer"

export function Header() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-gray-100 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <MobileSidebar />
        <div className="flex-1">
          {isLoading ? (
            <Shimmer className="h-6 w-48 bg-gray-200 rounded" />
          ) : (
            <h1 className="text-lg font-semibold md:text-xl text-gray-800">
              Welcome back, {user?.fullName}
            </h1>
          )}
        </div>
        <Button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
