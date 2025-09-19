"use client"

import { useEffect, useMemo, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus } from "lucide-react"
import { createWarehouse, deleteWarehouse, getWarehouses, updateWarehouse, type ApiWarehouse } from "@/lib/api"

type Mode = "list" | "create" | "edit"

interface FormState {
  Id_Warehouse?: number
  Warehouse_Name: string
  Location: string
  Code: string
}

export default function WarehousesPage() {
  const [mode, setMode] = useState<Mode>("list")
  const [rows, setRows] = useState<ApiWarehouse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [form, setForm] = useState<FormState>({ Warehouse_Name: "", Location: "", Code: "" })

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getWarehouses()
      setRows(data)
    } catch (e: any) {
      setError(e?.message || "Failed to load warehouses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => setForm({ Warehouse_Name: "", Location: "", Code: "" })

  const onCreate = async () => {
    setLoading(true)
    setError("")
    try {
      await createWarehouse({
        Warehouse_Name: form.Warehouse_Name,
        Location: form.Location || undefined,
        Code: form.Code || undefined,
      })
      resetForm()
      setMode("list")
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to create warehouse")
    } finally {
      setLoading(false)
    }
  }

  const onUpdate = async () => {
    if (!form.Id_Warehouse) return
    setLoading(true)
    setError("")
    try {
      await updateWarehouse(form.Id_Warehouse, {
        Warehouse_Name: form.Warehouse_Name,
        Location: form.Location || undefined,
        Code: form.Code || undefined,
      })
      resetForm()
      setMode("list")
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to update warehouse")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm("Delete this warehouse?")) return
    setLoading(true)
    setError("")
    try {
      await deleteWarehouse(id)
      await load()
    } catch (e: any) {
      setError(e?.message || "Failed to delete warehouse")
    } finally {
      setLoading(false)
    }
  }

  const title = useMemo(() => (mode === "create" ? "Add Warehouse" : mode === "edit" ? "Edit Warehouse" : "Warehouses"), [mode])

  return (
    <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">Manage warehouses (Id_Warehouse, Warehouse_Name, Location, Code)</p>
            </div>
          {mode === "list" && (
            <Button onClick={() => { resetForm(); setMode("create") }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Warehouse
              </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mode !== "list" ? (
          <div className="rounded-md border p-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Warehouse Name</label>
                <Input value={form.Warehouse_Name} onChange={(e) => setForm({ ...form, Warehouse_Name: e.target.value })} placeholder="e.g. Central Depot" />
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <Input value={form.Location} onChange={(e) => setForm({ ...form, Location: e.target.value })} placeholder="e.g. Mumbai" />
            </div>
              <div>
                <label className="block text-sm mb-1">Code</label>
                <Input value={form.Code} onChange={(e) => setForm({ ...form, Code: e.target.value })} placeholder="e.g. WH-001" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={mode === "create" ? onCreate : onUpdate} disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save"}
              </Button>
              <Button variant="outline" onClick={() => { resetForm(); setMode("list") }} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            {loading ? (
              <div className="p-6 flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id_Warehouse</TableHead>
                    <TableHead>Warehouse_Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((w) => (
                    <TableRow key={w.Id_Warehouse}>
                      <TableCell>{w.Id_Warehouse}</TableCell>
                      <TableCell>{w.Warehouse_Name}</TableCell>
                      <TableCell>{w.Location || "-"}</TableCell>
                      <TableCell>{w.Code || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setForm({
                            Id_Warehouse: w.Id_Warehouse,
                            Warehouse_Name: w.Warehouse_Name || "",
                            Location: w.Location || "",
                            Code: w.Code || "",
                          }); setMode("edit") }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(w.Id_Warehouse)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No warehouses found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
