"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { listInspections } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

  if (isLoading) return <p className="p-6">Loading...</p>

  const rows = data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Inspections</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager Remarks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i.Id_Inspections}>
                    <TableCell>{i.warehouse?.name ?? "—"}</TableCell>
                    <TableCell>{i.commodity?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge>{i.Status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{i.Manager_Remarks || "—"}</TableCell>
                    <TableCell>{i.Created_At ? new Date(i.Created_At).toLocaleString() : ""}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/inspector/inspections/${i.Id_Inspections}`)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {rows.length === 0 && <p className="p-6 text-muted-foreground">No inspections yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}


