"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, User, Package, Calendar, Edit, TrendingUp, AlertTriangle } from "lucide-react"
import type { Warehouse } from "@/lib/types"
import { mockUsers, mockInspections } from "@/lib/mock-data"

interface WarehouseDetailsProps {
  warehouse: Warehouse
  onEdit: () => void
  onClose: () => void
}

export function WarehouseDetails({ warehouse, onEdit, onClose }: WarehouseDetailsProps) {
  const manager = warehouse.managerId ? mockUsers.find((u) => u.id === warehouse.managerId) : null
  const utilization = (warehouse.currentStockTons / warehouse.capacityTons) * 100

  // Get recent inspections for this warehouse
  const warehouseInspections = mockInspections.filter((i) => i.warehouseId === warehouse.id)
  const recentInspections = warehouseInspections.slice(0, 5)

  const getUtilizationColor = (util: number) => {
    if (util >= 90) return "text-red-600"
    if (util >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getUtilizationStatus = (util: number) => {
    if (util >= 95) return { status: "Critical", color: "bg-red-100 text-red-800" }
    if (util >= 85) return { status: "High", color: "bg-yellow-100 text-yellow-800" }
    if (util >= 70) return { status: "Moderate", color: "bg-blue-100 text-blue-800" }
    return { status: "Low", color: "bg-green-100 text-green-800" }
  }

  const utilizationStatus = getUtilizationStatus(utilization)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{warehouse.name}</h2>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {warehouse.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getUtilizationColor(utilization)}`}>
                  {utilization.toFixed(1)}%
                </span>
                <Badge className={utilizationStatus.color}>{utilizationStatus.status}</Badge>
              </div>
              <Progress value={utilization} className="h-3" />
              <div className="text-sm text-muted-foreground">
                {warehouse.currentStockTons.toLocaleString()} / {warehouse.capacityTons.toLocaleString()} tons
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manager</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {manager ? (
              <div className="space-y-2">
                <div className="font-medium">{manager.fullName}</div>
                <div className="text-sm text-muted-foreground">{manager.email}</div>
                {manager.phone && <div className="text-sm text-muted-foreground">{manager.phone}</div>}
                <Badge variant="outline">{manager.role}</Badge>
              </div>
            ) : (
              <div className="text-muted-foreground">No manager assigned</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={warehouse.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {warehouse.isActive ? "Active" : "Inactive"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Created: {new Date(warehouse.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Updated: {new Date(warehouse.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {warehouse.address && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{warehouse.address}</p>
          </CardContent>
        </Card>
      )}

      {utilization >= 85 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Capacity Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              This warehouse is operating at {utilization.toFixed(1)}% capacity. Consider redistributing stock or
              expanding capacity to avoid operational issues.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Inspections</CardTitle>
          <CardDescription>Latest inspection activities for this warehouse</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInspections.length > 0 ? (
            <div className="space-y-3">
              {recentInspections.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{new Date(inspection.inspectionDate).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">{inspection.notes || "No notes"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {inspection.overallScore && <span className="text-sm font-medium">{inspection.overallScore}%</span>}
                    <Badge
                      variant={
                        inspection.status === "Completed"
                          ? "default"
                          : inspection.status === "In Progress"
                            ? "secondary"
                            : inspection.status === "Failed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {inspection.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No inspections recorded for this warehouse.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
