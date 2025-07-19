import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"
import { LiveChatButton } from "@/components/live-chat-button"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { LanguageProvider } from "@/hooks/use-language" // ✅ Tambahkan import ini

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduLMS - Learning Management System",
  description: "A comprehensive learning management system for students, instructors, and administrators",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider> 
            <CartProvider>
              {children}
              <LiveChatButton />
              <Toaster />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
