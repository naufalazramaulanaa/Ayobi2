import BasicInformation from "./BasicInformation";
import CourseStructure from "./CourseStructure";
import PricingAndCoupon from "./PricingAndCoupon";
import { CourseProvider } from "./CourseContext";

export default function CourseCreatorWrapper({ currentStep }) {
  return (
    <CourseProvider>
      <div>
        {currentStep === 0 && <BasicInformation />}
        {currentStep === 1 && <CourseStructure />}
        {currentStep === 2 && <PricingAndCoupon />}
        {currentStep === 3 && (
          <div>
            <p>Final step review goes here.</p>
          </div>
        )}
      </div>
    </CourseProvider>
  );
}
