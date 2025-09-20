"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchCommodities } from "@/lib/api"
import type { Commodity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function WarehouseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null)

  useEffect(() => {
    fetchCommodities()
      .then(setCommodities)
      .catch(err => console.error("Error fetching commoditiess:", err))
  }, [])

  const handleCommoditySelect = (value: string) => {
    const commodity = commodities.find(c => c.id.toString() === value)
    setSelectedCommodity(commodity || null)
    
    // Check if commodity requires cold storage
    if (commodity?.Storage === "Cold") {
      // Don't navigate, just show warning
      return
    }
    
    // Continue with normal flow for non-cold storage
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
            
            {/* Cold Storage Warning */}
            {selectedCommodity?.Storage === "Cold" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cold Storage Form Arriving Soon</strong>
                  <br />
                  The inspection form for cold storage commodities is currently under development. 
                  Please check back later or contact your manager for assistance.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
