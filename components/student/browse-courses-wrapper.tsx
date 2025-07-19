"use client"

import { Suspense } from "react"
import { StudentBrowseCourses } from "./browse-courses"
import { Skeleton } from "@/components/ui/skeleton"

function BrowseCoursesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-midnight-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4 bg-midnight-blue-700" />
            <Skeleton className="h-6 w-96 mx-auto mb-6 bg-midnight-blue-700" />
          </div>
        </div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Skeleton className="h-10 flex-1 max-w-md" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Courses Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StudentBrowseCoursesWrapper() {
  return (
    <Suspense fallback={<BrowseCoursesLoading />}>
      <StudentBrowseCourses />
    </Suspense>
  )
}
