"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "./login-form"

type UserRole = "admin" | "instructor" | "student" | "reviewer"

export function LoginPageWrapper() {
  const router = useRouter()

  const handleLogin = (email: string, role: UserRole) => {
    // Store authentication state
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)

    // Redirect based on role
    router.push(`/${role}/dashboard`)
  }

  const handleBackToLanding = () => {
    router.push("/")
  }

  const handleSwitchToRegister = () => {
    router.push("/register")
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onBackToLanding={handleBackToLanding}
      onSwitchToRegister={handleSwitchToRegister}
    />
  )
}
