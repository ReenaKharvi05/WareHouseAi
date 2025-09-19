// lib/auth.ts
import type { UserRole } from "./types"
import { login as apiLogin } from "./api"

export interface AuthUser {
  id: number
  username: string
  email: string
  fullName?: string
  role: string
}

export interface LoginCredentials {
  email: string   // frontend stays simple
  password: string
}

export class AuthService {
  private static readonly TOKEN_KEY = "warehouse_auth_token"
  private static readonly USER_KEY = "warehouse_auth_user"

  static async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    try {
      const data = await apiLogin(credentials.email, credentials.password)
      const user: AuthUser = {
        id: data.id,
        username: data.UserName,
        email: data.EmailId,
        role: data.Role,
        fullName: data.UserName,
      }
      const token = data.token || `session_${user.id}`
      localStorage.setItem(this.TOKEN_KEY, token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      // compatibility keys used elsewhere in the app
      localStorage.setItem("token", token)
      localStorage.setItem("id", String(user.id))
      return { user, token }
    } catch (err: any) {
      throw new Error(err.message || "Unable to login")
    }
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  static getCurrentUser(): AuthUser | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  }
}

export function hasRole(user: AuthUser | null, requiredRoles: string[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

export function canViewReports(user: AuthUser | null): boolean {
  if (!user) return false
  return ["Admin", "Manager"].includes(user.role)
}

export function canConductInspection(user: AuthUser | null): boolean {
  if (!user) return false
  return user.role === "Inspector"
}

export function isAdmin(user: AuthUser | null): boolean {
  return !!user && user.role === "Admin"
}

export function isManager(user: AuthUser | null): boolean {
  return !!user && user.role === "Manager"
}

export function isInspector(user: AuthUser | null): boolean {
  return !!user && user.role === "Inspector"
}