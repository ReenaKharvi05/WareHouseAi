"use client"

import type React from "react"
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar"   // ✅ reuse sidebar component
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function InspectorLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar (desktop + mobile) */}
      <div className="hidden md:flex">
        <Sidebar className="w-64 border-r" />
      </div>
      <div className="md:hidden">
        <MobileSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <h1 className="text-lg font-semibold">Welcome back, {user?.username}</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
