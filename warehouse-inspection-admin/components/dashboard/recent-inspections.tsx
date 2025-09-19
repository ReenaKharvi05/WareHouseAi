"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Calendar, MapPin, User } from "lucide-react"
import Link from "next/link"
import type { Inspection } from "@/lib/types"
import { mockWarehouses, mockCommodities, mockUsers } from "@/lib/mock-data"

interface RecentInspectionsProps {
  inspections: Inspection[]
}

export function RecentInspections({ inspections }: RecentInspectionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Failed":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground"
    if (score >= 90) return "text-green-600 font-semibold"
    if (score >= 75) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Inspections</CardTitle>
            <CardDescription>Latest inspection activities and their status</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/inspections">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Warehouse</TableHead>
              <TableHead>Commodity</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.map((inspection) => {
              const warehouse = mockWarehouses.find((w) => w.id === inspection.warehouseId)
              const commodity = mockCommodities.find((c) => c.id === inspection.commodityId)
              const inspector = mockUsers.find((u) => u.id === inspection.inspectorId)

              return (
                <TableRow key={inspection.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{warehouse?.name}</div>
                        <div className="text-sm text-muted-foreground">{warehouse?.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{commodity?.name}</div>
                    <div className="text-sm text-muted-foreground">{commodity?.category}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{inspector?.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(inspection.inspectionDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={getScoreColor(inspection.overallScore)}>
                      {inspection.overallScore ? `${inspection.overallScore}%` : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
