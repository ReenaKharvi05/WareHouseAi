"use client"

import { MobileSidebar } from "./sidebar"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <MobileSidebar />
        <div className="flex-1">
          <h1 className="text-lg font-semibold md:text-xl">Welcome back, {user?.fullName}</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  )
}
