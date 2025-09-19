// Mock data for development and testing

import type {
  User,
  Warehouse,
  Commodity,
  InspectionChecklist,
  ChecklistItem,
  Inspection,
  DashboardStats,
} from "./types"

export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@warehouse.com",
    fullName: "System Administrator",
    role: "Admin",
    phone: "+1234567890",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    username: "inspector1",
    email: "john.doe@warehouse.com",
    fullName: "John Doe",
    role: "Inspector",
    phone: "+1234567891",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    username: "inspector2",
    email: "jane.smith@warehouse.com",
    fullName: "Jane Smith",
    role: "Inspector",
    phone: "+1234567892",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    username: "manager1",
    email: "mike.johnson@warehouse.com",
    fullName: "Mike Johnson",
    role: "Manager",
    phone: "+1234567893",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockWarehouses: Warehouse[] = [
  {
    id: 1,
    name: "Central Warehouse A",
    location: "New York",
    address: "123 Industrial Ave, New York, NY 10001",
    managerId: 4,
    capacityTons: 5000.0,
    currentStockTons: 3200.5,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Port Warehouse B",
    location: "Los Angeles",
    address: "456 Harbor Blvd, Los Angeles, CA 90001",
    managerId: 4,
    capacityTons: 8000.0,
    currentStockTons: 6100.25,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Distribution Center C",
    location: "Chicago",
    address: "789 Logistics Dr, Chicago, IL 60601",
    managerId: 4,
    capacityTons: 3500.0,
    currentStockTons: 2800.75,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockCommodities: Commodity[] = [
  {
    id: 1,
    name: "Wheat",
    category: "Grain",
    description: "High-quality wheat for food production",
    unit: "tons",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Corn",
    category: "Grain",
    description: "Yellow corn for feed and food processing",
    unit: "tons",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Rice",
    category: "Grain",
    description: "Long grain white rice",
    unit: "tons",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Steel Coils",
    category: "Metal",
    description: "Cold-rolled steel coils for manufacturing",
    unit: "tons",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export const mockChecklistItems: ChecklistItem[] = [
  {
    id: 1,
    checklistId: 1,
    itemText: "Check for moisture content within acceptable limits",
    riskLevel: "High",
    isRequired: true,
    orderIndex: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    checklistId: 1,
    itemText: "Inspect for pest infestation or damage",
    riskLevel: "Critical",
    isRequired: true,
    orderIndex: 2,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    checklistId: 1,
    itemText: "Verify proper ventilation systems are functioning",
    riskLevel: "Medium",
    isRequired: true,
    orderIndex: 3,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export const mockChecklists: InspectionChecklist[] = [
  {
    id: 1,
    name: "Grain Quality Inspection",
    description: "Standard quality check for grain commodities",
    commodityId: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    items: mockChecklistItems,
  },
  {
    id: 2,
    name: "Metal Storage Inspection",
    description: "Safety and quality check for metal products",
    commodityId: 4,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "General Warehouse Inspection",
    description: "Basic warehouse condition and safety check",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export const mockInspections: Inspection[] = [
  {
    id: 1,
    warehouseId: 1,
    commodityId: 1,
    inspectorId: 2,
    checklistId: 1,
    inspectionDate: "2024-01-15",
    status: "Completed",
    overallScore: 85.5,
    notes: "Good overall condition, minor ventilation issues noted",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    warehouseId: 2,
    commodityId: 4,
    inspectorId: 3,
    checklistId: 2,
    inspectionDate: "2024-01-16",
    status: "Completed",
    overallScore: 92.0,
    notes: "Excellent storage conditions and safety measures",
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
  {
    id: 3,
    warehouseId: 1,
    commodityId: 2,
    inspectorId: 2,
    checklistId: 1,
    inspectionDate: "2024-01-17",
    status: "In Progress",
    notes: "Inspection ongoing",
    createdAt: "2024-01-17T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
  },
  {
    id: 4,
    warehouseId: 3,
    commodityId: 3,
    inspectorId: 3,
    checklistId: 1,
    inspectionDate: "2024-01-18",
    status: "Pending",
    notes: "Scheduled for inspection",
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
]

export const mockDashboardStats: DashboardStats = {
  totalInspections: 24,
  pendingInspections: 6,
  completedInspections: 16,
  failedInspections: 2,
  totalWarehouses: 3,
  activeInspectors: 2,
  averageScore: 87.5,
  recentInspections: mockInspections.slice(0, 5),
}

// Helper functions for mock data
export const getUserById = (id: number): User | undefined => {
  return mockUsers.find((user) => user.id === id)
}

export const getWarehouseById = (id: number): Warehouse | undefined => {
  return mockWarehouses.find((warehouse) => warehouse.id === id)
}

export const getCommodityById = (id: number): Commodity | undefined => {
  return mockCommodities.find((commodity) => commodity.id === id)
}

export const getChecklistById = (id: number): InspectionChecklist | undefined => {
  return mockChecklists.find((checklist) => checklist.id === id)
}

export const getInspectionsByStatus = (status: string): Inspection[] => {
  return mockInspections.filter((inspection) => inspection.status === status)
}

export const getInspectionsByInspector = (inspectorId: number): Inspection[] => {
  return mockInspections.filter((inspection) => inspection.inspectorId === inspectorId)
}
