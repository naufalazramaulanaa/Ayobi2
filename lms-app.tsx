"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "./components/auth/login-form"
import { AppSidebar } from "./components/layout/app-sidebar"
import { StudentDashboard } from "./components/dashboard/student-dashboard"
import { AdminDashboard } from "./components/dashboard/admin-dashboard"
import { InstructorDashboard } from "./components/dashboard/instructor-dashboard"
import { CourseManagement } from "./components/course/course-management"
import { CourseCreator } from "./components/instructor/course-creator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { LandingPage } from "./components/landing/landing-page"
import { Footer } from "./components/layout/footer"
import { Certificates } from "./components/student/certificates"
import { StudentProgress } from "./components/student/progress"
import { ReviewerDashboard } from "./components/dashboard/reviewer-dashboard"
import { UserManagement } from "./components/admin/user-management"
import { RegisterForm } from "./components/auth/register-form"
import { CartProvider } from "./hooks/use-cart"

type UserRole = "admin" | "instructor" | "student" | "reviewer"

export default function LMSApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("student")
  const [userEmail, setUserEmail] = useState("")
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [darkMode, setDarkMode] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const [authMode, setAuthMode] = useState<"landing" | "login" | "register">("landing")

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

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
    setUserEmail(email)
    setUserRole(role)
    setIsAuthenticated(true)
    setAuthMode("landing")
  }

  const handleRegister = (email: string, role: UserRole) => {
    setUserEmail(email)
    setUserRole(role)
    setIsAuthenticated(true)
    setAuthMode("landing")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail("")
    setUserRole("student")
    setCurrentPage("dashboard")
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleShowLanding = () => {
    setShowLanding(true)
    setIsAuthenticated(false)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        if (userRole === "admin") return <AdminDashboard />
        if (userRole === "instructor") return <InstructorDashboard />
        if (userRole === "reviewer") return <ReviewerDashboard />
        return <StudentDashboard />
      case "create-course":
        return <CourseCreator />
      case "course-management":
        return <CourseManagement />
      case "user-management":
        return <UserManagement />
      case "certificates":
        return <Certificates />
      case "progress":
        return <StudentProgress />
      case "browse-courses":
        return <StudentDashboard />
      case "my-learning":
        return <StudentDashboard />
      default:
        return (
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-midnight-blue-800 mb-4">
                {currentPage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </h2>
              <p className="text-muted-foreground">This page is under development.</p>
            </div>
          </div>
        )
    }
  }

  const getPageTitle = () => {
    return currentPage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (authMode === "landing" && !isAuthenticated) {
    return <LandingPage onGetStarted={handleShowRegister} onSignIn={handleShowLogin} />
  }

  if (authMode === "login" && !isAuthenticated) {
    return (
      <LoginForm onLogin={handleLogin} onBackToLanding={handleBackToLanding} onSwitchToRegister={handleShowRegister} />
    )
  }

  if (authMode === "register" && !isAuthenticated) {
    return (
      <RegisterForm
        onRegister={handleRegister}
        onBackToLanding={handleBackToLanding}
        onSwitchToLogin={handleShowLogin}
      />
    )
  }

  return (
    <CartProvider>
      <div className={darkMode ? "dark" : ""}>
        <SidebarProvider>
          <AppSidebar
            userRole={userRole}
            userEmail={userEmail}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" onClick={() => handleNavigate("dashboard")}>
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPage !== "dashboard" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col">{renderCurrentPage()}</div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </CartProvider>
  )
}
