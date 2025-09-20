"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getInspectionDetail } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  const { data, isLoading } = useQuery({
    queryKey: ["inspection-detail", id],
    queryFn: () => getInspectionDetail(id),
    enabled: Number.isFinite(id),
  })

  if (isLoading || !data) return <p className="p-6">Loading...</p>

  const inspection = data.inspection
  const answers = data.answers
  const evidence = data.evidence

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inspection #{inspection.id}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-muted-foreground">Warehouse:</span> {inspection.warehouse?.name ?? "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Commodity:</span> {inspection.commodity?.name ?? "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Inspector:</span> {inspection.inspector?.full_name || inspection.inspector?.username || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span> <Badge>{inspection.status}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Manager Remarks:</span> {inspection.manager_remarks ?? "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
            {answers.length === 0 && <div className="text-muted-foreground">No answers recorded.</div>}
            {answers.map((a) => (
              <div key={a.question_id} className="rounded-xl shadow p-4">
                <p className="font-semibold">{a.question_text}</p>
                <p>Answer: {a.answer ?? "—"}</p>
                {a.remarks && <p>Remarks: {a.remarks}</p>}
                {a.evidence && a.evidence.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {a.evidence.map((ev) => (
                      <div key={ev.id} className="w-32">
                        {ev.file_type?.startsWith("image/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ev.file_url} alt="evidence" className="w-32 h-32 object-cover rounded" />
                        ) : (
                          <a href={ev.file_url} className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer">
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!answers.length && evidence.length > 0 && (
              <div className="rounded-xl shadow p-4">
                <p className="font-semibold mb-2">Evidence</p>
                <div className="flex flex-wrap gap-3">
                  {evidence.map((e) => (
                    <div key={e.id} className="w-32">
                      {e.file_type?.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.file_url} alt="evidence" className="w-32 h-32 object-cover rounded" />
                      ) : (
                        <a href={e.file_url} className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer">
                          Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


