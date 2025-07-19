'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

useEffect(() => {
  const html = document.documentElement
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    html.classList.add("dark")
  } else {
    html.classList.remove("dark")
  }
}, [])


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
