"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import CommodityAddForm from "@/components/commodities/commodity-add-form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Search, MoreHorizontal, Edit, Trash2, Plus, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CommodityActions from "@/components/commodities/commodity-actions"

import { createCommodity, deleteCommodity, getCommodities, updateCommodity, softDeleteCommodity, type ApiCommodity } from "@/lib/api"

export default function CommoditiesPage() {
  const [rows, setRows] = useState<ApiCommodity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [storageFilter, setStorageFilter] = useState<string>("all")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const params: any = {}
      if (categoryFilter !== "all") params.category = categoryFilter
      if (storageFilter !== "all") params.storage = storageFilter
      if (activeFilter !== "all") params.active = activeFilter === "active" ? 1 : 0
      if (searchTerm.trim()) params.name = searchTerm.trim()
      const data = await getCommodities(params)
      setRows(data)
    } catch (e: any) {
      setError(e?.message || "Failed to load commodities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, storageFilter, activeFilter])

  const filtered = useMemo(() => rows, [rows])
  const [editOpen, setEditOpen] = useState(false);
const [editCommodity, setEditCommodity] = useState<ApiCommodity | null>(null);
const handleEdit = (commodity: ApiCommodity) => {
  setEditCommodity(commodity)
  setEditOpen(true)
}


  const uniqueCategories = useMemo(() => Array.from(new Set(rows.map((c) => c.Category).filter(Boolean))) as string[], [rows])

  return (
    <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commodities</h1>
          <p className="text-muted-foreground">Manage commodity types and categories</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Commodity Management</CardTitle>
                <CardDescription>Manage commodity types available for inspection</CardDescription>
              </div>
              <CommodityAddForm onSuccess={load} />
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search commodities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && load()}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={storageFilter} onValueChange={setStorageFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Storage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Storage</SelectItem>
                    <SelectItem value="Cold">Cold</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Active" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={load}>Apply</Button>
              </div>
            </div>

            <div className="rounded-md border">
              {loading ? (
                <div className="p-6 text-muted-foreground">Loading...</div>
              ) : (
              <Table>
  <TableHeader>
    <TableRow>
      {/* Removed IdCommodity column */}
      <TableHead>Commodity_Name</TableHead>
      <TableHead>CommodityStorage</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Status</TableHead> {/* Changed from IsActive */}
      <TableHead>CreatedAt</TableHead>
      <TableHead className="w-12"></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filtered.map((c) => (
      <TableRow key={c.IdCommodity}>
        {/* Removed IdCommodity cell */}
        <TableCell className="font-medium flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          {c.Commodity_Name}
        </TableCell>
        <TableCell>{c.CommodityStorage || "-"}</TableCell>
        <TableCell>{c.Category || "-"}</TableCell>
        <TableCell className="max-w-[240px] truncate" title={c.Description || undefined}>
          {c.Description || "-"}
        </TableCell>
        <TableCell>
          {c.IsActive === 1 ? "Active" : "Inactive"} {/* Updated status display */}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {c.CreatedAt ? new Date(c.CreatedAt).toLocaleDateString() : "-"}
        </TableCell>
        <TableCell>
  <CommodityActions
    commodity={c}
    onEdit={handleEdit}
    onDeleted={load} // refresh after delete
  />
</TableCell>


      </TableRow>
    ))}
  </TableBody>
</Table>

              )}
            </div>

            {filtered.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No commodities found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
