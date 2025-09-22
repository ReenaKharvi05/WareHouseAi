"use client"

import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getManagerInspectors, listInspections } from "@/lib/api"
import { useState } from "react"
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from "@/components/ui/modern-card"
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell, ShimmerTableComponent } from "@/components/ui/modern-table"
import { ModernButton } from "@/components/ui/modern-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Eye, Users } from "lucide-react"

export default function ManagerInspectorsPage() {
  const { user } = useAuth()
  const managerId = user?.id || 0
  const [selectedInspector, setSelectedInspector] = useState<number | null>(null)

  const { data: inspectors, isLoading: inspectorsLoading } = useQuery({
    queryKey: ["manager-inspectors", managerId],
    queryFn: () => getManagerInspectors(managerId),
    enabled: !!managerId,
  })

  const { data: inspections, isLoading: inspectionsLoading } = useQuery({
    queryKey: ["inspector-inspections", selectedInspector],
    queryFn: () => listInspections({ inspector_id: selectedInspector }),
    enabled: !!selectedInspector,
  })

  const selectedInspectorData = inspectors?.find(ins => ins.id === selectedInspector)

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inspectors</h1>
        <p className="text-gray-600 mt-2">Manage inspectors under your supervision</p>
      </div>

      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Inspectors under you
          </ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          {inspectorsLoading ? (
            <ShimmerTableComponent rows={5} columns={4} />
          ) : (
            <ModernTable>
              <ModernTableHeader>
                <ModernTableRow isHeader>
                  <ModernTableCell>Username</ModernTableCell>
                  <ModernTableCell>Full Name</ModernTableCell>
                  <ModernTableCell>Assigned Warehouses</ModernTableCell>
                  <ModernTableCell>Actions</ModernTableCell>
                </ModernTableRow>
              </ModernTableHeader>
              <ModernTableBody>
                {(inspectors || []).map((ins) => (
                  <ModernTableRow
                    key={ins.id}
                    className={selectedInspector === ins.id ? "bg-blue-50 border-blue-200" : ""}
                  >
                    <ModernTableCell className="font-medium">{ins.UserName}</ModernTableCell>
                    <ModernTableCell>{ins.Full_Name || "—"}</ModernTableCell>
                    <ModernTableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        View Details
                      </Badge>
                    </ModernTableCell>
                    <ModernTableCell>
                      <ModernButton 
                        size="sm" 
                        variant={selectedInspector === ins.id ? "primary" : "outline"}
                        onClick={() => setSelectedInspector(ins.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Inspections
                      </ModernButton>
                    </ModernTableCell>
                  </ModernTableRow>
                ))}
              </ModernTableBody>
            </ModernTable>
          )}
          {!inspectorsLoading && (!inspectors || inspectors.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No inspectors found under your supervision.</p>
            </div>
          )}
        </ModernCardContent>
      </ModernCard>

      {selectedInspector && selectedInspectorData && (
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>
              Inspections by {selectedInspectorData.Full_Name || selectedInspectorData.UserName}
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            {inspectionsLoading ? (
              <ShimmerTableComponent rows={5} columns={4} />
            ) : (
              <ModernTable>
                <ModernTableHeader>
                  <ModernTableRow isHeader>
                    <ModernTableCell>Warehouse</ModernTableCell>
                    <ModernTableCell>Commodity</ModernTableCell>
                    <ModernTableCell>Submitted</ModernTableCell>
                    <ModernTableCell>Status</ModernTableCell>
                  </ModernTableRow>
                </ModernTableHeader>
                <ModernTableBody>
                  {(inspections || []).map((i) => (
                    <ModernTableRow key={i.Id_Inspections}>
                      <ModernTableCell className="font-medium">{i.warehouse?.name ?? "—"}</ModernTableCell>
                      <ModernTableCell>{i.commodity?.name ?? "—"}</ModernTableCell>
                      <ModernTableCell>{i.Created_At ? new Date(i.Created_At).toLocaleString() : ""}</ModernTableCell>
                      <ModernTableCell>
                        <StatusBadge status={i.Status as "Pending" | "Accepted" | "Rejected"} />
                      </ModernTableCell>
                    </ModernTableRow>
                  ))}
                </ModernTableBody>
              </ModernTable>
            )}
            {!inspectionsLoading && (!inspections || inspections.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <p>No inspections found for this inspector.</p>
              </div>
            )}
          </ModernCardContent>
        </ModernCard>
      )}
    </div>
  )
}


