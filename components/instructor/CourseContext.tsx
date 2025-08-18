"use client"


import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import debounce from "lodash.debounce";

// Tipe data Course yang lengkap
interface Course {
  id?: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  level: string;
  is_visible: boolean;
  is_published: boolean;
  price: number;
  thumbnail: string;
  modules: any[];
  certificate: {
    enabled: boolean;
    template: string;
    requirements: string[];
  };
  freePreview: boolean;
  coupons: any[];
}

// Default kosong
const defaultCourse: Course = {
  title: "",
  description: "",
  categories: [],
  tags: [],
  level: "",
  is_visible: true,
  is_published: false,
  price: 0,
  thumbnail: "",
  modules: [],
  certificate: {
    enabled: false,
    template: "",
    requirements: [],
  },
  freePreview: false,
  coupons: [],
};

interface SaveStatus {
  [field: string]: string;
}

interface CourseContextType {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
  saveStatus: SaveStatus;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
  triggerAutoSaveGlobal: () => void;
  debouncedAutoSave: (field: keyof Course, value: any) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [course, setCourse] = useState<Course>(defaultCourse);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({});

  const autoSave = useCallback(() => {
    console.log("💾 Auto-saving course:", course);
    // TODO: kirim ke backend
  }, [course]);

  const debouncedAutoSave = useCallback(
    debounce((field: keyof Course, value: any) => {
      console.log(`⏳ Debounced save field "${field}"...`);
      setSaveStatus((prev) => ({ ...prev, [field]: "Saving..." }));
      setTimeout(() => {
        // Simulasi auto save
        setSaveStatus((prev) => ({ ...prev, [field]: "Saved" }));
        autoSave();
      }, 500);
    }, 2000),
    [autoSave]
  );

  const triggerAutoSaveGlobal = () => {
    console.log("⏳ Global autosave dipicu...");
    autoSave();
  };

  return (
    <CourseContext.Provider
      value={{
        course,
        setCourse,
        saveStatus,
        setSaveStatus,
        debouncedAutoSave,
        triggerAutoSaveGlobal,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
