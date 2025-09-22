"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Clock, CheckCircle, XCircle, Warehouse, Users, TrendingUp } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Inspections",
      value: stats.totalInspections,
      icon: ClipboardCheck,
      description: "All time inspections",
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pendingInspections,
      icon: Clock,
      description: "Awaiting inspection",
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: stats.completedInspections,
      icon: CheckCircle,
      description: "Successfully completed",
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: stats.inProgressInspections,
      icon: XCircle,
      description: "In Progress inspections",
      color: "text-red-600",
    },
    {
      title: "Warehouses",
      value: stats.totalWarehouses,
      icon: Warehouse,
      description: "Active locations",
      color: "text-purple-600",
    },
    {
      title: "Inspectors",
      value: stats.activeInspectors,
      icon: Users,
      description: "Active inspectors",
      color: "text-indigo-600",
    },
    {
      title: "Managers",
      value: stats.activeManagers,
      icon: Users,
      description: "Active Managers",
      color: "text-indigo-600",
    },
    // {
    //   title: "Average Score",
    //   value: `${stats.averageScore}%`,
    //   icon: TrendingUp,
    //   description: "Overall performance",
    //   color: "text-emerald-600",
    // },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
