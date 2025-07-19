"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Footer } from "./footer"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ReviewerLayoutWrapperProps {
  children: React.ReactNode
}

export function ReviewerLayoutWrapper({ children }: ReviewerLayoutWrapperProps) {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [userEmail, setUserEmail] = useState("reviewer@demo.com")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userRole = localStorage.getItem("userRole")

    if (!isAuthenticated || userRole !== "reviewer") {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleNavigate = (page: string) => {
    router.push(`/reviewer/${page}`)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  if (isMobile) {
    return (
      <div className={darkMode ? "dark" : ""}>
        {/* Mobile Layout */}
        <div className="min-h-screen bg-gray-50">
          {/* Mobile Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-midnight-blue-800">Reviewer Dashboard</h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </header>

          {/* Mobile Sidebar */}
          <AppSidebar
            userRole="reviewer"
            userEmail={userEmail}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            isMobile={true}
            isOpen={mobileMenuOpen}
            onClose={closeMobileMenu}
          />

          {/* Mobile Content */}
          <main className="p-4">{children}</main>

          <Footer />
        </div>
      </div>
    )
  }

  // Desktop Layout
  return (
    <div className={darkMode ? "dark" : ""}>
      <SidebarProvider>
        <AppSidebar
          userRole="reviewer"
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/reviewer/dashboard">Reviewer Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
