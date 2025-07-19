import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-midnight-blue-800">Analytics</h1>
        <p className="text-muted-foreground">Detailed analytics and performance metrics</p>
      </div>
      <InstructorDashboard />
    </div>
  )
}
