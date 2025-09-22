"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { softDeleteCommodity, type ApiCommodity } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"

interface CommodityActionsProps {
  commodity: ApiCommodity
  onEdit: (commodity: ApiCommodity) => void
  onDeleted: () => void
}

export default function CommodityActions({ commodity, onEdit, onDeleted }: CommodityActionsProps) {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
const [editCommodity, setEditCommodity] = useState<ApiCommodity | null>(null)


  const handleDelete = async () => {
    await softDeleteCommodity(commodity.IdCommodity)
    setOpen(false)
    onDeleted()
  }
  const handleEdit = (commodity: ApiCommodity) => {
  setEditCommodity(commodity)
  setEditOpen(true) // open the edit form/modal
}


  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(commodity)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <span>Delete Commodity</span>
          </DialogHeader>
          <p>Are you sure you want to delete <b>{commodity.Commodity_Name}</b>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}