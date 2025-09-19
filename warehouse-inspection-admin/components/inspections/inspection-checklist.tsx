"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Upload, FileText, Loader2 } from "lucide-react"
import type { Inspection, InspectionResponse, RiskLevel } from "@/lib/types"
import { mockChecklists } from "@/lib/mock-data"

interface InspectionChecklistProps {
  inspection: Inspection
  onComplete: (responses: InspectionResponseData[], overallScore: number) => Promise<void>
  onCancel: () => void
}

interface InspectionResponseData {
  checklistItemId: number
  response: InspectionResponse
  notes?: string
  evidenceFiles?: string[]
}

export function InspectionChecklist({ inspection, onComplete, onCancel }: InspectionChecklistProps) {
  const checklist = mockChecklists.find((c) => c.id === inspection.checklistId)
  const [responses, setResponses] = useState<Record<number, InspectionResponseData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!checklist || !checklist.items) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Checklist not found or has no items.</AlertDescription>
      </Alert>
    )
  }

  const handleResponseChange = (itemId: number, response: InspectionResponse) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        checklistItemId: itemId,
        response,
      },
    }))
  }

  const handleNotesChange = (itemId: number, notes: string) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        checklistItemId: itemId,
        response: prev[itemId]?.response || "Pass",
        notes,
      },
    }))
  }

  const calculateProgress = () => {
    const totalItems = checklist.items!.length
    const completedItems = Object.keys(responses).length
    return (completedItems / totalItems) * 100
  }

  const calculateScore = () => {
    const totalItems = checklist.items!.length
    const passedItems = Object.values(responses).filter((r) => r.response === "Pass").length
    const naItems = Object.values(responses).filter((r) => r.response === "N/A").length

    // Calculate score based on applicable items (excluding N/A)
    const applicableItems = totalItems - naItems
    if (applicableItems === 0) return 100

    return (passedItems / applicableItems) * 100
  }

  const getRiskLevelColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskLevelIcon = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return <XCircle className="h-4 w-4" />
      case "High":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const handleSubmit = async () => {
    setError("")

    // Check if all required items are completed
    const requiredItems = checklist.items!.filter((item) => item.isRequired)
    const missingResponses = requiredItems.filter((item) => !responses[item.id])

    if (missingResponses.length > 0) {
      setError(`Please complete all required items. Missing: ${missingResponses.length} items.`)
      return
    }

    setIsSubmitting(true)
    try {
      const responseArray = Object.values(responses)
      const overallScore = calculateScore()
      await onComplete(responseArray, overallScore)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit inspection")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = calculateProgress()
  const score = calculateScore()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center ">
            <span>{checklist.name}</span>
            <Badge variant="outline">{checklist.items.length} Items</Badge>
          </CardTitle>
          <CardDescription>{checklist.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            {Object.keys(responses).length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Score</span>
                  <span
                    className={`text-sm font-semibold ${score >= 75 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {Math.round(score)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {checklist.items.map((item, index) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                    {item.itemText}
                    {item.isRequired && <span className="text-red-500">*</span>}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRiskLevelColor(item.riskLevel)}>
                    {getRiskLevelIcon(item.riskLevel)}
                    {item.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Response *</Label>
                <RadioGroup
                  value={responses[item.id]?.response || ""}
                  onValueChange={(value: InspectionResponse) => handleResponseChange(item.id, value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pass" id={`pass-${item.id}`} />
                    <Label htmlFor={`pass-${item.id}`} className="text-green-700 font-medium">
                      Pass
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Fail" id={`fail-${item.id}`} />
                    <Label htmlFor={`fail-${item.id}`} className="text-red-700 font-medium">
                      Fail
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N/A" id={`na-${item.id}`} />
                    <Label htmlFor={`na-${item.id}`} className="text-gray-600 font-medium">
                      N/A
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor={`notes-${item.id}`} className="text-sm font-medium">
                  Notes & Observations
                </Label>
                <Textarea
                  id={`notes-${item.id}`}
                  value={responses[item.id]?.notes || ""}
                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                  placeholder="Add detailed notes, observations, or corrective actions needed..."
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Evidence Files</Label>
                <div className="mt-1 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Evidence
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Photos, documents, or other evidence files</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 pt-4">
        <Button onClick={handleSubmit} disabled={isSubmitting || progress < 100}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Complete Inspection"
          )}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Save Draft & Exit
        </Button>
      </div>
    </div>
  )
}
