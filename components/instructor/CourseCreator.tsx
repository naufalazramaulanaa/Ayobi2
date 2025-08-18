"use client";

import { useState } from "react";
import BasicInformation from "./BasicInformation";
import CourseStructure from "./CourseStructure";
import PricingAndCoupon from "./PricingAndCoupon";
import { CourseProvider } from "./CourseContext";

export default function CourseCreator() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <CourseProvider>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create New Course</h1>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setCurrentStep(0)}>Basic</button>
          <button onClick={() => setCurrentStep(1)}>Structure</button>
          <button onClick={() => setCurrentStep(2)}>Pricing</button>
          <button onClick={() => setCurrentStep(3)}>Final</button>
        </div>

        {currentStep === 0 && <BasicInformation />}
        {currentStep === 1 && <CourseStructure />}
        {currentStep === 2 && <PricingAndCoupon />}
        {currentStep === 3 && <div>Final Step Review</div>}
      </div>
    </CourseProvider>
  );
}
