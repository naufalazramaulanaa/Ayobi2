"use client"

import type React from "react"

import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { useRouter } from "next/navigation"

interface PublicLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  showFooter?: boolean
}

export function PublicLayout({ children, showNavbar = true, showFooter = true }: PublicLayoutProps) {
  const router = useRouter()

  const handleSignIn = () => {
    router.push("/login")
  }

  const handleGetStarted = () => {
    router.push("/register")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showNavbar && <Navbar onSignIn={handleSignIn} onGetStarted={handleGetStarted} />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
