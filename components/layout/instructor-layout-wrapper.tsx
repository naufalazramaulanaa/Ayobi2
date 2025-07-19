"use client"

import type React from "react"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
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
import { Footer } from "./footer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "../ui/button"
import { UserPlus } from "lucide-react"
import { useRouter } from "next/navigation" // To handle navigation

interface InstructorLayoutWrapperProps {
  children: React.ReactNode
}

export function InstructorLayoutWrapper({ children }: InstructorLayoutWrapperProps) {
  const [darkMode, setDarkMode] = useState(false)
  const isMobile = useIsMobile()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const router = useRouter()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleNavigate = (page: string) => {
    if (page === "student/dashboard") {
      // Navigate to the student dashboard
      router.push("/student/dashboard")
    } else {
      // Navigate to other instructor pages
      window.location.href = `/instructor/${page}`
    }
  }

  if (isMobile) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 md:hidden">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-midnight-blue-800 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="font-semibold text-midnight-blue-800">EduLMS</span>
          </div>
        </header>

        <AppSidebar
          userRole="instructor"
          userEmail="instructor@demo.com"
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4">{children}</main>

        <Footer />
      </div>
    )
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <SidebarProvider>
        <AppSidebar
          userRole="instructor"
          userEmail="instructor@demo.com"
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
                  <BreadcrumbLink href="/instructor/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Instructor Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center">
              <Button
                onClick={() => handleNavigate("student/dashboard")} // This will redirect to the student dashboard
                className="bg-midnight-blue-800 text-white hover:bg-midnight-blue-900 text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Switch to Student
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
