"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Package, CheckCircle, XCircle, AlertTriangle, Edit } from "lucide-react"
import type { Inspection } from "@/lib/types"
import { mockWarehouses, mockCommodities, mockUsers, mockChecklists } from "@/lib/mock-data"

interface InspectionDetailsProps {
  inspection: Inspection
  onEdit?: () => void
  onClose: () => void
}

export function InspectionDetails({ inspection, onEdit, onClose }: InspectionDetailsProps) {
  const warehouse = mockWarehouses.find((w) => w.id === inspection.warehouseId)
  const commodity = mockCommodities.find((c) => c.id === inspection.commodityId)
  const inspector = mockUsers.find((u) => u.id === inspection.inspectorId)
  const checklist = mockChecklists.find((c) => c.id === inspection.checklistId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground"
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  // Mock checklist responses for demonstration
  const mockResponses = [
    {
      item: "Check for moisture content within acceptable limits",
      response: "Pass",
      notes: "Moisture levels at 12.5%, within acceptable range of 10-14%",
      riskLevel: "High",
    },
    {
      item: "Inspect for pest infestation or damage",
      response: "Fail",
      notes: "Found evidence of rodent activity in northeast corner. Immediate action required.",
      riskLevel: "Critical",
    },
    {
      item: "Verify proper ventilation systems are functioning",
      response: "Pass",
      notes: "All ventilation fans operational, airflow adequate",
      riskLevel: "Medium",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inspection Details</h2>
          <p className="text-muted-foreground">Inspection #{inspection.id}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inspection Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{warehouse?.name}</div>
                <div className="text-sm text-muted-foreground">{warehouse?.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{commodity?.name}</div>
                <div className="text-sm text-muted-foreground">{commodity?.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{inspector?.fullName}</div>
                <div className="text-sm text-muted-foreground">{inspector?.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{new Date(inspection.inspectionDate).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">Inspection Date</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status & Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
            </div>
            {inspection.overallScore && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall Score</div>
                <div className={`text-2xl font-bold ${getScoreColor(inspection.overallScore)}`}>
                  {inspection.overallScore}%
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground mb-1">Checklist Used</div>
              <div className="font-medium">{checklist?.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Created</div>
              <div className="text-sm">{new Date(inspection.createdAt).toLocaleString()}</div>
            </div>
            {inspection.updatedAt !== inspection.createdAt && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                <div className="text-sm">{new Date(inspection.updatedAt).toLocaleString()}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {inspection.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{inspection.notes}</p>
          </CardContent>
        </Card>
      )}

      {inspection.status === "Completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inspection Results</CardTitle>
            <CardDescription>Detailed responses for each checklist item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResponses.map((response, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="font-medium">{response.item}</div>
                      <Badge
                        variant="outline"
                        className={
                          response.riskLevel === "Critical"
                            ? "bg-red-100 text-red-800"
                            : response.riskLevel === "High"
                              ? "bg-orange-100 text-orange-800"
                              : response.riskLevel === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {response.riskLevel} Risk
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {response.response === "Pass" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : response.response === "Fail" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                      )}
                      <Badge
                        className={
                          response.response === "Pass"
                            ? "bg-green-100 text-green-800"
                            : response.response === "Fail"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {response.response}
                      </Badge>
                    </div>
                  </div>
                  {response.notes && (
                    <>
                      <Separator className="my-3" />
                      <div>
                        <div className="text-sm font-medium mb-1">Notes:</div>
                        <p className="text-sm text-muted-foreground">{response.notes}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
