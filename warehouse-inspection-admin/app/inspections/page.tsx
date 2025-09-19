"use client"

import { useState } from "react"
import { InspectionTable } from "@/components/inspections/inspection-table"
import { InspectionForm } from "@/components/inspections/inspection-form"
import { InspectionChecklist } from "@/components/inspections/inspection-checklist"
import { InspectionDetails } from "@/components/inspections/inspection-details"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Inspection, CreateInspectionForm } from "@/lib/types"

type ViewMode = "list" | "create" | "edit" | "details" | "conduct"

export default function InspectionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateInspection = () => {
    setSelectedInspection(null)
    setViewMode("create")
  }

  const handleEditInspection = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setViewMode("edit")
  }

  const handleViewInspection = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setViewMode("details")
  }

  const handleConductInspection = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setViewMode("conduct")
  }

  const handleFormSubmit = async (data: CreateInspectionForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (viewMode === "create") {
        console.log("Creating inspection:", data)
      } else {
        console.log("Updating inspection:", selectedInspection?.id, data)
      }

      setViewMode("list")
      setSelectedInspection(null)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleInspectionComplete = async (responses: any[], overallScore: number) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Completing inspection:", selectedInspection?.id, { responses, overallScore })
      setViewMode("list")
      setSelectedInspection(null)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormCancel = () => {
    setViewMode("list")
    setSelectedInspection(null)
  }

  const getPageTitle = () => {
    switch (viewMode) {
      case "create":
        return "Schedule Inspection"
      case "edit":
        return "Edit Inspection"
      case "details":
        return "Inspection Details"
      case "conduct":
        return "Conduct Inspection"
      default:
        return "Inspections"
    }
  }

  const getPageDescription = () => {
    switch (viewMode) {
      case "create":
        return "Schedule a new warehouse inspection"
      case "edit":
        return `Update inspection details for ${selectedInspection?.notes || "inspection"}`
      case "details":
        return "View detailed inspection information and results"
      case "conduct":
        return "Complete the inspection checklist and record findings"
      default:
        return "Manage warehouse inspections and track their progress"
    }
  }

  return (
    <ProtectedRoute requiredRoles={["Admin", "Inspector", "Manager"]}>
      <div className="space-y-6">
        {viewMode === "list" ? (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
              <p className="text-muted-foreground">{getPageDescription()}</p>
            </div>
            <InspectionTable
              onCreateInspection={handleCreateInspection}
              onEditInspection={handleEditInspection}
              onViewInspection={handleViewInspection}
              onConductInspection={handleConductInspection}
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleFormCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
                <p className="text-muted-foreground">{getPageDescription()}</p>
              </div>
            </div>

            {viewMode === "create" || viewMode === "edit" ? (
              <InspectionForm
                inspection={selectedInspection}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isLoading}
              />
            ) : viewMode === "details" && selectedInspection ? (
              <InspectionDetails
                inspection={selectedInspection}
                onEdit={() => setViewMode("edit")}
                onClose={handleFormCancel}
              />
            ) : viewMode === "conduct" && selectedInspection ? (
              <InspectionChecklist
                inspection={selectedInspection}
                onComplete={handleInspectionComplete}
                onCancel={handleFormCancel}
              />
            ) : null}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
