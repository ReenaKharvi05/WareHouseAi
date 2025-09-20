"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Users, Warehouse, ClipboardCheck, BarChart3, Settings, Menu, Package, CheckCircle2, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin",  "Manager"],
  },
  {
    name: "Inspections",
    href: "/inspector/dashboard",
    icon: ClipboardCheck,
    roles: ["Inspector"],
  },
  {
    name: "My Inspections",
    href: "/inspector/inspections",
    icon: ClipboardCheck,
    roles: ["Inspector"],
  },
  {
    name: "Pending Inspections",
    href: "/manager/inspections",
    icon: Clock,
    roles: ["Manager"],
  },
  {
    name: "Reviewed Inspections",
    href: "/manager/reviewed",
    icon: CheckCircle2,
    roles: ["Manager"],
  },
  {
    name: "Inspectors",
    href: "/manager/inspectors",
    icon: Users,
    roles: ["Manager"],
  },
  {
    name: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
    roles: ["Admin", "Manager"],
  },
  {
    name: "Commodities",
    href: "/commodities",
    icon: Package,
    roles: ["Admin", "Manager"],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    roles: ["Admin"],
  },
  // {
  //   name: "Reports",
  //   href: "/reports",
  //   icon: BarChart3,
  //   roles: ["Admin", "Manager"],
  // },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  //   roles: ["Admin"],
  // },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavigation = navigation.filter((item) => {
    if (!user) return false
    return item.roles.includes(user.role)
  })

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6">
            <ClipboardCheck className="h-8 w-8 text-primary mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Warehouse</h2>
              <p className="text-sm text-muted-foreground">Inspection Panel</p>
            </div>
          </div>
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <ScrollArea className="h-full">
          <Sidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
