"use client"

import { useQuery } from "@tanstack/react-query"
import { getInspectionDetail } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Dialog as ZoomDialog, DialogContent as ZoomDialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { ArrowLeft, FileText, User, Warehouse, Package } from "lucide-react"
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from "@/components/ui/modern-card"
import { ModernButton } from "@/components/ui/modern-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { EvidenceDisplay } from "@/components/ui/evidence-display"
import { ShimmerInspectionDetail } from "@/components/ui/shimmer"

interface InspectionDetailPageProps {
  params: {
    id: string
  }
}

export default function InspectionDetailPage({ params }: InspectionDetailPageProps) {
  const router = useRouter()
  const inspectionId = parseInt(params.id)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const { data: detail, isLoading } = useQuery({
    queryKey: ["inspection-detail", inspectionId],
    queryFn: () => getInspectionDetail(inspectionId),
    enabled: !!inspectionId,
  })

  if (isLoading) return <ShimmerInspectionDetail />
  if (!detail) return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="text-center py-12">
        <p className="text-gray-500">Inspection not found.</p>
        <ModernButton onClick={() => router.back()} className="mt-4">
          Go Back
        </ModernButton>
      </div>
    </div>
  )

  const { inspection, answers, evidence } = detail

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex items-center gap-4">
        <ModernButton variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </ModernButton>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inspection Details</h1>
      </div>

      {/* Inspection Overview */}
      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Inspection Overview
          </ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Warehouse className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Warehouse</p>
                <p className="font-semibold text-gray-900">{inspection.warehouse?.name ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Commodity</p>
                <p className="font-semibold text-gray-900">{inspection.commodity?.name ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inspector</p>
                <p className="font-semibold text-gray-900">
                  {inspection.inspector?.full_name || inspection.inspector?.username || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={inspection.status as "Pending" | "Accepted" | "Rejected"} />
              </div>
            </div>
          </div>
          {inspection.manager_remarks && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Manager Remarks</p>
              <p className="text-gray-900">{inspection.manager_remarks}</p>
            </div>
          )}
        </ModernCardContent>
      </ModernCard>

      {/* Answers */}
      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle>Inspection Answers</ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          <div className="space-y-6">
            {answers.map((answer) => (
              <div key={answer.question_id} className="rounded-xl border border-gray-200 p-6 bg-white">
                <p className="font-semibold text-gray-900 mb-3">{answer.question_text}</p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Answer:</strong> {answer.answer ?? "—"}
                  </p>
                  {answer.remarks && (
                    <p className="text-gray-600">
                      <strong className="text-gray-900">Remarks:</strong> {answer.remarks}
                    </p>
                  )}
                  {answer.evidence && answer.evidence.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-gray-900 mb-3">Evidence for this answer:</p>
                      <EvidenceDisplay evidence={answer.evidence} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ModernCardContent>
      </ModernCard>

      {/* Evidence */}
      {evidence.length > 0 && (
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>General Evidence</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <EvidenceDisplay evidence={evidence} />
          </ModernCardContent>
        </ModernCard>
      )}

      {/* Image Zoom Dialog */}
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
