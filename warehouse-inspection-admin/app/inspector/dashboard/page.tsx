"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { fetchInspectorWarehouses } from "@/lib/api"
import type { Warehouse } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function InspectorDashboardPage() {
  const { user } = useAuth()
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  

  useEffect(() => {
    if (user?.id) {
      fetchInspectorWarehouses(user.id)
        .then(setWarehouses)
        .catch((err) => console.error("Error loading warehouses:", err))
        .finally(() => setLoading(false))
    }
  }, [user?.id])

  if (loading) return <p className="p-6">Loading...</p>

  // 📍 Utility: Calculate distance (Haversine formula)
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3 // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // in meters
  }

  // 📍 Handle warehouse click
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

      console.log("📍 Current:", latitude, longitude, "±", accuracy, "m")
      console.log("🏭 Warehouse:", whLat, whLng)
      console.log("📏 Distance:", distance)

      // Use accuracy if it's very high
      const tolerance = Math.max(200, accuracy)

      if (distance <= tolerance) {
        // ✅ within tolerance → proceed
        router.push(`/inspector/warehouses/${warehouse.id}`)
      } else {
        alert(
          `You are not at the warehouse location. (Distance: ${Math.round(
            distance
          )}m, Allowed: ${Math.round(tolerance)}m)`
        )
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Warehouses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((wh) => (
          <Card
            key={wh.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => handleWarehouseClick(wh)}
          >
            <CardHeader>
              <CardTitle>{wh.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{wh.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
