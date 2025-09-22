"use client"

import { useQuery } from "@tanstack/react-query"
import { listInspections } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from "@/components/ui/modern-card"
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/ui/modern-table"
import { ModernButton } from "@/components/ui/modern-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ShimmerTableComponent } from "@/components/ui/modern-table"
import { Eye } from "lucide-react"

export default function ReviewedInspectionsPage() {
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ["reviewed-inspections"],
    queryFn: () => listInspections({ status: "Accepted,Rejected" }),
  })

  const rows = data || []

  const handleViewDetails = (inspectionId: number) => {
    router.push(`/manager/inspections/${inspectionId}`)
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reviewed Inspections</h1>
        <p className="text-gray-600 mt-2">View all accepted and rejected inspections</p>
      </div>

      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle>Accepted / Rejected Inspections</ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          {isLoading ? (
            <ShimmerTableComponent rows={5} columns={6} />
          ) : (
            <ModernTable>
              <ModernTableHeader>
                <ModernTableRow isHeader>
                  <ModernTableCell>Warehouse Name</ModernTableCell>
                  <ModernTableCell>Commodity Name</ModernTableCell>
                  <ModernTableCell>Inspector Full Name</ModernTableCell>
                  <ModernTableCell>Status</ModernTableCell>
                  <ModernTableCell>Manager Remarks</ModernTableCell>
                  <ModernTableCell>Actions</ModernTableCell>
                </ModernTableRow>
              </ModernTableHeader>
              <ModernTableBody>
                {rows.map((i) => (
                  <ModernTableRow key={i.Id_Inspections}>
                    <ModernTableCell className="font-medium">{i.warehouse?.name ?? "—"}</ModernTableCell>
                    <ModernTableCell>{i.commodity?.name ?? "—"}</ModernTableCell>
                    <ModernTableCell>{i.inspector?.full_name || i.inspector?.username || "—"}</ModernTableCell>
                    <ModernTableCell>
                      <StatusBadge status={i.Status as "Accepted" | "Rejected"} />
                    </ModernTableCell>
                    <ModernTableCell className="max-w-xs truncate">{i.Manager_Remarks || "—"}</ModernTableCell>
                    <ModernTableCell>
                      <ModernButton 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDetails(i.Id_Inspections)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </ModernButton>
                    </ModernTableCell>
                  </ModernTableRow>
                ))}
              </ModernTableBody>
            </ModernTable>
          )}
          {!isLoading && rows.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No reviewed inspections found.</p>
            </div>
          )}
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}


