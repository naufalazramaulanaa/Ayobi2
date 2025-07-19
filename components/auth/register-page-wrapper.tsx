"use client"

import { useRouter } from "next/navigation"
import { RegisterForm } from "./register-form"

type UserRole = "admin" | "instructor" | "student" | "reviewer"

export function RegisterPageWrapper() {
  const router = useRouter()

  const handleRegister = (email: string, role: UserRole) => {
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

  const handleSwitchToLogin = () => {
    router.push("/login")
  }

  return (
    <RegisterForm
      onRegister={handleRegister}
      onBackToLanding={handleBackToLanding}
      onSwitchToLogin={handleSwitchToLogin}
    />
  )
}
