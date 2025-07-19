import type React from "react"
import { ReviewerLayoutWrapper } from "@/components/layout/reviewer-layout-wrapper"

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ReviewerLayoutWrapper>{children}</ReviewerLayoutWrapper>
}
