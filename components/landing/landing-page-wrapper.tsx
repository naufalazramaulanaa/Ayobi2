"use client"

import { useState } from "react"
import { LandingPageWithNavbar } from "./landing-page-with-navbar"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useRouter } from "next/navigation"

type AuthMode = "landing" | "login" | "register"
type UserRole = "admin" | "instructor" | "student" | "reviewer"

export function LandingPageWrapper() {
  const [authMode, setAuthMode] = useState<AuthMode>("landing")
  const router = useRouter()

  const handleShowLogin = () => {
    setAuthMode("login")
  }

  const handleShowRegister = () => {
    setAuthMode("register")
  }

  const handleBackToLanding = () => {
    setAuthMode("landing")
  }

  const handleLogin = (email: string, role: UserRole) => {
    // Store auth info
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)

    // Redirect to appropriate dashboard
    router.push(`/${role}/dashboard`)
  }

  const handleRegister = (email: string, role: UserRole) => {
    // Store auth info
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)

    // Redirect to appropriate dashboard
    router.push(`/${role}/dashboard`)
  }

  if (authMode === "login") {
    return (
      <LoginForm onLogin={handleLogin} onBackToLanding={handleBackToLanding} onSwitchToRegister={handleShowRegister} />
    )
  }

  if (authMode === "register") {
    return (
      <RegisterForm
        onRegister={handleRegister}
        onBackToLanding={handleBackToLanding}
        onSwitchToLogin={handleShowLogin}
      />
    )
  }

  return <LandingPageWithNavbar onGetStarted={handleShowRegister} onSignIn={handleShowLogin} />
}
