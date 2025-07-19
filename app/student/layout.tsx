import type React from "react"
import { StudentLayoutWrapper } from "@/components/layout/student-layout-wrapper"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudentLayoutWrapper>{children}</StudentLayoutWrapper>
}
