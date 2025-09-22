"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { listInspections } from "@/lib/api"
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from "@/components/ui/modern-card"
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell, ShimmerTableComponent } from "@/components/ui/modern-table"
import { ModernButton } from "@/components/ui/modern-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { FileText, Eye, Calendar, MessageSquare } from "lucide-react"

export default function InspectorInspectionsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["inspections", user?.id],
    queryFn: async () => {
      if (!user?.id) return [] as any[]
      return await listInspections({ inspector_id: user.id })
    },
    enabled: !!user?.id,
  })

  const rows = data ?? []

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Inspections</h1>
        <p className="text-gray-600 mt-2">View all your submitted inspections</p>
      </div>

      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Inspection History
          </ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          {isLoading ? (
            <ShimmerTableComponent rows={5} columns={6} />
          ) : (
            <ModernTable>
              <ModernTableHeader>
                <ModernTableRow isHeader>
                  <ModernTableCell>Warehouse</ModernTableCell>
                  <ModernTableCell>Commodity</ModernTableCell>
                  <ModernTableCell>Status</ModernTableCell>
                  <ModernTableCell>Manager Remarks</ModernTableCell>
                  <ModernTableCell>Created</ModernTableCell>
                  <ModernTableCell>Actions</ModernTableCell>
                </ModernTableRow>
              </ModernTableHeader>
              <ModernTableBody>
                {rows.map((i) => (
                  <ModernTableRow key={i.Id_Inspections}>
                    <ModernTableCell className="font-medium">{i.warehouse?.name ?? "—"}</ModernTableCell>
                    <ModernTableCell>{i.commodity?.name ?? "—"}</ModernTableCell>
                    <ModernTableCell>
                      <StatusBadge status={i.Status as "Pending" | "Accepted" | "Rejected"} />
                    </ModernTableCell>
                    <ModernTableCell className="max-w-xs truncate">
                      {i.Manager_Remarks ? (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{i.Manager_Remarks}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </ModernTableCell>
                    <ModernTableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {i.Created_At ? new Date(i.Created_At).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </ModernTableCell>
                    <ModernTableCell>
                      <ModernButton 
                        size="sm" 
                        variant="outline" 
                        onClick={() => router.push(`/inspector/inspections/${i.Id_Inspections}`)}
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
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No inspections submitted yet.</p>
              <p className="text-sm mt-2">Start by selecting a warehouse from the dashboard.</p>
            </div>
          )}
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}


