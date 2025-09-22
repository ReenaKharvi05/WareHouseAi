"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EditInspectionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = Number(params.id)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Inspection #{isFinite(id) ? id : ""}</h1>
        <Button variant="outline" onClick={() => router.back()} className="bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            This is a placeholder for the inspection edit form. Share the edit page context and fields, and I will implement the full editor here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
