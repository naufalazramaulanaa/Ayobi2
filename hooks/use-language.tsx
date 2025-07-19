"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "id" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  id: {
    // Navigation
    home: "Beranda",
    courses: "Kursus",
    about: "Tentang",
    contact: "Kontak",
    demo: "Demo",
    login: "Masuk",
    signUp: "Daftar",
    language: "Bahasa",
    indonesian: "Bahasa Indonesia",
    english: "English",

    // Common
    search: "Cari",
    filter: "Filter",
    save: "Simpan",
    cancel: "Batal",
    edit: "Edit",
    delete: "Hapus",
    view: "Lihat",

    // Dashboard
    dashboard: "Dashboard",
    profile: "Profil",
    settings: "Pengaturan",
    analytics: "Analitik",
    reports: "Laporan",

    // Course Related
    myCourses: "Kursus Saya",
    browseCourses: "Jelajahi Kursus",
    createCourse: "Buat Kursus",
    courseManagement: "Manajemen Kursus",
    students: "Siswa",
    instructors: "Instruktur",

    // Cart & Payment
    addToCart: "Tambah ke Keranjang",
    cart: "Keranjang",
    checkout: "Checkout",
    payment: "Pembayaran",
    paymentGateway: "Gateway Pembayaran",
    paymentMethods: "Metode Pembayaran",

    // User Management
    userManagement: "Manajemen Pengguna",
    adminPanel: "Panel Admin",

    // Landing Page
    leadingLearningPlatform: "Platform Pembelajaran Terdepan",
    learnWithoutLimits: "Belajar Tanpa Batas,",
    achieveYourDreams: "Wujudkan Impian Anda",
    joinThousands:
      "Bergabunglah dengan ribuan pelajar yang telah mengubah karir mereka melalui kursus online berkualitas tinggi dari instruktur terbaik dunia.",
    startLearningFree: "Mulai Belajar Gratis",
    watchDemo: "Tonton Demo",
    freeToStart: "Gratis untuk memulai",
    officialCertificates: "Sertifikat resmi",
    lifetimeAccess: "Akses seumur hidup",
    studentsEnrolled: "Siswa Terdaftar",
    expertInstructors: "Instruktur Ahli",
    premiumCourses: "Kursus Premium",
    successRate: "Tingkat Keberhasilan",
  },
  en: {
    // Navigation
    home: "Home",
    courses: "Courses",
    about: "About",
    contact: "Contact",
    demo: "Demo",
    login: "Login",
    signUp: "Sign Up",
    language: "Language",
    indonesian: "Bahasa Indonesia",
    english: "English",

    // Common
    search: "Search",
    filter: "Filter",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",

    // Dashboard
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    analytics: "Analytics",
    reports: "Reports",

    // Course Related
    myCourses: "My Courses",
    browseCourses: "Browse Courses",
    createCourse: "Create Course",
    courseManagement: "Course Management",
    students: "Students",
    instructors: "Instructors",

    // Cart & Payment
    addToCart: "Add to Cart",
    cart: "Cart",
    checkout: "Checkout",
    payment: "Payment",
    paymentGateway: "Payment Gateway",
    paymentMethods: "Payment Methods",

    // User Management
    userManagement: "User Management",
    adminPanel: "Admin Panel",

    // Landing Page
    leadingLearningPlatform: "Leading Learning Platform",
    learnWithoutLimits: "Learn Without Limits,",
    achieveYourDreams: "Achieve Your Dreams",
    joinThousands:
      "Join thousands of learners who have transformed their careers through high-quality online courses from the world's best instructors.",
    startLearningFree: "Start Learning Free",
    watchDemo: "Watch Demo",
    freeToStart: "Free to start",
    officialCertificates: "Official certificates",
    lifetimeAccess: "Lifetime access",
    studentsEnrolled: "Students Enrolled",
    expertInstructors: "Expert Instructors",
    premiumCourses: "Premium Courses",
    successRate: "Success Rate",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "id" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
