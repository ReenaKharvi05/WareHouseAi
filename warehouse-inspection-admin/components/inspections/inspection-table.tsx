"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Eye, Plus, Calendar, MapPin, User, Package } from "lucide-react"
import type { Inspection, InspectionStatus } from "@/lib/types"
import { mockInspections, mockWarehouses, mockCommodities, mockUsers } from "@/lib/mock-data"

interface InspectionTableProps {
  onCreateInspection: () => void
  onEditInspection: (inspection: Inspection) => void
  onViewInspection: (inspection: Inspection) => void
  onConductInspection: (inspection: Inspection) => void
}

export function InspectionTable({
  onCreateInspection,
  onEditInspection,
  onViewInspection,
  onConductInspection,
}: InspectionTableProps) {
  const [inspections] = useState<Inspection[]>(mockInspections)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")

  const filteredInspections = inspections.filter((inspection) => {
    const warehouse = mockWarehouses.find((w) => w.id === inspection.warehouseId)
    const commodity = mockCommodities.find((c) => c.id === inspection.commodityId)
    const inspector = mockUsers.find((u) => u.id === inspection.inspectorId)

    const matchesSearch =
      warehouse?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commodity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspector?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || inspection.status === statusFilter
    const matchesWarehouse = warehouseFilter === "all" || inspection.warehouseId.toString() === warehouseFilter

    return matchesSearch && matchesStatus && matchesWarehouse
  })

  const getStatusColor = (status: InspectionStatus) => {
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
            <CardTitle>Inspection Management</CardTitle>
            <CardDescription>Manage warehouse inspections and their progress</CardDescription>
          </div>
          <Button onClick={onCreateInspection}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Inspection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {mockWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspection Details</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => {
                const warehouse = mockWarehouses.find((w) => w.id === inspection.warehouseId)
                const commodity = mockCommodities.find((c) => c.id === inspection.commodityId)
                const inspector = mockUsers.find((u) => u.id === inspection.inspectorId)

                return (
                  <TableRow key={inspection.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{warehouse?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="h-3 w-3" />
                          <span>{commodity?.name}</span>
                        </div>
                        {inspection.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-xs">{inspection.notes}</div>
                        )}
                      </div>
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
                    <TableCell>
                      <span className={getScoreColor(inspection.overallScore)}>
                        {inspection.overallScore ? `${inspection.overallScore}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewInspection(inspection)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {(inspection.status === "Pending" || inspection.status === "In Progress") && (
                            <DropdownMenuItem onClick={() => onConductInspection(inspection)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Conduct Inspection
                            </DropdownMenuItem>
                          )}
                          {inspection.status === "Pending" && (
                            <DropdownMenuItem onClick={() => onEditInspection(inspection)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Schedule
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredInspections.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No inspections found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
