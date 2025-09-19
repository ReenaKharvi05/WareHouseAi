"use client"

import { useState } from "react"
import { ReportDashboard } from "@/components/reports/report-dashboard"
import { InspectionPerformanceReport } from "@/components/reports/inspection-performance-report"
import { WarehouseUtilizationReport } from "@/components/reports/warehouse-utilization-report"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type ViewMode =
  | "dashboard"
  | "inspection-performance"
  | "warehouse-utilization"
  | "inspector-performance"
  | "risk-assessment"
  | "compliance-summary"
  | "trend-analysis"

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")

  const handleGenerateReport = (reportType: string) => {
    setViewMode(reportType as ViewMode)
  }

  const handleExportReport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting report in ${format} format`)
    // In a real app, this would trigger a download or API call
  }

  const handleBackToDashboard = () => {
    setViewMode("dashboard")
  }

  const getReportTitle = () => {
    switch (viewMode) {
      case "inspection-performance":
        return "Inspection Performance Report"
      case "warehouse-utilization":
        return "Warehouse Utilization Report"
      case "inspector-performance":
        return "Inspector Performance Report"
      case "risk-assessment":
        return "Risk Assessment Report"
      case "compliance-summary":
        return "Compliance Summary Report"
      case "trend-analysis":
        return "Trend Analysis Report"
      default:
        return "Reports"
    }
  }

  const getReportDescription = () => {
    switch (viewMode) {
      case "inspection-performance":
        return "Comprehensive analysis of inspection activities and outcomes"
      case "warehouse-utilization":
        return "Capacity analysis and storage efficiency metrics"
      case "inspector-performance":
        return "Individual inspector statistics and productivity metrics"
      case "risk-assessment":
        return "Risk level analysis and critical findings"
      case "compliance-summary":
        return "Regulatory compliance status and audit trails"
      case "trend-analysis":
        return "Historical trends and predictive insights"
      default:
        return "Generate comprehensive reports and analytics for your warehouse operations"
    }
  }

  const renderReport = () => {
    switch (viewMode) {
      case "inspection-performance":
        return <InspectionPerformanceReport onExport={handleExportReport} onClose={handleBackToDashboard} />
      case "warehouse-utilization":
        return <WarehouseUtilizationReport onExport={handleExportReport} onClose={handleBackToDashboard} />
      case "inspector-performance":
      case "risk-assessment":
      case "compliance-summary":
      case "trend-analysis":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Report Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              This report type is currently under development and will be available in a future update.
            </p>
            <Button onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </div>
        )
      default:
        return <ReportDashboard onGenerateReport={handleGenerateReport} />
    }
  }

  return (
    <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
      <div className="space-y-6">
        {viewMode !== "dashboard" && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{getReportTitle()}</h1>
              <p className="text-muted-foreground">{getReportDescription()}</p>
            </div>
          </div>
        )}

        {viewMode === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">{getReportDescription()}</p>
          </div>
        )}

        {renderReport()}
      </div>
    </ProtectedRoute>
  )
}
