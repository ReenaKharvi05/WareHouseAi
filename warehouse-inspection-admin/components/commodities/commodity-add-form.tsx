"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createCommodity } from "@/lib/api"

interface CommodityAddFormProps {
  onSuccess?: () => void
}

export default function CommodityAddForm({ onSuccess }: CommodityAddFormProps) {
  const [open, setOpen] = useState(false)
  const [newCommodity, setNewCommodity] = useState({
    Commodity_Name: "",
    CommodityStorage: "Normal",
    Category: "",
    Description: "",
    IsActive: 1,
  })

  const handleAdd = async () => {
    try {
      await createCommodity(newCommodity)
      setNewCommodity({
        Commodity_Name: "",
        CommodityStorage: "Normal",
        Category: "",
        Description: "",
        IsActive: 1,
      })
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Commodity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Commodity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input
              value={newCommodity.Commodity_Name}
              onChange={(e) => setNewCommodity({ ...newCommodity, Commodity_Name: e.target.value })}
            />
          </div>
          <div>
            <Label>Storage</Label>
            <Select
              value={newCommodity.CommodityStorage}
              onValueChange={(val) => setNewCommodity({ ...newCommodity, CommodityStorage: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={newCommodity.Category}
              onChange={(e) => setNewCommodity({ ...newCommodity, Category: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={newCommodity.Description}
              onChange={(e) => setNewCommodity({ ...newCommodity, Description: e.target.value })}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={String(newCommodity.IsActive)}
              onValueChange={(val) => setNewCommodity({ ...newCommodity, IsActive: Number(val) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
