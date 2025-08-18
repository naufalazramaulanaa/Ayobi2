"use client";

import { Suspense } from "react";
import { StudentBrowseModules } from "./browse-modules";
import { Skeleton } from "@/components/ui/skeleton";

function BrowseModulesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-midnight-blue-600 to-midnight-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto bg-midnight-blue-700" />
            <Skeleton className="h-6 w-96 mx-auto bg-midnight-blue-700" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type WrapperProps = {
  courseId: string | number; // wajib: ID course untuk ambil modules
};

export function StudentBrowseModulesWrapper(props: WrapperProps) {
  return (
    <Suspense fallback={<BrowseModulesLoading />}>
      <StudentBrowseModules {...props} />
    </Suspense>
  );
}
