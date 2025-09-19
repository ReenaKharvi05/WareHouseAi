 "use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getQuestions, createInspectionWithAnswers, uploadEvidence } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AnswerDraft {
  answer?: string
  remarks?: string
  file?: File | null
}

export default function InspectionFormPage() {
  const params = useParams() as { id: string; commodityId: string }
  const router = useRouter()
  const warehouseId = Number(params.id)
  const commodityId = Number(params.commodityId)

  const { data: questions = [], isLoading } = useQuery({ queryKey: ["questions"], queryFn: getQuestions })

  const [answers, setAnswers] = useState<Record<number, AnswerDraft>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {}
    for (const q of questions) {
      const key = (q.category || "General").toString()
      if (!groups[key]) groups[key] = []
      groups[key].push(q)
    }
    return groups
  }, [questions])

  const handleAnswer = (qid: number, patch: Partial<AnswerDraft>) => {
    setAnswers((prev) => ({ ...prev, [qid]: { ...(prev[qid] || {}), ...patch } }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)
    try {
      const inspectorId = Number(localStorage.getItem("id"))
      if (!inspectorId) throw new Error("Inspector not logged in")
      const answerList = Object.entries(answers).map(([qid, a]) => ({ question_id: Number(qid), answer: a.answer || "", remarks: a.remarks || "" }))
      const { inspection_id } = await createInspectionWithAnswers({
        warehouse_id: warehouseId,
        commodity_id: commodityId,
        inspector_id: inspectorId,
        answers: answerList,
      })
      // upload evidence files serially to simplify
      for (const [qidStr, a] of Object.entries(answers)) {
        if (a.file) {
          await uploadEvidence(inspection_id, a.file)
        }
      }
      setSuccess("Inspection submitted successfully")
      setTimeout(() => router.push("/inspector/dashboard"), 1200)
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401) {
        setError("Unauthorized. Please log in as an Inspector and try again.")
      } else if (status === 403) {
        setError("Forbidden. Only inspectors can create inspections.")
      } else {
        setError(err?.message || "Failed to submit inspection")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <p className="p-6">Loading questions...</p>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inspection Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <Accordion type="multiple" className="w-full">
              {Object.entries(grouped).map(([category, qs]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-left">{category}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      {qs.map((q: any, idx: number) => (
                        <div key={q.id} className="border p-4 rounded-md space-y-3">
                          <div className="font-medium">{q.text}</div>
                          <div>
                            <Label className="mb-2 block">Response</Label>
                            <RadioGroup
                              value={answers[q.id]?.answer || ""}
                              onValueChange={(v) => handleAnswer(q.id, { answer: v })}
                              className="flex items-center gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id={`yes-${q.id}`} />
                                <Label htmlFor={`yes-${q.id}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id={`no-${q.id}`} />
                                <Label htmlFor={`no-${q.id}`}>No</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NA" id={`na-${q.id}`} />
                                <Label htmlFor={`na-${q.id}`}>N/A</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div>
                            <Label className="mb-2 block">Remarks</Label>
                            <Textarea
                              value={answers[q.id]?.remarks || ""}
                              onChange={(e) => handleAnswer(q.id, { remarks: e.target.value })}
                              placeholder="Enter remarks"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Evidence</Label>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleAnswer(q.id, { file: e.target.files?.[0] || null })}
                              className="block"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Inspection"}
            </Button>
    </form>
        </CardContent>
      </Card>
    </div>
  )
}
