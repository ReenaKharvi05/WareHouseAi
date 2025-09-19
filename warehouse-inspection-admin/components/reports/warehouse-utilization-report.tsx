"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from "recharts"
import { Warehouse, Package, TrendingUp, AlertTriangle, Download } from "lucide-react"

const utilizationData = [
  { month: "Jan", centralA: 64, portB: 76, distC: 80 },
  { month: "Feb", centralA: 68, portB: 78, distC: 82 },
  { month: "Mar", centralA: 72, portB: 81, distC: 85 },
  { month: "Apr", centralA: 75, portB: 83, distC: 87 },
  { month: "May", centralA: 78, portB: 85, distC: 89 },
  { month: "Jun", centralA: 64, portB: 76, distC: 80 },
]

const warehouseDetails = [
  {
    name: "Central Warehouse A",
    location: "New York",
    capacity: 5000,
    current: 3200.5,
    utilization: 64.0,
    status: "Normal",
    trend: "stable",
  },
  {
    name: "Port Warehouse B",
    location: "Los Angeles",
    capacity: 8000,
    current: 6100.25,
    utilization: 76.3,
    status: "Normal",
    trend: "increasing",
  },
  {
    name: "Distribution Center C",
    location: "Chicago",
    capacity: 3500,
    current: 2800.75,
    utilization: 80.0,
    status: "High",
    trend: "increasing",
  },
]

interface WarehouseUtilizationReportProps {
  onExport: (format: string) => void
  onClose: () => void
}

export function WarehouseUtilizationReport({ onExport, onClose }: WarehouseUtilizationReportProps) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return "text-red-600"
    if (utilization >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-yellow-100 text-yellow-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Warehouse Utilization Report</h2>
          <p className="text-muted-foreground">Capacity analysis and storage efficiency metrics</p>
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
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16,500</div>
            <p className="text-xs text-muted-foreground">tons across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,101</div>
            <p className="text-xs text-muted-foreground">tons currently stored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">warehouse over 80% capacity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Utilization Trends</CardTitle>
            <CardDescription>Monthly capacity utilization by warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={utilizationData}>
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="centralA"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Central A"
                />
                <Area
                  type="monotone"
                  dataKey="portB"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Port B"
                />
                <Area
                  type="monotone"
                  dataKey="distC"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Dist C"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity Comparison</CardTitle>
            <CardDescription>Current utilization vs capacity by warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseDetails} layout="horizontal">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                <Bar dataKey="utilization" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Details</CardTitle>
          <CardDescription>Detailed capacity and utilization information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouseDetails.map((warehouse) => (
                <TableRow key={warehouse.name}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{warehouse.name}</div>
                      <div className="text-sm text-muted-foreground">{warehouse.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>{warehouse.capacity.toLocaleString()} tons</TableCell>
                  <TableCell>{warehouse.current.toLocaleString()} tons</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getUtilizationColor(warehouse.utilization)}`}>
                        {warehouse.utilization}%
                      </span>
                      <Progress value={warehouse.utilization} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(warehouse.status)}>{warehouse.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(warehouse.trend)}
                      <span className="text-sm capitalize">{warehouse.trend}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capacity Alerts & Recommendations</CardTitle>
          <CardDescription>Automated alerts and optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">High Utilization Alert</div>
                <div className="text-sm text-yellow-700">
                  Distribution Center C is at 80% capacity. Consider redistributing stock or expanding capacity.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Optimization Opportunity</div>
                <div className="text-sm text-blue-700">
                  Central Warehouse A has available capacity (36% free). Consider consolidating stock from other
                  locations.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <Package className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Efficient Operations</div>
                <div className="text-sm text-green-700">
                  Port Warehouse B maintains optimal utilization levels (76%) with good operational efficiency.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
