import type { DashboardStats } from "@/lib/types"
import type { Warehouse } from "@/lib/types"
import type { Commodity } from "@/lib/types"
import axios from "axios"

export async function fetchDashboardStats(): Promise<DashboardStats> {
  // Fetch in parallel
  const [inspectionsRes, warehousesRes, inspectorsRes, managersRes, averageRes] =
    await Promise.all([
      fetch("http://127.0.0.1:8000/inspections/counts"),
      fetch("http://127.0.0.1:8000/warehouses/count"),
      fetch("http://127.0.0.1:8000/inspectors/count"),
      fetch("http://127.0.0.1:8000/managers/count"),
      fetch("http://127.0.0.1:8000/inspections/average"),
    ])

  if (!inspectionsRes.ok || !warehousesRes.ok || !inspectorsRes.ok || !managersRes.ok || !averageRes.ok) {
    throw new Error("Failed to fetch dashboard stats")
  }

  const inspections = await inspectionsRes.json()
  const warehouses = await warehousesRes.json()
  const inspectors = await inspectorsRes.json()
  const managers = await managersRes.json()
  const average = await averageRes.json()

  return {
    totalInspections: inspections.TotalInspections,
    pendingInspections: inspections.Pending,
    completedInspections: inspections.Completed,
    inProgressInspections: inspections.InProgress,
    totalWarehouses: warehouses.count,
    activeInspectors: inspectors.count,
    activeManagers: managers.count,
    averageScore: average.average,
    recentInspections: [],
  }
}
export async function fetchInspectorWarehouses(inspectorId: number): Promise<Warehouse[]> {
  const res = await fetch(`http://127.0.0.1:8000/inspectors/${inspectorId}/warehouses`)
  if (!res.ok) throw new Error("Failed to fetch warehouses")
  return res.json()
}

export async function fetchCommodities(): Promise<Commodity[]> {
  const res = await fetch("http://127.0.0.1:8000/commoditiess")
  if (!res.ok) throw new Error("Failed to fetch commodities")

  const data = await res.json()

  // 🔄 Map DB fields → UI fields
  return data.map((c: any) => ({
    id: c.IdCommodity,
    Commodity_Name: c.Commodity_Name,
    Storage: c.CommodityStorage,
    Category: c.Category || "",
    Description: c.Description || "",
    Unit: c.Unit || "Kg",
    IsActive: true,
    CreatedAt: new Date().toISOString(),
  }))
}

// -------------------- Warehouses CRUD (Axios) --------------------
export interface ApiWarehouse {
  Id_Warehouse: number
  Warehouse_Name: string
  Location: string | null
  Code: string | null
}

export interface CreateApiWarehouse {
  Warehouse_Name: string
  Location?: string
  Code?: string
}

const api = axios.create({ baseURL: "http://localhost:8000" })

export async function getWarehouses(): Promise<ApiWarehouse[]> {
  const { data } = await api.get<ApiWarehouse[]>("/warehouses/")
  return data
}

export async function getWarehouse(id: number): Promise<ApiWarehouse> {
  const { data } = await api.get<ApiWarehouse>(`/warehouses/${id}`)
  return data
}

export async function createWarehouse(payload: CreateApiWarehouse): Promise<ApiWarehouse> {
  const { data } = await api.post<ApiWarehouse>("/warehouses/", payload)
  return data
}

export async function updateWarehouse(id: number, payload: CreateApiWarehouse): Promise<ApiWarehouse> {
  const { data } = await api.put<ApiWarehouse>(`/warehouses/${id}`, payload)
  return data
}

export async function deleteWarehouse(id: number): Promise<void> {
  await api.delete(`/warehouses/${id}`)
}

// -------------------- Users CRUD (Axios) --------------------
export interface ApiUser {
  idusers: number
  UserName: string
  Full_Name: string | null
  Role: string
  EmailId: string | null
  Is_Active: number | null
}

export interface CreateApiUser {
  UserName: string
  Full_Name?: string
  Role: string
  EmailId?: string
  Password: string
  Is_Active?: number
}

export interface UpdateApiUser {
  UserName?: string
  Full_Name?: string
  Role?: string
  EmailId?: string
  Password?: string
  Is_Active?: number
}

export async function getUsers(params?: { role?: string; active?: number }): Promise<ApiUser[]> {
  const { data } = await api.get<ApiUser[]>("/users/", { params })
  return data
}

export async function createUser(payload: CreateApiUser): Promise<ApiUser> {
  const { data } = await api.post<ApiUser>("/users/", payload)
  return data
}

export async function updateUser(id: number, payload: UpdateApiUser): Promise<ApiUser> {
  const { data } = await api.put<ApiUser>(`/users/${id}`, payload)
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}

// -------------------- Commodities CRUD (Axios, port 8080) --------------------
export interface ApiCommodity {
  IdCommodity: number
  Commodity_Name: string
  CommodityStorage: string | null
  Category?: string | null
  Description?: string | null
  IsActive?: number | null
  CreatedAt?: string | null
}

export interface CreateApiCommodity {
  Commodity_Name: string
  CommodityStorage?: string
  Category?: string
  Description?: string
  IsActive?: number
}

export interface UpdateApiCommodity extends Partial<CreateApiCommodity> {}

const commoditiesApi = axios.create({ baseURL: "http://127.0.0.1:8000" })

export async function getCommodities(params?: { name?: string; category?: string; storage?: string; active?: number }): Promise<ApiCommodity[]> {
  const { data } = await commoditiesApi.get<ApiCommodity[]>("/commodities", { params })
  return data
}

export async function createCommodity(payload: CreateApiCommodity): Promise<ApiCommodity> {
  const { data } = await commoditiesApi.post<ApiCommodity>("/commodities", payload)
  return data
}

export async function updateCommodity(id: number, payload: UpdateApiCommodity): Promise<ApiCommodity> {
  const { data } = await commoditiesApi.put<ApiCommodity>(`/commodities/${id}`, payload)
  return data
}

export async function deleteCommodity(id: number): Promise<void> {
  await commoditiesApi.delete(`/commodities/${id}`)
}