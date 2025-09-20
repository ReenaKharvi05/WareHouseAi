"use client"

import { useQuery } from "@tanstack/react-query"
import { getInspectionDetail } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Dialog as ZoomDialog, DialogContent as ZoomDialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

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

  if (isLoading) return <p className="p-6">Loading...</p>
  if (!detail) return <p className="p-6">Inspection not found.</p>

  const { inspection, answers, evidence } = detail

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Inspection Details</h1>
      </div>

      {/* Inspection Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Warehouse</p>
              <p className="font-medium">{inspection.warehouse?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commodity</p>
              <p className="font-medium">{inspection.commodity?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inspector</p>
              <p className="font-medium">
                {inspection.inspector?.full_name || inspection.inspector?.username || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={inspection.status === "Accepted" ? "default" : "destructive"}>
                {inspection.status}
              </Badge>
            </div>
          </div>
          {inspection.manager_remarks && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Manager Remarks</p>
              <p className="font-medium">{inspection.manager_remarks}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answers */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.question_id} className="rounded-lg border p-4">
                <p className="font-semibold mb-2">{answer.question_text}</p>
                <p className="text-muted-foreground mb-2">
                  <strong>Answer:</strong> {answer.answer ?? "—"}
                </p>
                {answer.remarks && (
                  <p className="text-muted-foreground">
                    <strong>Remarks:</strong> {answer.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evidence */}
      {evidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {evidence.map((item) => (
                <div key={item.id} className="space-y-2">
                  {item.file_type?.startsWith("image/") ? (
                    <div className="aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={item.file_url}
                        alt="Evidence"
                        className="w-full h-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                        onClick={() => setZoomedImage(item.file_url)}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square border rounded-lg flex items-center justify-center">
                      <a
                        href={item.file_url}
                        className="text-blue-600 underline text-sm text-center p-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download File
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
