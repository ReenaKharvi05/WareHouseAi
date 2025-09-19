"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { Warehouse, CreateWarehouseForm } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

interface WarehouseFormProps {
  warehouse?: Warehouse
  onSubmit: (data: CreateWarehouseForm) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function WarehouseForm({ warehouse, onSubmit, onCancel, isLoading = false }: WarehouseFormProps) {
  const [formData, setFormData] = useState<CreateWarehouseForm>({
    name: warehouse?.name || "",
    location: warehouse?.location || "",
    address: warehouse?.address || "",
    managerId: warehouse?.managerId,
    capacityTons: warehouse?.capacityTons || 0,
  })
  const [currentStockTons, setCurrentStockTons] = useState(warehouse?.currentStockTons || 0)
  const [isActive, setIsActive] = useState(warehouse?.isActive ?? true)
  const [error, setError] = useState("")

  // Get warehouse managers for the dropdown
  const warehouseManagers = mockUsers.filter((user) => user.role === "Manager" || user.role === "Admin")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.name || !formData.location || formData.capacityTons <= 0) {
      setError("Please fill in all required fields with valid values")
      return
    }

    if (currentStockTons > formData.capacityTons) {
      setError("Current stock cannot exceed warehouse capacity")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const handleInputChange = (field: keyof CreateWarehouseForm, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{warehouse ? "Edit Warehouse" : "Create New Warehouse"}</CardTitle>
        <CardDescription>
          {warehouse ? "Update warehouse information and settings" : "Add a new warehouse location to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter warehouse name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter city/location"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter complete address"
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={formData.managerId?.toString() || "none"}
                onValueChange={(value) =>
                  handleInputChange("managerId", value === "none" ? undefined : Number.parseInt(value))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No manager assigned</SelectItem>
                  {warehouseManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.fullName} ({manager.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (tons) *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                step="0.01"
                value={formData.capacityTons}
                onChange={(e) => handleInputChange("capacityTons", Number.parseFloat(e.target.value) || 0)}
                placeholder="Enter capacity in tons"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {warehouse && (
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock (tons)</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                step="0.01"
                value={currentStockTons}
                onChange={(e) => setCurrentStockTons(Number.parseFloat(e.target.value) || 0)}
                placeholder="Enter current stock in tons"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Utilization:{" "}
                {formData.capacityTons > 0 ? ((currentStockTons / formData.capacityTons) * 100).toFixed(1) : 0}%
              </p>
            </div>
          )}

          {warehouse && (
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isLoading} />
              <Label htmlFor="isActive">Active Warehouse</Label>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {warehouse ? "Updating..." : "Creating..."}
                </>
              ) : warehouse ? (
                "Update Warehouse"
              ) : (
                "Create Warehouse"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
