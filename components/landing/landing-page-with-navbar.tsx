"use client"

import { Navbar } from "@/components/layout/navbar"
import { LandingPage } from "./landing-page"

interface LandingPageWithNavbarProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export function LandingPageWithNavbar({ onGetStarted, onSignIn }: LandingPageWithNavbarProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <LandingPage onGetStarted={onGetStarted} onSignIn={onSignIn} />
    </div>
  )
}
