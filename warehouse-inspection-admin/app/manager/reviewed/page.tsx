"use client"

import { useQuery } from "@tanstack/react-query"
import { listInspections } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ReviewedInspectionsPage() {
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ["reviewed-inspections"],
    queryFn: () => listInspections({ status: "Accepted,Rejected" }),
  })

  if (isLoading) return <p className="p-6">Loading...</p>
  const rows = data || []

  const handleViewDetails = (inspectionId: number) => {
    router.push(`/manager/inspections/${inspectionId}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reviewed Inspections</h1>
      <Card>
        <CardHeader>
          <CardTitle>Accepted / Rejected Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse Name</TableHead>
                  <TableHead>Commodity Name</TableHead>
                  <TableHead>Inspector Full Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager Remarks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i.Id_Inspections}>
                    <TableCell>{i.warehouse?.name ?? "—"}</TableCell>
                    <TableCell>{i.commodity?.name ?? "—"}</TableCell>
                    <TableCell>{i.inspector?.full_name || i.inspector?.username || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={i.Status === "Accepted" ? "default" : "destructive"}>
                        {i.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{i.Manager_Remarks || "—"}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDetails(i.Id_Inspections)}
                      >
                        View Details
                      </Button>
                    </TableCell>
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


