"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, MoreHorizontal, Edit, Trash2, Plus, MapPin, User, Package } from "lucide-react"
import type { Warehouse } from "@/lib/types"
import { mockWarehouses, mockUsers } from "@/lib/mock-data"

interface WarehouseTableProps {
  onCreateWarehouse: () => void
  onEditWarehouse: (warehouse: Warehouse) => void
  onDeleteWarehouse: (warehouse: Warehouse) => void
  onViewDetails: (warehouse: Warehouse) => void
}

export function WarehouseTable({
  onCreateWarehouse,
  onEditWarehouse,
  onDeleteWarehouse,
  onViewDetails,
}: WarehouseTableProps) {
  const [warehouses] = useState<Warehouse[]>(mockWarehouses)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.address?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = locationFilter === "all" || warehouse.location === locationFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && warehouse.isActive) ||
      (statusFilter === "inactive" && !warehouse.isActive)

    return matchesSearch && matchesLocation && matchesStatus
  })

  const getCapacityUtilization = (warehouse: Warehouse) => {
    return (warehouse.currentStockTons / warehouse.capacityTons) * 100
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  const uniqueLocations = Array.from(new Set(warehouses.map((w) => w.location)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Warehouse Management</CardTitle>
            <CardDescription>Manage warehouse locations and capacity</CardDescription>
          </div>
          <Button onClick={onCreateWarehouse}>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarehouses.map((warehouse) => {
                const manager = warehouse.managerId ? mockUsers.find((u) => u.id === warehouse.managerId) : null
                const utilization = getCapacityUtilization(warehouse)

                return (
                  <TableRow
                    key={warehouse.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetails(warehouse)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {warehouse.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {warehouse.location}
                        </div>
                        {warehouse.address && (
                          <div className="text-xs text-muted-foreground mt-1">{warehouse.address}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {manager ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{manager.fullName}</div>
                            <div className="text-sm text-muted-foreground">{manager.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{warehouse.capacityTons.toLocaleString()} tons</div>
                        <div className="text-sm text-muted-foreground">
                          {warehouse.currentStockTons.toLocaleString()} tons current
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                            {utilization.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(warehouse.isActive)}>
                        {warehouse.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditWarehouse(warehouse)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteWarehouse(warehouse)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredWarehouses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No warehouses found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
