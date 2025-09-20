"use client"

import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getManagerInspectors, listInspections } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    queryKey: ["inspector-inspections", selectedInspector],
    queryFn: () => listInspections({ inspector_id: selectedInspector }),
    enabled: !!selectedInspector,
  })

  if (isLoading) return <p className="p-6">Loading...</p>

  const selectedInspectorData = inspectors?.find(ins => ins.id === selectedInspector)

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
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Assigned Warehouses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(inspectors || []).map((ins) => (
                  <TableRow
                    key={ins.id}
                    className={selectedInspector === ins.id ? "bg-muted/40" : ""}
                  >
                    <TableCell>{ins.UserName}</TableCell>
                    <TableCell>{ins.Full_Name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">View Details</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedInspector(ins.id)}
                      >
                        View Inspections
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedInspector && selectedInspectorData && (
        <Card>
          <CardHeader>
            <CardTitle>
              Inspections by {selectedInspectorData.Full_Name || selectedInspectorData.UserName}
            </CardTitle>
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
                        <Badge variant={
                          i.Status === "Accepted" ? "default" : 
                          i.Status === "Rejected" ? "destructive" : 
                          "secondary"
                        }>
                          {i.Status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {(!inspections || inspections.length === 0) && (
              <p className="p-6 text-muted-foreground">No inspections found for this inspector.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}


