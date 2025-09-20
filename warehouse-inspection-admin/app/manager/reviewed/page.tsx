"use client"

import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getManagerInspections } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ReviewedInspectionsPage() {
  const { user } = useAuth()
  const managerId = user?.id || 0
  const { data, isLoading } = useQuery({
    queryKey: ["manager-reviewed", managerId],
    queryFn: () => getManagerInspections(managerId),
    enabled: !!managerId,
  })

  if (isLoading) return <p className="p-6">Loading...</p>
  const rows = (data || []).filter((x) => x.Status === "Accepted" || x.Status === "Rejected")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reviewed Inspections</h1>
      <Card>
        <CardHeader>
          <CardTitle>Accepted / Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i.Id_Inspections}>
                    <TableCell>{i.warehouse?.name ?? "—"}</TableCell>
                    <TableCell>{i.inspector?.full_name || i.inspector?.username || "—"}</TableCell>
                    <TableCell>{i.commodity?.name ?? "—"}</TableCell>
                    <TableCell>{i.Created_At ? new Date(i.Created_At).toLocaleString() : ""}</TableCell>
                    <TableCell>
                      <Badge>{i.Status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{i.Manager_Remarks || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {rows.length === 0 && <p className="p-6 text-muted-foreground">No reviewed inspections.</p>}
        </CardContent>
      </Card>
    </div>
  )
}


