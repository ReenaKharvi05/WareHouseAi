// lib/auth.ts
import type { UserRole } from "./types"

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
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EmailId: credentials.email,    // ✅ map to backend schema
          Password: credentials.password,
        }),
      })

       const data = await response.json();
  // Save inspector ID (or user ID) to localStorage
  localStorage.setItem("id", data.id);
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Login failed")
      }

      // const data = await response.json()

      // Map backend response to frontend user object
      const user: AuthUser = {
        id: data.id,
        username: data.UserName,
        email: data.EmailId,
        role: data.Role,
        fullName: data.UserName,
      }

      // Backend doesn’t return token yet → use placeholder
      const token = "session_" + user.id

      localStorage.setItem(this.TOKEN_KEY, token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

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

// Simple role-based access
export function hasRole(user: AuthUser | null, requiredRoles: string[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

// Example: Only Admin & Manager can view reports
export function canViewReports(user: AuthUser | null): boolean {
  if (!user) return false
  return ["Admin", "Manager"].includes(user.role)
}

// Example: Inspectors can only conduct inspections
export function canConductInspection(user: AuthUser | null): boolean {
  if (!user) return false
  return user.role === "Inspector"
}

// Example: Admin full access
export function isAdmin(user: AuthUser | null): boolean {
  return !!user && user.role === "Admin"
}

// Example: Manager access
export function isManager(user: AuthUser | null): boolean {
  return !!user && user.role === "Manager"
}

// Example: Inspector access
export function isInspector(user: AuthUser | null): boolean {
  return !!user && user.role === "Inspector"
}