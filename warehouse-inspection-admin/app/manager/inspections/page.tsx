"use client"
import { Dialog as ZoomDialog, DialogContent as ZoomDialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listInspections, reviewInspection, getInspectionDetail } from "@/lib/api"
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from "@/components/ui/modern-card"
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell, ShimmerTableComponent } from "@/components/ui/modern-table"
import { ModernButton } from "@/components/ui/modern-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { EvidenceDisplay } from "@/components/ui/evidence-display"
import { ShimmerInspectionDetail } from "@/components/ui/shimmer"
import { Clock, Eye, CheckCircle, XCircle } from "lucide-react"

export default function ManagerInspectionsPage() {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [remarks, setRemarks] = useState("")
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["manager-inspections"],
    queryFn: () => listInspections({ pending_only: true }),
  })

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ["inspection-detail", selectedId],
    queryFn: () => getInspectionDetail(selectedId as number),
    enabled: !!selectedId,
  })

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "Accepted" | "Rejected" }) => {
      return reviewInspection(id, { status, manager_remarks: remarks })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["manager-inspections"] })
      setSelectedId(null)
      setRemarks("")
    },
  })

  const rows = data ?? []

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pending Reviews</h1>
        <p className="text-gray-600 mt-2">Review and approve pending inspections</p>
      </div>

      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Inspections awaiting review
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
                  <ModernTableCell>Inspector</ModernTableCell>
                  <ModernTableCell>Status</ModernTableCell>
                  <ModernTableCell>Submitted</ModernTableCell>
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
                      <StatusBadge status={i.Status as "Pending"} />
                    </ModernTableCell>
                    <ModernTableCell>{i.Created_At ? new Date(i.Created_At).toLocaleString() : ""}</ModernTableCell>
                    <ModernTableCell>
                      <ModernButton 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedId(i.Id_Inspections)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </ModernButton>
                    </ModernTableCell>
                  </ModernTableRow>
                ))}
              </ModernTableBody>
            </ModernTable>
          )}
          {!isLoading && rows.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending inspections to review.</p>
            </div>
          )}
        </ModernCardContent>
      </ModernCard>

      <Dialog open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Review Inspection - {detail?.inspection?.inspector?.full_name || detail?.inspection?.inspector?.username || "—"}
            </DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <ShimmerInspectionDetail />
          ) : detail ? (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Warehouse</p>
                  <p className="font-medium">{detail.inspection.warehouse?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inspector</p>
                  <p className="font-medium">{detail.inspection.inspector?.full_name || detail.inspection.inspector?.username || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Commodity</p>
                  <p className="font-medium">{detail.inspection.commodity?.name ?? "—"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Inspection Answers</h3>
                {detail.answers.map((a) => (
                  <div key={a.question_id} className="rounded-xl border p-4 bg-white">
                    <p className="font-semibold text-gray-900 mb-2">{a.question_text}</p>
                    <p className="text-gray-700 mb-1"><strong>Answer:</strong> {a.answer ?? "—"}</p>
                    {a.remarks && <p className="text-gray-600"><strong>Remarks:</strong> {a.remarks}</p>}
                    {a.evidence && a.evidence.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium text-gray-900 mb-2">Evidence for this answer:</p>
                        <EvidenceDisplay evidence={a.evidence} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {detail.evidence.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">General Evidence</h3>
                  <EvidenceDisplay evidence={detail.evidence} />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Manager Remarks (Optional)</h3>
                <Textarea 
                  value={remarks} 
                  onChange={(e) => setRemarks(e.target.value)} 
                  placeholder="Enter your remarks about this inspection..."
                  className="rounded-lg border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <ModernButton 
                  variant="reject" 
                  onClick={() => mutation.mutate({ id: selectedId!, status: "Rejected" })} 
                  disabled={mutation.isPending}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </ModernButton>
                <ModernButton 
                  variant="approve"
                  onClick={() => mutation.mutate({ id: selectedId!, status: "Accepted" })} 
                  disabled={mutation.isPending}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </ModernButton>
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">Failed to load inspection details.</p>
          )}
        </DialogContent>
      </Dialog>

      <ZoomDialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <ZoomDialogContent className="max-w-4xl">
          {zoomedImage && (
            <img
              src={zoomedImage}
              alt="Evidence"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </ZoomDialogContent>
      </ZoomDialog>
    </div>
  )
}