"use client"
import { Dialog as ZoomDialog, DialogContent as ZoomDialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listInspections, reviewInspection, getInspectionDetail } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function ManagerInspectionsPage() {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [remarks, setRemarks] = useState("")
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [zoomedMedia, setZoomedMedia] = useState<{ url: string; type: string } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["manager-inspections"],
    queryFn: () => listInspections({ pending_only: true }),
  })

  const { data: detail } = useQuery({
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

  if (isLoading) return <p className="p-6">Loading...</p>

  const rows = data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Pending Reviews</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inspections awaiting review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i.Id_Inspections}>
                    <TableCell>{i.warehouse?.name ?? "—"}</TableCell>
                    <TableCell>{i.commodity?.name ?? "—"}</TableCell>
                    <TableCell>{i.inspector?.full_name || i.inspector?.username || "—"}</TableCell>
                    <TableCell>
                      <Badge>{i.Status}</Badge>
                    </TableCell>
                    <TableCell>{i.Created_At ? new Date(i.Created_At).toLocaleString() : ""}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedId(i.Id_Inspections)}>Open</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {rows.length === 0 && <p className="p-6 text-muted-foreground">No pending inspections.</p>}
        </CardContent>
      </Card>

     // ...existing code...
<Dialog open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
     <DialogTitle>
  Review Inspection of &nbsp;
  {detail?.inspection?.inspector?.full_name ||
    detail?.inspection?.inspector?.username ||
    "—"}
</DialogTitle>
    </DialogHeader>
    {!detail ? (
      <p>Loading...</p>
    ) : (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto"> {/* <-- Make dialog scrollable */}
        <div className="text-sm text-muted-foreground">
          Warehouse: {detail.inspection.warehouse?.name ?? "—"} :- Inspector: {detail.inspection.inspector?.full_name || detail.inspection.inspector?.username || "—"}
          :- Commodity: {detail.inspection.commodity?.name ?? "—"} 
        </div>
        <div>
          {/* <div className="font-medium mb-2">Answers</div> */}
          {/* <div className="space-y-4">
            {detail.answers.map((a) => (
              <div key={a.question_id} className="rounded-xl shadow p-4">
                <p className="font-semibold">{a.question_text}</p>
                <p>Answer: {a.answer ?? "—"}</p>
                {a.remarks && <p>Remarks: {a.remarks}</p>}
              </div>
            ))}
            {detail.evidence.length > 0 && (
              <div className="rounded-xl shadow p-4">
                <p className="font-semibold mb-2">Evidence</p>
                <div className="flex flex-wrap gap-3">
                {detail.evidence.map((e) => (
                  <div key={e.id} className="w-32">
                    {e.file_type?.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.file_url}
                        alt="evidence"
                        className="w-32 h-32 object-cover rounded cursor-zoom-in"
                        onClick={() => setZoomedImage(e.file_url)}
                      />
                    ) : (
                      <a href={e.file_url} className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer">
                        {e.file_url.split("/").pop()}
                      </a>
                    )}
                  </div>
                ))}
              </div>
              </div>
            )}
          </div> */}
         
<div className="font-medium mb-2">Answers</div>
<div className="space-y-4">
  {detail.answers.map((a) => (
    <div key={a.question_id} className="rounded-xl shadow p-4">
      <p className="font-semibold">{a.question_text}</p>
      <p>Answer: {a.answer ?? "—"}</p>
      {a.remarks && <p>Remarks: {a.remarks}</p>}
      {a.evidence && a.evidence.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold mb-1">Evidence</p>
          <div className="flex flex-wrap gap-3">
            {a.evidence.map((e) => (
              <div key={e.id} className="w-32">
                {e.file_type?.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.file_url}
                    alt="evidence"
                    className="w-32 h-32 object-cover rounded cursor-zoom-in"
                   onClick={() => setZoomedMedia({ url: e.file_url, type: e.file_type ?? "" })}
                  />
                ) : (
                  <a href={e.file_url} className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer">
                    {e.file_url.split("/").pop()}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ))}
</div>

        </div>
        <div>
          <div className="font-medium mb-2">Manager Remarks (optional)</div>
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={() => mutation.mutate({ id: selectedId!, status: "Rejected" })} disabled={mutation.isPending}>
            Reject
          </Button>
          <Button onClick={() => mutation.mutate({ id: selectedId!, status: "Accepted" })} disabled={mutation.isPending}>
            Approve
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>


 <ZoomDialog open={!!zoomedMedia} onOpenChange={() => setZoomedMedia(null)}>
      <ZoomDialogContent className="flex items-center justify-center bg-black p-0" style={{ minHeight: "100vh" }}>
        {zoomedMedia && (
          <div className="w-full h-full flex items-center justify-center">
            {(zoomedMedia.type ?? "").startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={zoomedMedia.url}
                alt="Zoomed Evidence"
                className="max-w-full max-h-screen object-contain"
                style={{ background: "#222" }}
              />
            ) : (zoomedMedia.type ?? "").startsWith("video/") ? (
              <video
                src={zoomedMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-screen object-contain bg-black"
              />
            ) : (
              <a href={zoomedMedia.url} target="_blank" rel="noreferrer" className="text-white underline">
                Download file
              </a>
            )}
          </div>
        )}
      </ZoomDialogContent>
    </ZoomDialog>
    </div>
  )
}


