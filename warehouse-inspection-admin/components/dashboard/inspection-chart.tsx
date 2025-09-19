"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    month: "Jan",
    completed: 12,
    pending: 4,
    failed: 1,
  },
  {
    month: "Feb",
    completed: 15,
    pending: 3,
    failed: 2,
  },
  {
    month: "Mar",
    completed: 18,
    pending: 5,
    failed: 1,
  },
  {
    month: "Apr",
    completed: 14,
    pending: 6,
    failed: 3,
  },
  {
    month: "May",
    completed: 20,
    pending: 4,
    failed: 1,
  },
  {
    month: "Jun",
    completed: 16,
    pending: 7,
    failed: 2,
  },
]

export function InspectionChart() {
  return (
    <Card>
      {/*
      <CardHeader>
        <CardTitle>Inspection Trends</CardTitle>
        <CardDescription>Monthly inspection statistics over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#22c55e" name="Completed" />
            <Bar dataKey="pending" fill="#eab308" name="Pending" />
            <Bar dataKey="failed" fill="#ef4444" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>*/}
    </Card>
  )
}
