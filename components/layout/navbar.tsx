"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  Sun,
  Moon,
  Play,
  Globe,
  Check,
  ShoppingCart,
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/about", label: t("about") },
  ]

  const languages = [
    { code: "id", name: t("indonesian"), flag: "🇮🇩", shortCode: "ID" },
    { code: "en", name: t("english"), flag: "🇺🇸", shortCode: "US" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  const linkTextClass = scrolled
    ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    : "text-white hover:text-gray-200"

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-white dark:bg-gray-900 shadow-md backdrop-blur-md saturate-150"
          : "bg-transparent shadow-none backdrop-blur-md bg-opacity-30 saturate-150"
      }`}
    >
      <div className="w-full">
        <div className="relative flex items-center justify-between h-24 px-6 lg:px-12">
          
          {/* === Logo (Kiri) === */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/ayobii.png" alt="AyobiLMS Logo" className="h-28 w-28" />
            </Link>
          </div>

          {/* === Menu Tengah === */}
          <div className="absolute left-1/2 -translate-x-1/2 flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkTextClass} text-lg font-medium`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" className={`${linkTextClass} text-lg py-3`}>
              <Play className="mr-2 w-4 h-4" />
              {t("demo")}
            </Button>
          </div>

          {/* === Aksi Kanan === */}
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`${linkTextClass} text-lg px-2 py-3`}>
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {currentLanguage?.shortCode}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as "id" | "en")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {language === lang.code && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={`${linkTextClass} px-2 py-3`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Link href="/login">
              <Button variant="ghost" className={`font-medium ${linkTextClass} text-lg py-3`}>
                {t("login")}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium text-lg h-11 px-6">
                {t("signUp")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
