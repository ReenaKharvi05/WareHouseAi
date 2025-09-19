"use client"

import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getManagerInspectors, getManagerInspections } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function ManagerInspectorsPage() {
  const { user } = useAuth()
  const managerId = user?.id || 0
  const [selectedInspector, setSelectedInspector] = useState<number | null>(null)

  const { data: inspectors, isLoading } = useQuery({
    queryKey: ["manager-inspectors", managerId],
    queryFn: () => getManagerInspectors(managerId),
    enabled: !!managerId,
  })

  const { data: inspections } = useQuery({
    queryKey: ["manager-inspector-inspections", selectedInspector],
    queryFn: () => getManagerInspections(managerId),
    enabled: !!managerId && !!selectedInspector,
  })

  if (isLoading) return <p className="p-6">Loading...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inspectors</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inspectors under you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(inspectors || []).map((ins) => (
                  <TableRow
                    key={ins.id}
                    className={selectedInspector === ins.id ? "bg-muted/40" : ""}
                    onClick={() => setSelectedInspector(ins.id)}
                  >
                    <TableCell>{ins.id}</TableCell>
                    <TableCell>{ins.Full_Name || ins.UserName}</TableCell>
                    <TableCell>{ins.EmailId || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedInspector && (
        <Card>
          <CardHeader>
            <CardTitle>Inspections by Inspector #{selectedInspector}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(inspections || []).map((i) => (
                    <TableRow key={i.Id_Inspections}>
                    <TableCell>{i.warehouse?.name ?? "—"}</TableCell>
                    <TableCell>{i.commodity?.name ?? "—"}</TableCell>
                      <TableCell>{i.Created_At ? new Date(i.Created_At).toLocaleString() : ""}</TableCell>
                      <TableCell>
                        <Badge>{i.Status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


