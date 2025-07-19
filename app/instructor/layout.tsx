import type React from "react"
import { InstructorLayoutWrapper } from "@/components/layout/instructor-layout-wrapper"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <InstructorLayoutWrapper>{children}</InstructorLayoutWrapper>
}
