"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { fetchInspectorWarehouses } from "@/lib/api"
import type { Warehouse } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

export default function InspectorDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["inspector-warehouses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [] as Warehouse[]
      const apiWarehouses = await fetchInspectorWarehouses(user.id)
      // Map API to UI type
      const mapped: Warehouse[] = apiWarehouses.map((w: any) => ({
        id: w.Id_Warehouse,
        name: w.Warehouse_Name,
        location: `${w.Latitude ?? 0},${w.Longitude ?? 0}`,
        address: w.Location ?? "",
        capacityTons: w.Capacity ?? 0,
        currentStockTons: 0,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      }))
      return mapped
    },
    enabled: !!user?.id,
  })

  if (isLoading) return <p className="p-6">Loading...</p>

  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleWarehouseClick = (warehouse: Warehouse) => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const [whLat, whLng] = warehouse.location.split(",").map(Number)
        const distance = getDistance(latitude, longitude, whLat, whLng)
        const tolerance = Math.max(200, accuracy)
        if (distance <= tolerance) {
          router.push(`/inspector/warehouses/${warehouse.id}`)
        } else {
          alert(`You are not at the warehouse location. (Distance: ${Math.round(distance)}m, Allowed: ${Math.round(tolerance)}m)`) 
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Please enable location services to proceed.")
        } else {
          alert("Unable to fetch your location. Try again.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const warehouses = data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Warehouses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((wh) => (
          <Card key={wh.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => handleWarehouseClick(wh)}>
            <CardHeader>
              <CardTitle>{wh.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{wh.address}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
