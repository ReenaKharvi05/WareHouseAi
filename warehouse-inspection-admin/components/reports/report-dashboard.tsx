"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileText, TrendingUp, Users, Warehouse, ClipboardCheck, Download, Calendar } from "lucide-react"

interface ReportType {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "performance" | "operational" | "compliance"
  lastGenerated?: string
}

interface ReportDashboardProps {
  onGenerateReport: (reportType: string) => void
}

export function ReportDashboard({ onGenerateReport }: ReportDashboardProps) {
  const reportTypes: ReportType[] = [
    {
      id: "inspection-performance",
      title: "Inspection Performance",
      description: "Overall inspection statistics, completion rates, and score trends",
      icon: BarChart3,
      category: "performance",
      lastGenerated: "2024-01-15",
    },
    {
      id: "warehouse-utilization",
      title: "Warehouse Utilization",
      description: "Capacity utilization, stock levels, and warehouse efficiency metrics",
      icon: Warehouse,
      category: "operational",
      lastGenerated: "2024-01-14",
    },
    {
      id: "inspector-performance",
      title: "Inspector Performance",
      description: "Individual inspector statistics, productivity, and quality metrics",
      icon: Users,
      category: "performance",
      lastGenerated: "2024-01-13",
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Risk level analysis, critical findings, and compliance issues",
      icon: ClipboardCheck,
      category: "compliance",
      lastGenerated: "2024-01-12",
    },
    {
      id: "compliance-summary",
      title: "Compliance Summary",
      description: "Regulatory compliance status, audit trails, and certification reports",
      icon: FileText,
      category: "compliance",
    },
    {
      id: "trend-analysis",
      title: "Trend Analysis",
      description: "Historical trends, seasonal patterns, and predictive insights",
      icon: TrendingUp,
      category: "performance",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-100 text-blue-800"
      case "operational":
        return "bg-green-100 text-green-800"
      case "compliance":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      case "operational":
        return <Warehouse className="h-4 w-4" />
      case "compliance":
        return <ClipboardCheck className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Report Center</h2>
        <p className="text-muted-foreground">Generate comprehensive reports and analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.id} className="relative hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <Badge className={getCategoryColor(report.category)} variant="secondary">
                      {getCategoryIcon(report.category)}
                      {report.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{report.description}</CardDescription>

              {report.lastGenerated && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                </div>
              )}

              <Button onClick={() => onGenerateReport(report.id)} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Recent reporting activity and system overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-muted-foreground">Reports Generated</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87.5%</div>
              <div className="text-sm text-muted-foreground">Avg. Score</div>
              <div className="text-xs text-muted-foreground">Last 30 days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">6</div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
              <div className="text-xs text-muted-foreground">Requiring attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-muted-foreground">Active Warehouses</div>
              <div className="text-xs text-muted-foreground">Under inspection</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
