"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchCommodities } from "@/lib/api"
import type { Commodity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WarehouseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [commodities, setCommodities] = useState<Commodity[]>([])

  useEffect(() => {
    fetchCommodities()
      .then(setCommodities)
      .catch(err => console.error("Error fetching commoditiess:", err))
  }, [])

  const handleCommoditySelect = (value: string) => {
    router.push(`/inspector/warehouses/${id}/inspect/${value}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Warehouse {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Commodity</Label>
              <Select onValueChange={handleCommoditySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a commodity" />
                </SelectTrigger>
                <SelectContent>
                  {commodities.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">No commodities found</div>
                  ) : (
                    commodities.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.Commodity_Name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
