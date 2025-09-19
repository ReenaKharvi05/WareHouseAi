"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Download, CheckCircle, XCircle, Clock } from "lucide-react"

const monthlyData = [
  { month: "Jan", completed: 12, pending: 4, failed: 1, avgScore: 85.2 },
  { month: "Feb", completed: 15, pending: 3, failed: 2, avgScore: 87.1 },
  { month: "Mar", completed: 18, pending: 5, failed: 1, avgScore: 89.3 },
  { month: "Apr", completed: 14, pending: 6, failed: 3, avgScore: 82.7 },
  { month: "May", completed: 20, pending: 4, failed: 1, avgScore: 91.2 },
  { month: "Jun", completed: 16, pending: 7, failed: 2, avgScore: 88.5 },
]

const statusData = [
  { name: "Completed", value: 85, color: "#22c55e" },
  { name: "Pending", value: 12, color: "#eab308" },
  { name: "Failed", value: 3, color: "#ef4444" },
]

const warehousePerformance = [
  { warehouse: "Central Warehouse A", inspections: 24, avgScore: 89.2, trend: "up" },
  { warehouse: "Port Warehouse B", inspections: 18, avgScore: 92.1, trend: "up" },
  { warehouse: "Distribution Center C", inspections: 15, avgScore: 84.7, trend: "down" },
]

interface InspectionPerformanceReportProps {
  onExport: (format: string) => void
  onClose: () => void
}

export function InspectionPerformanceReport({ onExport, onClose }: InspectionPerformanceReportProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inspection Performance Report</h2>
          <p className="text-muted-foreground">Comprehensive analysis of inspection activities and outcomes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onExport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => onExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1.8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Inspection Trends</CardTitle>
            <CardDescription>Inspection volume and completion rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="pending" fill="#eab308" name="Pending" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Trends</CardTitle>
            <CardDescription>Average inspection scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis domain={[75, 95]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={3} name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current inspection status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Warehouse Performance</CardTitle>
            <CardDescription>Performance metrics by warehouse location</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Inspections</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehousePerformance.map((warehouse) => (
                  <TableRow key={warehouse.warehouse}>
                    <TableCell className="font-medium">{warehouse.warehouse}</TableCell>
                    <TableCell>{warehouse.inspections}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{warehouse.avgScore}%</span>
                        <Progress value={warehouse.avgScore} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {warehouse.trend === "up" ? (
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Improving
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <TrendingDown className="mr-1 h-3 w-3" />
                          Declining
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>Automated analysis and suggested actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Strong Performance</div>
                <div className="text-sm text-green-700">
                  Port Warehouse B shows consistently high scores (92.1% average) and improving trends.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Attention Required</div>
                <div className="text-sm text-yellow-700">
                  Distribution Center C shows declining performance. Consider additional training or process review.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Positive Trend</div>
                <div className="text-sm text-blue-700">
                  Overall completion rate has improved by 2.3% this month, indicating better scheduling and resource
                  allocation.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
