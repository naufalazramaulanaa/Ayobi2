"use client"
import { ReactNode, useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark"
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  // Agar bisa diakses dari komponen lain jika perlu
  return (
    <div>
      <input type="checkbox" hidden id="theme-toggle" checked={isDarkMode} readOnly />
      {children}
    </div>
  )
}
