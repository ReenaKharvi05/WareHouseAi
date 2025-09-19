"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { InspectionChart } from "@/components/dashboard/inspection-chart"
import { fetchDashboardStats } from "@/lib/api"
import type { DashboardStats } from "@/lib/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  if (!stats) {
    return <p className="p-6 text-red-500">Failed to load dashboard data.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of warehouse inspection activities</p>
      </div>

      {/* ✅ Now using API values, not mock */}
      <StatsCards stats={stats} />

      
    </div>
  )
}
