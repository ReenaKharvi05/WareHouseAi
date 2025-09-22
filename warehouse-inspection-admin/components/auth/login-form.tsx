"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError("Please enter your password")
      setIsLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const { user } = await login({ email, password })
      
      if (!user) {
        setError("Invalid credentials. Please check your email and password.")
        setIsLoading(false)
        return
      }

      const role = user.role?.trim().toLowerCase()

      if (role === "admin") {
        setIsRedirecting(true)
        router.push("/dashboard")
      } else if (role === "inspector") {
        setIsRedirecting(true)
        router.push("/inspector/dashboard")
      } else if (role === "manager") {
        setIsRedirecting(true)
        router.push("/dashboard")
      } else {
        setIsRedirecting(true)
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      
      // Handle different types of errors
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase()
        
        if (errorMessage.includes("unauthorized") || errorMessage.includes("invalid credentials") || errorMessage.includes("401")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
          setError("Network error. Please check your internet connection and try again.")
        } else if (errorMessage.includes("timeout")) {
          setError("Request timeout. Please try again.")
        } else if (errorMessage.includes("user not found") || errorMessage.includes("404")) {
          setError("No account found with this email address.")
        } else if (errorMessage.includes("account disabled") || errorMessage.includes("suspended")) {
          setError("Your account has been disabled. Please contact support.")
        } else {
          setError(err.message || "Login failed. Please try again.")
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      // Error case: stop loading states
      setIsLoading(false)
      setIsRedirecting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Warehouse Inspection</CardTitle>
          <CardDescription>Sign in to access the panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="text"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Email"
                required
                disabled={isLoading || isRedirecting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading || isRedirecting}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50 duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || isRedirecting} aria-busy={isLoading || isRedirecting}>
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
