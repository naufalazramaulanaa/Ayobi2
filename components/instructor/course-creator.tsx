"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Plus,
  Upload,
  Video,
  BookOpen,
  Edit,
  Trash2,
  Download,
  Eye,
  Save,
  X,
  Sparkles,
  HelpCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { fetchData } from "@/lib/api";
import { toast } from "sonner";
import { uploadChunk } from "@/utils/uploadChunk";
import { getTokenFromCookie } from "@/lib/auth";
// import LessonForm from "@/components/instructor/lesson-form";
import { v4 as uuidv4 } from "uuid";

type Content = {
  id: string;
  title: string;
  order: number;
  type: "lesson" | "quiz";
  // Untuk lesson
  description?: string;
  content?: string;
  // Untuk quiz
  passing_grade?: number;
  time_limit?: number;
  max_attempts?: number;
  // Tambahan opsional
  data?: any;
  settings?: {
    passingScore?: number;
    timeLimit?: number;
    attemptsAllowed?: boolean | number;
    autoGrading?: boolean;
    showAnswers?: boolean;
  };
};

interface Module {
  id: string;
  title: string;
  description?: string;
  order?: number;
  contents: Content[];
}

// interface Content {
//   id: string;
//   title: string;
//   type: "lesson" | "quiz";
//   order: number;
//   data: any;
//   settings?: {
//     passingScore?: number;
//     timeLimit?: number;
//     attemptsAllowed?: boolean | number;
//     autoGrading?: boolean;
//     showAnswers?: boolean;
//   };
// }

interface Course {
  id: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  level: string;
  price: number;
  thumbnail: string;
  modules: Module[];
  certificate: {
    enabled: boolean;
    template: string;
    requirements: string[];
  };
  freePreview: boolean;
  coupons: Coupon[];
}

interface Coupon {
  id?: string;
  code: string;
  discount_type: "percentage" | "fixed";
  amount: number;
  usage_limit: number;
  valid_until: string; // ✅ Gunakan underscore, bukan spasi
}



interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export function CourseCreator() {
  const [currentStep, setCurrentStep] = useState(0);

  const [course, setCourse] = useState<Course>({
    id: "",
    title: "",
    description: "",
    categories: [] as string[],
    tags: [] as string[],
    level: "",
    price: 0,
    thumbnail: "",
    modules: [] as Module[],
    certificate: {
      enabled: false,
      template: "default",
      requirements: ["Complete all modules", "Pass all quizzes with 80%"],
    },
    freePreview: false,
    coupons: [] as Coupon[],
  });
  // Di dalam CourseCreator
  // const debounceTimers: { [key: string]: ReturnType<typeof setTimeout> } = {};
  // const debouncedAutoSave = (field: string, value: any) => {
  //   // Clear timer jika ada sebelumnya
  //   if (debounceTimers[field]) {
  //     clearTimeout(debounceTimers[field]);
  //   }

  //   // Set timer baru
  //   debounceTimers[field] = setTimeout(() => {
  //    debouncedAutoSave(field, value);
  //   }, 5000);
  // };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCourse((prev) => ({ ...prev, thumbnail: "" })); // clear preview dulu
    setPendingCourseData((prev: any) => ({ ...prev, thumbnail: file }));
    triggerAutoSaveGlobal();
  };

  const [courseId, setCourseId] = useState<string | null>(null);
  const [pricingType, setPricingType] = useState<string>("");
const [pricingOptions, setPricingOptions] = useState<{ label: string; value: string }[]>([]);
// const [couponData, setCouponData] = useState({
//   code: "",
//   discount_type: "percentage",
//   amount: "",
//   usage_limit: "",
//   valid_until: "",
// });


  const [price, setPrice] = useState("");
const [coupon, setCoupon] = useState({
  id: "",
  code: "",
  discount_type: "percentage",
  amount: 0,
  usage_limit: 100,
  valid_until: "",
});

useEffect(() => {
  console.log("🎯 Current coupon state:", coupon);
}, [coupon]);


// useEffect(() => {
//   if (editingCouponData) {
//     setCoupon({
//       id: editingCouponData.id || "",
//       code: editingCouponData.code || "",
//       discount_type: editingCouponData.discount_type || "percentage",
//       amount: Number(editingCouponData.amount || 0),
//       usage_limit: Number(editingCouponData.usage_limit || 100),
//       valid_until: editingCouponData.valid_until || new Date().toISOString().split("T")[0],
//     });
//   }
// }, [editingCouponData]);


  useEffect(() => {
  const getPricingOptions = async () => {
    try {
      const res = await fetchData("/enums/course/pricing-type");
      if (res?.data) setPricingOptions(res.data);
    } catch (err) {
      console.error("❌ Failed to load pricing type:", err);
    }
  };
  getPricingOptions();
}, []);


  const [loading, setLoading] = useState(false);
  // ⬅️ Letakkan di dalam komponen, sebelum handleCouponSubmit()
  const fetchCoupon = async () => {
    try {
      const response = await fetchData(
        `/instructor/coupons/${courseId}/course`
      );
      if (response.success && response.data) {
        setCoupon(response.data);
      }
    } catch (err) {
      console.log("No coupon data found.");
    }
  };

  // ⬅️ useEffect tetap seperti ini
  useEffect(() => {
    if (courseId) {
      fetchCoupon();
    }
  }, [courseId]);

  // Fungsi parse dari DD/MM/YYYY ke YYYY-MM-DD (tanpa toISOString)
const handleCouponSubmit = async () => {
  setLoading(true);
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("📆 Today:", today);
    console.log("📤 Valid Until:", coupon.valid_until);

    if (!coupon.valid_until || coupon.valid_until < today) {
      alert(`❌ Tanggal valid_until harus hari ini atau lebih baru\n📤 Dikirim: ${coupon.valid_until}\n📅 Hari ini: ${today}`);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("course_id", courseId!);
    formData.append("code", coupon.code);
    formData.append("discount_type", coupon.discount_type);
    formData.append("amount", String(Number(coupon.amount)));
    formData.append("usage_limit", String(parseInt(coupon.usage_limit.toString(), 10)));
    formData.append("valid_until", coupon.valid_until);

    let response;
    if (coupon.id) {
      formData.append("_method", "PUT");
      response = await fetchData(`/instructor/coupons/${coupon.id}`, {
        method: "POST",
        body: formData,
      });
    } else {
      response = await fetchData("/instructor/coupons", {
        method: "POST",
        body: formData,
      });
    }

    if (response.success) {
      alert("✅ Coupon saved successfully");
      await fetchCoupon();
    }
  } catch (error) {
    console.error("❌ Failed to save coupon:", error);
  }
  setLoading(false);
};







  const [fileId] = useState(() => uuidv4());
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [moduleSaveStatus, setModuleSaveStatus] = useState<string>("");
  const [contentSaveStatus, setContentSaveStatus] = useState<string>("");
  

	const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
	const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
	const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
	const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
	const [selectedModuleId, setSelectedModuleId] = useState<string>("");
	const [moduleSaveStatus, setModuleSaveStatus] = useState<string>("");
	const [contentSaveStatus, setContentSaveStatus] = useState<string>("");


  // Untuk dialog & data edit Module
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module>({
    id: "",
    title: "",
    description: "",
    order: 0,
    contents: [],
  });

  // Untuk dialog & data edit Lesson
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{
    moduleIndex: number;
    contentIndex: number;
  } | null>(null);

  // Untuk dialog & data edit Quiz
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<{
    moduleIndex: number;
    contentIndex: number;
  } | null>(null);

  const [selectedModuleIdForContent, setSelectedModuleIdForContent] =
    useState<string>("");

  // Available categories and tags
  const [availableCategories] = useState([
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Cybersecurity",
    "Game Development",
  ]);

  const [availableTags] = useState([
    "Beginner Friendly",
    "Hands-on Projects",
    "Certificate Included",
    "Lifetime Access",
    "Mobile Friendly",
    "Interactive",
    "Updated 2024",
    "Best Seller",
    "New Release",
    "Popular",
  ]);

  const [pendingCourseData, setPendingCourseData] = useState<any>({});
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

  const triggerAutoSaveGlobal = () => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      autoSaveAllFields();
    }, 5000);
  };

  const autoSaveAllFields = async () => {
    if (!Object.keys(pendingCourseData).length) return;

    const isUpdate = Boolean(courseId);
    const endpoint = isUpdate
      ? `/instructor/courses/${courseId}`
      : `/instructor/courses/initiate`;

    const body = {
      ...pendingCourseData,
      is_visible: course.is_visible,
      is_published: true,
      approval_status: "draft",
      thumbnail: course.thumbnail,
      video: course.video || "",
      ...(isUpdate && { _method: "PUT" }),
    };

    try {
      const response = await fetchData(endpoint, {
        method: "POST",
        body,
      });

      if (!courseId && (response.data?.id || response.id)) {
        setCourseId(response.data?.id || response.id);
      }

      setPendingCourseData({});
      setSaveStatus((prev) => ({ ...prev, global: "✅ Semua data disimpan" }));
    } catch {
      setSaveStatus((prev) => ({ ...prev, global: "❌ Gagal menyimpan data" }));
    }

    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, global: "" }));
    }, 3000);
  };

  const [saveStatus, setSaveStatus] = useState<{ [key: string]: string }>({});
  const debounceTimers: { [key: string]: ReturnType<typeof setTimeout> } = {};

  const debouncedAutoSave = (field: string, value: any) => {
    if (debounceTimers[field]) {
      clearTimeout(debounceTimers[field]);
    }

    debounceTimers[field] = setTimeout(() => {
      console.log(`[debouncedAutoSave] Triggering auto-save for "${field}"`);
      autoSaveField(field, value);
    }, 5000); // 5 detik setelah tidak ada aktivitas
  };

  const autoInitiate = async () => {
    try {
      const res = await fetchData("/instructor/courses/initiate", {
        method: "POST",
      });

      const newId = res.data?.id || res.id;

      if (newId) {
        setCourseId(newId);

        const transformedModules = (res.data.modules || []).map((mod: any) => {
          const lessons = (mod.lessons || []).map((lesson: any) => ({
            ...lesson,
            type: "lesson" as const,
          }));

          const quizzes = (mod.quizzes || []).map((quiz: any) => ({
            ...quiz,
            type: "quiz" as const,
          }));

          return {
            ...mod,
            contents: [...lessons, ...quizzes],
          };
        });

        setCourse((prev) => ({
          ...prev,
          ...res.data,
          modules: transformedModules,
          thumbnail: null,
          video: res.data?.video || "",
        }));
      }
    } catch (err) {
      console.error("Auto-initiate gagal:", err);
    }
  };


  const autoSaveField = async (field: string, value: any) => {
    const endpoint = courseId
      ? `/instructor/courses/${courseId}`
      : `/instructor/courses/initiate`;

    const isUpdate = Boolean(courseId);

	const autoSaveField = async (field: string, value: any) => {
		const endpoint = courseId
			? `/instructor/courses/${courseId}`
			: `/instructor/courses/initiate`;

		const isUpdate = Boolean(courseId);


    let body: FormData | any;
    let isFormData = false;

    console.log(`[autoSaveField] Saving field: ${field}`, value); // Debug log

    if (field === "thumbnail") {
      body = new FormData();
      body.append("title", course.title);
      body.append("description", course.description);
      body.append("price", course.price?.toString() || "0");
      body.append("approval_status", "draft");
      body.append("is_visible", course.is_visible ? "true" : "false");
      body.append("is_published", "true");
      body.append("thumbnail", value);
      if (isUpdate) body.append("_method", "PUT");
      isFormData = true;
    } else {
      body = {
        [field]: value,
        is_visible: course.is_visible,
        is_published: true,
        approval_status: "draft",
        thumbnail: course.thumbnail,
        video: course.video || "",
      };
      if (isUpdate) body._method = "PUT";
    }

    console.log("body", body);

    try {
      const response = await fetchData(endpoint, {
        method: "POST",

        body,
      });

      console.log(`[autoSaveField] Response for "${field}":`, response); // Debug log

        body: body,
      });

      console.log("response", response);


      if (!courseId && (response.data?.id || response.id)) {
        const newId = response.data?.id || response.id;
        setCourseId(newId);
        console.log(`[autoSaveField] New courseId set: ${newId}`); // Debug log
      }

      setSaveStatus((prev) => ({ ...prev, [field]: "✅ Disimpan" }));
    } catch (err) {
      console.error(`[autoSaveField] Error saving field "${field}":`, err);
      setSaveStatus((prev) => ({ ...prev, [field]: "❌ Gagal menyimpan" }));
    }

    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, [field]: "" }));
    }, 3000);
  };

  useEffect(() => {
    autoInitiate();
  }, []);

  const steps = [
    "Basic Information",
    "Course Structure",
    "Pricing & Coupons",
    "Final Step",
  ];

  const addModule = async (
    moduleData: Omit<Module, "id" | "order" | "contents">
  ) => {
    if (!courseId) return;

    const formData = new FormData();
    formData.append("title", moduleData.title);
    formData.append("description", moduleData.description);
    formData.append("course_id", courseId);
    formData.append("order", String(course.modules.length + 1));

    try {
      const res = await fetchData("/instructor/courses/modules/store", {
        method: "POST",
        body: formData,
      });

      const newModule: Module = {
        ...res.data,
        contents: [],
      };

      setCourse((prev) => ({
        ...prev,
        modules: [...prev.modules, newModule],
      }));

      setModuleSaveStatus("✅ Modul berhasil disimpan");
    } catch (err) {
      console.error("❌ Gagal menyimpan modul:", err);
      setModuleSaveStatus("❌ Gagal menyimpan modul");
    }

    setIsModuleDialogOpen(false);
    setTimeout(() => setModuleSaveStatus(""), 3000);
  };
  async function addLesson(
    moduleId: string,
    lessonData: {
      title: string;
      description?: string;
      content: string;
      order?: number;
      image?: File | null;
      video_id?: string;
    }
  ) {
    const formData = new FormData();
    formData.append("title", lessonData.title);
    formData.append("description", lessonData.description || "");
    formData.append("content", lessonData.content);
    formData.append("order", String(lessonData.order || 1));
    formData.append("module_id", moduleId);
    formData.append("video_id", lessonData.video_id);
    if (lessonData.image) formData.append("image", lessonData.image);
    // if (lessonData.video_id) formData.append("video_id", lessonData.video_id);

    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await fetchData("/instructor/courses/modules/lessons/store", {
        method: "POST",
        body: formData,
      });
      console.log("✅ Lesson created:", res);
      return res;
    } catch (error) {
      console.error("❌ Gagal menambahkan lesson:", error);
      throw error;
    }
  }

const updateModule = async (moduleId: string, updatedData: any) => {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("title", updatedData.title);
  formData.append("description", updatedData.description || "");

  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/instructor/courses/modules/${moduleId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: formData,
      }
    );

    const result = await res.json();

    if (result.success) {
      console.log("✅ Module updated:", result.data);
      updateModuleInState(result.data);
      return result.data;
    }
  } catch (error) {
    console.error("❌ Update module failed:", error);
  }
};

  const updateLesson = async (
    lessonId: string,
    lessonData: any,
    moduleId: string
  ) => {
    const formData = new FormData();
    formData.append("title", lessonData.title);
    formData.append("description", lessonData.description || "");
    formData.append("content", lessonData.content);
    formData.append("order", String(lessonData.order || 1));
    formData.append("module_id", moduleId);
    formData.append("_method", "PUT"); // 💡 Override to PUT

    if (lessonData.image) formData.append("image", lessonData.image);
    if (lessonData.video_id) formData.append("video_id", lessonData.video_id);

    try {
      const res = await fetchData(
        `/instructor/courses/modules/lessons/${lessonId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      return res.data;
    } catch (err) {
      console.error("❌ Gagal update lesson:", err);
      throw err;
    }
  };

  const updateQuiz = async (quizId: string, updatedData: any) => {
    const settings = {
      passing_grade: updatedData.passing_grade?.toString() ?? "0",
      time_limit: updatedData.time_limit?.toString() ?? "0",
      max_attempts: updatedData.max_attempts?.toString() ?? "1",
      show_correct_answers: updatedData.show_correct_answers?.toString() ?? "0",
      automatically_graded: updatedData.automatically_graded?.toString() ?? "0",
    };
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", updatedData.title);
    formData.append("description", updatedData.description || "");
    // formData.append("order", updatedData.order.toString());
    formData.append("module_id", updatedData.module_id);
    formData.append("settings", JSON.stringify(settings));
    formData.append("type", pricingType); // ✅ Tambahkan ini

    // formData.append(
    //   "show_correct_answers",
    //   updatedData.show_correct_answers ? "1" : "0"
    // );
    // formData.append(
    //   "automatically_graded",
    //   updatedData.automatically_graded ? "1" : "0"
    // );

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/instructor/courses/quizzes/${quizId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const result = await res.json();
      if (result.success) {
        console.log("✅ Quiz updated:", result.data);
        return result.data;
      }
    } catch (error) {
      console.error("❌ Update quiz failed:", error);
    }
  };

  const [editedModuleIndex, setEditedModuleIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (editedModuleIndex !== null && course.modules[editedModuleIndex]) {
        const mod = course.modules[editedModuleIndex];
        updateModule(mod.id, {
          title: mod.title,
          description: mod.description,
        })
          .then(() => setModuleSaveStatus("✅ Modul berhasil disimpan"))
          .catch(() => setModuleSaveStatus("❌ Gagal menyimpan modul"));
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [course.modules, editedModuleIndex]);

  // Fungsi hapus modul
  const deleteModule = async (moduleId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/instructor/courses/modules/${moduleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            Accept: "application/json",
          },
        }
      );

      const result = await res.json();
      if (!res.ok) {
        const fallbackMsg =
          result?.message || result?.error || "Gagal menghapus modul";
        throw new Error(fallbackMsg);
      }

      // Hapus dari state
      const updatedModules = course.modules.filter(
        (mod) => mod.id !== moduleId
      );
      setCourse((prev) => ({ ...prev, modules: updatedModules }));
      toast.success("✅ Modul berhasil dihapus");
    } catch (error: any) {
      console.error("❌ Gagal hapus modul:", error);
      toast.error(`❌ ${error.message || "Gagal menghapus modul"}`);
    }
  };

  // Fungsi hapus lesson
  const deleteQuiz = async (
    quizId: string,
    moduleIndex: number,
    contentIndex: number
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/instructor/courses/quizzes/${quizId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            Accept: "application/json",
          },
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete quiz");

      const updatedModules = [...course.modules];
      updatedModules[moduleIndex].contents.splice(contentIndex, 1);
      setCourse((prev) => ({ ...prev, modules: updatedModules }));
      toast.success("✅ Quiz berhasil dihapus");
    } catch (error) {
      console.error("❌ Gagal hapus quiz:", error);
      toast.error("❌ Gagal menghapus quiz");
    }
  };

  // ✅ Tambahkan atau update module ke state
  const updateModuleInState = (moduleData: any) => {
    setCourse((prev) => {
      const modules = [...prev.modules];
      const moduleIndex = modules.findIndex((m) => m.id === moduleData.id);
      if (moduleIndex !== -1) {
        modules[moduleIndex] = { ...modules[moduleIndex], ...moduleData };
      } else {
        modules.push({ ...moduleData, contents: [] });
      }
      return { ...prev, modules };
    });
  };

  // ✅ Tambahkan atau update lesson ke state
  const updateLessonInState = (lessonData: any) => {
    setCourse((prev) => {
      const modules = [...prev.modules];
      const targetModule = modules.find(
        (mod) => mod.id === lessonData.module_id
      );
      if (targetModule) {
        const contentIndex = targetModule.contents.findIndex(
          (c) => c.id === lessonData.id
        );
        if (contentIndex !== -1) {
          targetModule.contents[contentIndex] = {
            ...targetModule.contents[contentIndex],
            ...lessonData,
          };
        } else {
          targetModule.contents.push({ ...lessonData, type: "lesson" });
        }
      }
      return { ...prev, modules };
    });
  };

  // ✅ Tambahkan atau update quiz ke state
  const updateQuizInState = (quizData: any) => {
    setCourse((prev) => {
      const modules = [...prev.modules];
      const targetModule = modules.find((mod) => mod.id === quizData.module_id);
      if (targetModule) {
        const contentIndex = targetModule.contents.findIndex(
          (c) => c.id === quizData.id
        );
        if (contentIndex !== -1) {
          targetModule.contents[contentIndex] = {
            ...targetModule.contents[contentIndex],
            ...quizData,
          };
        } else {
          targetModule.contents.push({ ...quizData, type: "quiz" });
        }
      }
      return { ...prev, modules };
    });
  };

  const addContent = async (
    moduleId: string,
    contentData: Omit<Content, "id"> & { type: "lesson" | "quiz" }
  ) => {
    if (!moduleId || moduleId.length < 10) {
      console.error("❌ Module ID tidak valid:", moduleId);
      alert("Module ID tidak valid. Harap refresh halaman.");
      return;
    }

    const newContent: Content = {
      ...contentData,
      id: Date.now().toString(),
      order: getModuleContents(moduleId).length + 1,
    };

    // Tambahkan ke UI secara sementara (optimistic update)
    setCourse((prev) => {
      const updatedModules = prev.modules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            contents: [
              ...(Array.isArray(module.contents) ? module.contents : []),
              newContent,
            ],
          };
        }
        return module;
      });

      return { ...prev, modules: updatedModules };
    });

    try {
      console.log("📤 Kirim ke backend:", { moduleId, contentData });

      if (contentData.type === "lesson") {
        await addLesson(moduleId, {
          title: contentData.title,
          description: contentData.description || "",
          content: contentData.content,
          order: newContent.order,
          video_id: contentData.video_id,
        });
      } else if (contentData.type === "quiz") {
        await addQuiz(moduleId, {
          title: contentData.title,
          order: newContent.order,
          passing_grade: contentData.passing_grade || 80,
          time_limit: contentData.time_limit || 60,
          max_attempts: contentData.max_attempts || 3,
        });
      }

      console.log("✅ Konten berhasil disimpan");

      // Ambil ulang isi module dari backend agar sinkron
      const updatedLessons = await getLessonsByModuleId(moduleId);

      setCourse((prev) => {
        const updatedModules = prev.modules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              contents: updatedLessons, // replace dengan hasil get
            };
          }
          return module;
        });

        return { ...prev, modules: updatedModules };
      });
    } catch (error: any) {
      console.error("❌ Gagal menyimpan konten:", error);

      // Rollback optimistic update
      setCourse((prev) => {
        const updatedModules = prev.modules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              contents: module.contents.filter((c) => c.id !== newContent.id),
            };
          }
          return module;
        });

        return { ...prev, modules: updatedModules };
      });

      alert("❌ Gagal menyimpan konten. Periksa module ID atau jaringan.");
    }
  };

  async function getLessonsByModuleId(moduleId: string) {
    try {
      const res = await fetchData(
        `/instructor/courses/modules/lessons/${moduleId}`,
        {
          method: "GET",
        }
      );

      const data = res?.data ?? res; // mendukung struktur { data: [...] } atau langsung array

      if (!Array.isArray(data)) {
        console.error("❌ Response bukan array:", res);
        return [];
      }

      const formattedLessons: Content[] = data.map((lesson: any) => ({
        id: lesson.id,
        module_id: lesson.module_id,
        title: lesson.title,
        type: "lesson",
        content: lesson.content,
        order: lesson.order || 1,
        description: lesson.description || "",
      }));

      return formattedLessons;
    } catch (error) {
      console.error("❌ Gagal mengambil data lesson:", error);
      return [];
    }
  }

  const [editedLessonIndex, setEditedLessonIndex] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);
  const [lessonSaveStatus, setLessonSaveStatus] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (editedLessonIndex !== null) {
        const { moduleIndex, lessonIndex } = editedLessonIndex;
        const module = course.modules[moduleIndex];
        const lesson = module.contents[lessonIndex];

        if (lesson && lesson.type === "lesson") {
          updateLesson(lesson.id, {
            title: lesson.title,
            content: lesson.data,
          })
            .then(() => setLessonSaveStatus("✅ Lesson berhasil disimpan"))
            .catch(() => setLessonSaveStatus("❌ Gagal menyimpan lesson"));
        }
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [course.modules, editedLessonIndex]);

  const [editedQuizIndex, setEditedQuizIndex] = useState<{
    moduleIndex: number;
    quizIndex: number;
  } | null>(null);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (editedQuizIndex !== null) {
        const { moduleIndex, quizIndex } = editedQuizIndex;
        const module = course.modules[moduleIndex];
        const quiz = module.contents[quizIndex];

        if (quiz && quiz.type === "quiz") {
          updateQuiz(quiz.id, {
            title: quiz.title,
            description: quiz.data?.description || "",
            time_limit: quiz.settings?.timeLimit,
            passing_score: quiz.settings?.passingScore,
          })
            .then(() => setQuizSaveStatus("✅ Quiz berhasil disimpan"))
            .catch(() => setQuizSaveStatus("❌ Gagal menyimpan quiz"));
        }
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [course.modules, editedQuizIndex]);

  const addCoupon = (couponData: Omit<Coupon, "id" | "used">) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: Date.now().toString(),
      used: 0,
    };
    setCourse((prev) => ({
      ...prev,
      coupons: [...prev.coupons, newCoupon],
    }));
    setIsCouponDialogOpen(false);
  };

  const getStepProgress = () => {
    return ((currentStep + 1) / (steps ?? []).length) * 100;
  };

  const getModuleContents = (moduleId: string) => {
    const module = course.modules.find((m) => m.id === moduleId);
    return module?.contents || [];
  };

  const handleContentDragEnd = (result: any, moduleId: string) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    setCourse((prev) => ({
      ...prev,
      modules: (prev.modules ?? []).map((module) =>
        module.id === moduleId
          ? {
              ...module,
              contents: reorderContents(
                module.contents || [],
                sourceIndex,
                destinationIndex
              ),
            }
          : module
      ),
    }));
  };

  const reorderContents = (
    contents: Content[],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const result = Array.from(contents);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    // Update order numbers
    return (result ?? []).map((content, index) => ({
      ...content,
      order: index + 1,
    }));
  };

  const addCategory = (category: string) => {
    if (!course.categories.includes(category)) {
      const updated = [...course.categories, category];
      setCourse((prev) => ({ ...prev, categories: updated }));
      debouncedAutoSave("categories", updated);
    }
  };

  const removeCategory = (category: string) => {
    const updated = course.categories.filter((c) => c !== category);
    setCourse((prev) => ({ ...prev, categories: updated }));
    debouncedAutoSave("categories", updated);
  };

  const addTag = (tag: string) => {
    if (!course.tags.includes(tag)) {
      const updated = [...course.tags, tag];
      setCourse((prev) => ({ ...prev, tags: updated }));
      debouncedAutoSave("tags", updated);
    }
  };

  const removeTag = (tag: string) => {
    setCourse((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
    const updated = course.tags.filter((t) => t !== tag);
    setCourse((prev) => ({ ...prev, tags: updated }));
    debouncedAutoSave("tags", updated);
  };

  const generateDescription = async () => {
    // Simulate AI description generation
    const aiDescriptions = [
      `Master ${course.title} with hands-on projects and real-world examples. This comprehensive course covers everything from basics to advanced concepts, perfect for ${course.level} learners.`,
      `Learn ${course.title} through practical exercises and industry best practices. Build your skills with step-by-step guidance and expert instruction.`,
      `Comprehensive ${course.title} course designed for ${course.level} students. Gain practical experience and build portfolio-worthy projects.`,
    ];

    const randomDescription =
      aiDescriptions[Math.floor(Math.random() * (aiDescriptions ?? []).length)];
    setCourse((prev) => ({ ...prev, description: randomDescription }));
  };

  const setDescription = (value: string) => {
    setCourse((prev) => ({ ...prev, description: value }));
    debouncedAutoSave("description", value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">
            Create New Course
          </h1>
          <p className="text-muted-foreground">
            Build and publish your course step by step
          </p>
        </div>
        <div className="flex justify-end items-center gap-4">
          {saveStatus.global && (
            <span className="flex items-center text-green-600 text-sm font-medium">
              ✅ {saveStatus.global}
            </span>
          )}
          <Button>Save Draft</Button>
          <Button>Preview Course</Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Course Creation Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(getStepProgress())}% Complete
              </span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {(steps ?? []).map((step, index) => (
                <span
                  key={index}
                  className={`${
                    index <= currentStep
                      ? "text-midnight-blue-800 font-medium"
                      : ""
                  }`}
                >
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={currentStep.toString()}
        onValueChange={(value) => setCurrentStep(Number.parseInt(value))}
      >
        <TabsList className="grid w-full grid-cols-4">
          {(steps ?? []).map((step, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="text-xs"
            >
              {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Step 1: Basic Information */}
        <TabsContent value="0" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Course Information</CardTitle>
              <CardDescription>
                Set up the fundamental details of your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete React Developer Course"
                    value={course.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCourse((prev) => ({ ...prev, title: val }));
                      setPendingCourseData((prev: any) => ({
                        ...prev,
                        title: val,
                      }));
                      triggerAutoSaveGlobal(); // reset timer
                    }}
                  />
                  {saveStatus.title && (
                    <p className="text-xs text-muted-foreground">
                      {saveStatus.title}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select
                    value={course.level}
                    onValueChange={(value) => {
                      setCourse((prev) => ({ ...prev, level: value }));
                      debouncedAutoSave("level", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Letakkan di sini, setelah Select */}
                  {saveStatus.level && (
                    <p className="text-xs text-muted-foreground">
                      {saveStatus.level}
                    </p>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(course.categories ?? []).map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeCategory(category)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories
                      .filter((cat) => !course.categories.includes(cat))
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {/* Status Save */}
                {saveStatus.categories && (
                  <p className="text-xs text-muted-foreground">
                    {saveStatus.categories}
                  </p>
                )}
                <div className="flex gap-2">
                  <Input placeholder="Add new category" id="new-category" />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById(
                        "new-category"
                      ) as HTMLInputElement;
                      if (input.value.trim()) {
                        addCategory(input.value.trim());
                        input.value = "";
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(course.tags ?? []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags
                      .filter((tag) => !course.tags.includes(tag))
                      .map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {/* Status Save */}
                {saveStatus.tags && (
                  <p className="text-xs text-muted-foreground">
                    {saveStatus.tags}
                  </p>
                )}
                <div className="flex gap-2">
                  <Input placeholder="Add new tag" id="new-tag" />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById(
                        "new-tag"
                      ) as HTMLInputElement;
                      if (input.value.trim()) {
                        addTag(input.value.trim());
                        input.value = "";
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description with AI */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Course Description</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Generate with AI
                  </Button>
                </div>
                <RichTextEditor
                  value={course.description}
                  onChange={setDescription}
                  placeholder="Describe what students will learn in this course..."
                />
                {saveStatus.description && (
                  <p className="text-xs text-muted-foreground">
                    {saveStatus.description}
                  </p>
                )}
              </div>

              {/* Course Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="free-preview"
                    checked={course.freePreview}
                    onCheckedChange={(checked) => {
                      setCourse((prev) => ({ ...prev, freePreview: checked }));
                      debouncedAutoSave("freePreview", checked);
                    }}
                  />
                  {saveStatus.freePreview && (
                    <p className="text-xs text-muted-foreground">
                      {saveStatus.freePreview}
                    </p>
                  )}

                  <Label htmlFor="free-preview">Enable free preview</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={course.is_visible}
                    onCheckedChange={(val) => {
                      setCourse((prev) => ({ ...prev, is_visible: val }));
                      debouncedAutoSave("is_visible", val);
                    }}
                  />
                  <Label>Public Course Visibility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-certificate"
                    checked={course.certificate.enabled}
                    onCheckedChange={(checked) => {
                      const newCert = {
                        ...course.certificate,
                        enabled: checked,
                      };
                      setCourse((prev) => ({ ...prev, certificate: newCert }));
                      debouncedAutoSave("certificate", newCert);
                    }}
                  />
                  {saveStatus.certificate && (
                    <p className="text-xs text-muted-foreground">
                      {saveStatus.certificate}
                    </p>
                  )}

                  <Label htmlFor="enable-certificate">
                    Enable certificate generation
                  </Label>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt="Thumbnail"
                      className="mx-auto mb-4 max-h-40 rounded-md"
                    />
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        No thumbnail uploaded
                      </p>
                    </>
                  )}

                  <div className="mt-4 flex justify-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="w-auto cursor-pointer"
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG up to 2MB (1280x720 recommended)
                  </p>
                  {saveStatus.thumbnail && (
                    <p className="text-xs text-muted-foreground">
                      {saveStatus.thumbnail}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Course Structure */}
        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Course Structure
                <Dialog
                  open={isModuleDialogOpen}
                  onOpenChange={setIsModuleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Module
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Module</DialogTitle>
                      <DialogDescription>
                        Create a new module to organize your course content
                      </DialogDescription>
                    </DialogHeader>
                    <ModuleForm onSubmit={addModule} />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isEditModuleOpen}
                  onOpenChange={setIsEditModuleOpen}
                >
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Module</DialogTitle>
                      <DialogDescription>
                        Edit existing module
                      </DialogDescription>
                    </DialogHeader>
                    {editingModule !== null && (
                      <ModuleForm
                        module={editingModule}
                        onSubmit={async (updatedData) => {
                          await updateModule(editingModule.id, updatedData);
                          setIsEditModuleOpen(false);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </CardTitle>
              {moduleSaveStatus && (
                <p className="text-sm text-muted-foreground pl-1">
                  {moduleSaveStatus}
                </p>
              )}
              <CardDescription>
                Organize your course into modules and add lessons or quizzes
                directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(course.modules ?? []).length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No modules yet</h3>
                  <p className="mt-2 text-gray-500">
                    Start by adding your first module
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {(course.modules ?? []).map((module, moduleIndex) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <div className="flex items-start justify-between w-full">
                        <AccordionTrigger className="hover:no-underline w-full pr-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{moduleIndex + 1}</Badge>
                            <div className="text-left">
                              <h4 className="font-medium">{module.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {(module.contents ?? []).length} contents
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingModule(module);
                              setIsEditModuleOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 bg-transparent"
                            onClick={() => {
                              if (
                                !window.confirm(
                                  "Hapus modul ini beserta isinya?"
                                )
                              )
                                return;
                              deleteModule(module.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          <div className="flex justify-between items-start">
                            <div
                              className="text-sm text-muted-foreground prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: module.description,
                              }}
                            />
                            <div className="flex gap-2 ml-4">
                              <Dialog
                                open={
                                  isLessonDialogOpen &&
                                  selectedModuleIdForContent === module.id
                                }
                                onOpenChange={(open) => {
                                  setIsLessonDialogOpen(open);
                                  if (open) {
                                    setSelectedModuleIdForContent(module.id);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    Add Lesson
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Add Lesson to {module.title}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Create lesson content with materials
                                      including video uploads
                                    </DialogDescription>
                                  </DialogHeader>
                                  <LessonForm
                                    courseId={course.id}
                                    moduleId={module.id}
                                    onSubmit={(data) =>
                                      addContent(module.id, data)
                                    } // ← INI YANG DIMAKSUD
                                    onClose={() => setIsLessonDialogOpen(false)}
                                  />
                                </DialogContent>
                              </Dialog>
                              <Dialog
                                open={
                                  isQuizDialogOpen &&
                                  selectedModuleIdForContent === module.id
                                }
                                onOpenChange={(open) => {
                                  setIsQuizDialogOpen(open);
                                  if (open) {
                                    setSelectedModuleIdForContent(module.id);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <HelpCircle className="w-3 h-3 mr-1" />
                                    Add Quiz
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Add Quiz to {module.title}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Create quiz with questions and settings
                                    </DialogDescription>
                                  </DialogHeader>
                                  <QuizForm
                                    onSubmit={(data) =>
                                      addContent(module.id, data)
                                    }
                                  />
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={isEditLessonOpen}
                                onOpenChange={setIsEditLessonOpen}
                              >
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {editingLesson ? "Edit" : "Add"} Lesson:
                                      {editingLesson &&
                                        course.modules[
                                          editingLesson.moduleIndex
                                        ].contents[editingLesson.contentIndex]
                                          .title}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Update lesson content and materials.
                                    </DialogDescription>
                                  </DialogHeader>

                                  {editingLesson && (
                                    <LessonForm
                                      courseId={courseId}
                                      moduleId={
                                        course.modules[
                                          editingLesson.moduleIndex
                                        ].id
                                      }
                                      lesson={{
                                        title:
                                          course.modules[
                                            editingLesson.moduleIndex
                                          ].contents[editingLesson.contentIndex]
                                            .title,
                                        content:
                                          course.modules[
                                            editingLesson.moduleIndex
                                          ].contents[editingLesson.contentIndex]
                                            .data,
                                        video_id:
                                          course.modules[
                                            editingLesson.moduleIndex
                                          ].contents[editingLesson.contentIndex]
                                            .video_id || "",
                                        images: [],
                                        files: [],
                                      }}
                                      onSubmit={async (updatedData) => {
                                        const lessonId =
                                          course.modules[
                                            editingLesson.moduleIndex
                                          ].contents[editingLesson.contentIndex]
                                            .id;
                                        const moduleId =
                                          course.modules[
                                            editingLesson.moduleIndex
                                          ].id;

                                        try {
                                          await updateLesson(lessonId, {
                                            ...updatedData,
                                            module_id: moduleId,
                                            order:
                                              editingLesson.contentIndex + 1,
                                          });

                                          const res = await fetchData(
                                            `/instructor/courses/${courseId}`
                                          );
                                          const updatedModules =
                                            res.data.modules.map((mod: any) => {
                                              const lessons = mod.lesson?.map(
                                                (lsn: any) => ({
                                                  ...lsn,
                                                  type: "lesson",
                                                })
                                              );
                                              const quizzes = mod.quizzes?.map(
                                                (qz: any) => ({
                                                  ...qz,
                                                  type: "quiz",
                                                })
                                              );
                                              return {
                                                ...mod,
                                                contents: [
                                                  ...lessons,
                                                  ...quizzes,
                                                ],
                                              };
                                            });

                                          setCourse((prev) => ({
                                            ...prev,
                                            modules: updatedModules,
                                          }));

                                          setIsEditLessonOpen(false);
                                        } catch (err) {
                                          alert("❌ Gagal update lesson.");
                                          console.error(err);
                                        }
                                      }}
                                      onClose={() => setIsEditLessonOpen(false)} // ✅ Penting untuk reset form
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={isEditQuizOpen}
                                onOpenChange={setIsEditQuizOpen}
                              >
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit Quiz:{" "}
                                      {
                                        course.modules[editingQuiz?.moduleIndex]
                                          ?.title
                                      }
                                    </DialogTitle>
                                    <DialogDescription>
                                      Update quiz settings and description
                                    </DialogDescription>
                                  </DialogHeader>

                                  {editingQuiz && (
                                    <QuizForm
                                      quiz={{
                                        title:
                                          course.modules[
                                            editingQuiz.moduleIndex
                                          ].contents[editingQuiz.contentIndex]
                                            .title,
                                        description:
                                          course.modules[
                                            editingQuiz.moduleIndex
                                          ].contents[editingQuiz.contentIndex]
                                            ?.data?.description || "",
                                      }}
                                      onSubmit={(updatedData) => {
                                        const quizId =
                                          course.modules[
                                            editingQuiz.moduleIndex
                                          ].contents[editingQuiz.contentIndex]
                                            .id;

                                        updateQuiz(quizId, {
                                          ...updatedData,
                                          module_id:
                                            course.modules[
                                              editingQuiz.moduleIndex
                                            ].id,
                                          order: editingQuiz.contentIndex + 1,
                                        });

                                        const updatedModules = [
                                          ...course.modules,
                                        ];
                                        updatedModules[
                                          editingQuiz.moduleIndex
                                        ].contents[editingQuiz.contentIndex] = {
                                          ...updatedModules[
                                            editingQuiz.moduleIndex
                                          ].contents[editingQuiz.contentIndex],
                                          ...updatedData,
                                        };

                                        setCourse((prev) => ({
                                          ...prev,
                                          modules: updatedModules,
                                        }));
                                        setIsEditQuizOpen(false);
                                      }}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>

                              {contentSaveStatus && (
                                <p className="text-sm text-muted-foreground pl-1">
                                  {contentSaveStatus}
                                </p>
                              )}
                            </div>
                          </div>

                          {module.contents &&
                          (module.contents ?? []).length === 0 ? (
                            <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-500">
                                No contents in this module yet
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Click "Add Lesson" or "Add Quiz" to get started
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {/* Content List */}
                              {module.contents &&
                                (module.contents ?? []).length > 0 && (
                                  <div className="space-y-2">
                                    <DragDropContext
                                      onDragEnd={(result) =>
                                        handleContentDragEnd(result, module.id)
                                      }
                                    >
                                      <Droppable
                                        droppableId={`module-${module.id}`}
                                      >
                                        {(provided) => (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2"
                                          >
                                            {module.contents
                                              .sort((a, b) => a.order - b.order)
                                              .map((content, contentIndex) => (
                                                <Draggable
                                                  key={content.id}
                                                  draggableId={content.id}
                                                  index={contentIndex}
                                                >
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      className={`flex items-center justify-between p-3 border rounded-lg bg-white ${
                                                        snapshot.isDragging
                                                          ? "shadow-lg"
                                                          : ""
                                                      }`}
                                                    >
                                                      <div className="flex items-center gap-3">
                                                        <Badge
                                                          variant="outline"
                                                          className="text-xs"
                                                        >
                                                          {contentIndex + 1}
                                                        </Badge>
                                                        {content.type ===
                                                          "lesson" && (
                                                          <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                              console.log(
                                                                "🟩 Edit lesson",
                                                                {
                                                                  moduleIndex,
                                                                  contentIndex,
                                                                }
                                                              );

                                                              setEditingLesson({
                                                                moduleIndex,
                                                                contentIndex,
                                                              }); // ← Index konten Lesson
                                                              setIsEditLessonOpen(
                                                                true
                                                              ); // ← Buka dialog
                                                            }}
                                                          >
                                                            <Edit className="w-4 h-4" />
                                                          </Button>
                                                        )}

                                                        {content.type ===
                                                          "quiz" && (
                                                          <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                              setEditingQuiz({
                                                                moduleIndex,
                                                                contentIndex,
                                                              }); // ← Index konten Quiz
                                                              setIsEditQuizOpen(
                                                                true
                                                              ); // ← Buka dialog
                                                            }}
                                                          >
                                                            <Edit className="w-4 h-4" />
                                                          </Button>
                                                        )}

                                                        <div>
                                                          <span className="text-sm font-medium">
                                                            {content.title}
                                                          </span>
                                                          <Badge
                                                            variant="secondary"
                                                            className="text-xs ml-2"
                                                          >
                                                            {content.type}
                                                          </Badge>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center gap-1">
                                                        {/* <Button
                                                          size="sm"
                                                          variant="outline"
                                                        >
                                                          <Edit className="w-3 h-3" />
                                                        </Button> */}
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          className="text-red-600 bg-transparent"
                                                          onClick={() => {
                                                            if (
                                                              !window.confirm(
                                                                "Yakin ingin menghapus?"
                                                              )
                                                            )
                                                              return;

                                                            const isLesson =
                                                              content.type ===
                                                              "lesson";
                                                            const isQuiz =
                                                              content.type ===
                                                              "quiz";

                                                            if (isLesson) {
                                                              deleteLesson(
                                                                content.id,
                                                                moduleIndex,
                                                                contentIndex
                                                              );
                                                            } else if (isQuiz) {
                                                              deleteQuiz(
                                                                content.id,
                                                                moduleIndex,
                                                                contentIndex
                                                              );
                                                            }
                                                          }}
                                                        >
                                                          <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </DragDropContext>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Pricing & Coupons */}
        <TabsContent value="2" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Strategy</CardTitle>
                <CardDescription>
                  Set your course pricing and payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Course Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8"
                      value={course.price}
                      onChange={(e) => {
                        const val = Number.parseFloat(e.target.value) || 0;
                        setCourse((prev) => ({ ...prev, price: val }));
                        debouncedAutoSave("price", val);
                      }}
                    />
                    {saveStatus.price && (
                      <p className="text-xs text-muted-foreground">
                        {saveStatus.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
  <Label htmlFor="pricing-type">Pricing Type</Label>
  <Select
  value={pricingType}
  onValueChange={(val) => {
    setPricingType(val);
    autoSaveField("type", val); // ✅ Trigger auto-save seperti course price
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Select type" />
  </SelectTrigger>
  <SelectContent>
    {pricingOptions.map((opt) => (
      <SelectItem key={opt.value} value={opt.value}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

</div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Discount Coupons
                  <Dialog
  open={isCouponDialogOpen}
  onOpenChange={setIsCouponDialogOpen}
>
  <DialogTrigger asChild>
    <Button
      size="sm"
      className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
    >
      <Plus className="w-4 h-4 mr-2" />
      Create Coupon
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Create Discount Coupon</DialogTitle>
      <DialogDescription>
        Create promotional codes for your course
      </DialogDescription>
    </DialogHeader>

    {/* ✅ Gunakan handler Anda */}
    <CouponForm
      coupon={coupon}
      setCoupon={setCoupon}
      loading={loading}
      onSubmit={handleCouponSubmit}
    />
  </DialogContent>
</Dialog>

                </CardTitle>
                <CardDescription>
                  Create promotional codes to boost sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.coupons.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      No coupons created yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {course.coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{coupon.code}</Badge>
                            <span className="text-sm font-medium">
                              {coupon.type === "percentage"
                                ? `${coupon.discount}% off`
                                : `Rp${coupon.discount} off`}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Valid until {coupon.validUntil} • {coupon.used}/
                            {coupon.usageLimit} used
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 bg-transparent"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Step 4: Final Step */}
        <TabsContent value="3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Step</CardTitle>
              <CardDescription>
                Review your course and submit for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Course Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span>{course.title || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categories:</span>
                      <span>
                        {(course.categories ?? []).length > 0
                          ? course.categories.join(", ")
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tags:</span>
                      <span>
                        {(course.tags ?? []).length > 0
                          ? course.tags.join(", ")
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span>{course.level || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>Rp{course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modules:</span>
                      <span>{(course.modules ?? []).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Contents:
                      </span>
                      <span>
                        {course.modules.reduce(
                          (acc, module) => acc + (module.contents ?? []).length,
                          0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Free Preview:
                      </span>
                      <span>{course.freePreview ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Certificate:
                      </span>
                      <span>
                        {course.certificate.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coupons:</span>
                      <span>{(course.coupons ?? []).length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Course Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {course.title ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Course title</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.description ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Course description</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(course.categories ?? []).length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">At least one category</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(course.modules ?? []).length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">At least one module</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Course
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setCurrentStep(Math.min((steps ?? []).length - 1, currentStep + 1))
          }
          disabled={currentStep === (steps ?? []).length - 1}
          className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// Form Components
function ModuleForm({
  onSubmit,
  module,
}: {
  onSubmit: (data: Omit<Module, "id" | "order" | "contents">) => void;
  module?: Module;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", description: "" });
  };

  const generateModuleDescription = () => {
    const aiDescriptions = [
      `This module covers the fundamental concepts and practical applications of ${formData.title}. Students will learn through hands-on exercises and real-world examples.`,
      `Comprehensive introduction to ${formData.title} with step-by-step guidance and practical projects to build your skills.`,
      `Master ${formData.title} through interactive lessons, practical exercises, and industry best practices.`,
    ];

    const randomDescription =
      aiDescriptions[Math.floor(Math.random() * (aiDescriptions ?? []).length)];
    setFormData((prev) => ({ ...prev, description: randomDescription }));
  };

  const setDescription = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="module-title">Module Title</Label>
        <Input
          id="module-title"
          placeholder="e.g., Introduction to React"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="module-description">Description</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateModuleDescription}
            className="flex items-center gap-2 bg-transparent"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Generate with AI
          </Button>
        </div>
        <RichTextEditor
          value={formData.description}
          onChange={setDescription}
          placeholder="Describe what this module covers..."
        />
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
        >
          {module ? "Update Module" : "Create Module"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function LessonForm({
  courseId,
  moduleId,
  lesson,
  onSubmit,
  onClose,
}: {
  courseId: string;
  moduleId: string;
  lesson?: {
    title: string;
    content: string;
    video_id?: string;
    images?: File[];
    files?: File[];
  };
  onSubmit: (data: Omit<Content, "id" | "order"> & { type: "lesson" }) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [] as File[],
    files: [] as File[],
    video_id: "",
    videos: [] as File[], // video upload lokal
  });

  const generateLessonContent = () => {
    const aiContents = [
      `<h2 style="text-align: center;">${formData.title}</h2><p>In this lesson, you'll explore the core principles of ${formData.title} through interactive content and practical tasks.</p>`,
      `<h2 style="text-align: center;">${formData.title}</h2><p>This lesson provides a clear and structured explanation of ${formData.title}, helping you gain confidence and mastery.</p>`,
      `<h2 style="text-align: center;">${formData.title}</h2><p>Learn ${formData.title} step-by-step with expert insights, visual guides, and real-world examples.</p>`,
    ];

    const randomContent =
      aiContents[Math.floor(Math.random() * aiContents.length)];

    setFormData((prev) => ({
      ...prev,
      content: randomContent,
    }));
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    if (lesson) {
      setFormData((prev) => ({
        ...prev,
        title: lesson.title || "",
        content: lesson.content || "",
        video_id: lesson.video_id || "",
        images: lesson.images || [],
        files: lesson.files || [],
      }));
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadDone(false);

    let videoPath = "";
    let videoId = "";
    const fileId = uuidv4();
    const chunkSize = 1024 * 1024;

    if (formData.videos.length > 0) {
      const videoFile = formData.videos[0];
      const extension = videoFile.name.split(".").pop()?.toLowerCase();
      const totalChunks = Math.ceil(videoFile.size / chunkSize);

      try {
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, videoFile.size);
          const chunk = videoFile.slice(start, end);

          const chunkForm = new FormData();
          chunkForm.append("chunk_file", chunk);
          chunkForm.append("file_id", fileId);
          chunkForm.append("chunk_index", i.toString());

          await fetchData("/chunk/upload", {
            method: "POST",
            body: chunkForm,
          });

          setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
        }

        const mergeRes = await fetchData("/chunk/merge", {
          method: "POST",
          body: {
            file_id: fileId,
            extension,
            total_chunks: totalChunks,
          },
        });

        videoPath = mergeRes.data?.path || "";
        videoId = mergeRes.data?.id || "";

        setFormData((prev) => ({ ...prev, video_id: videoId }));
      } catch (err) {
        alert("❌ Failed to upload video");
        setIsUploading(false);
        return;
      }
    }

    const lessonData = {
      title: formData.title,
      type: "lesson",
      content: formData.content,
      videos: videoPath ? [videoPath] : [],
      video_id: videoId || formData.video_id,
      images: formData.images,
      files: formData.files,
    };

    await onSubmit(lessonData);
    setIsUploading(false);
    setUploadDone(true);
    setUploadProgress(0);
    setFormData({
      title: "",
      content: "",
      images: [],
      files: [],
      video_id: "",
      videos: [],
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="lesson-title">Lesson Title</Label>
        <Input
          id="lesson-title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="lesson-content">Lesson Content</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateLessonContent}
            className="flex items-center gap-2 bg-transparent"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Generate with AI
          </Button>
        </div>
        <RichTextEditor
          value={formData.content}
          onChange={(val) => {
            setFormData((prev) => ({ ...prev, content: val }));
          }}
          placeholder="Write your lesson content here..."
          className="min-h-[300px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Video</Label>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              videos: e.target.files ? [e.target.files[0]] : [],
            }))
          }
        />
        {isUploading && <Progress value={uploadProgress} />}
        {uploadDone && (
          <p className="text-sm text-green-600">✅ Video uploaded</p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={isUploading}
          className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
        >
          {isUploading
            ? "Uploading..."
            : lesson
            ? "Update Lesson"
            : "Add Lesson"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function QuizForm({
  onSubmit,
}: {
  onSubmit: (data: Omit<Content, "id" | "order">) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    questions: [] as QuizQuestion[],
    settings: {
      passingScore: 80,
      timeLimit: 60,
      attemptsAllowed: 3,
      autoGrading: true,
      showAnswers: true,
    },
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>(
    {
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    }
  );

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.type) {
      const newQuestion: QuizQuestion = {
        id: Date.now().toString(),
        type: currentQuestion.type,
        question: currentQuestion.question,
        options:
          currentQuestion.type === "multiple-choice"
            ? currentQuestion.options
            : undefined,
        correctAnswer: currentQuestion.correctAnswer || 0,
        explanation: currentQuestion.explanation,
      };

      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));

      setCurrentQuestion({
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      });
    }
  };

  const removeQuestion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      type: "quiz",
      data: {
        questions: formData.questions,
      },
      settings: formData.settings,
    });
    setFormData({
      title: "",
      questions: [],
      settings: {
        passingScore: 80,
        timeLimit: 60,
        attemptsAllowed: 3,
        autoGrading: true,
        showAnswers: true,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="quiz-title">Quiz Title</Label>
        <Input
          id="quiz-title"
          placeholder="e.g., React Fundamentals Quiz"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={formData.settings.passingScore}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      passingScore: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                value={formData.settings.timeLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      timeLimit: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Attempts Allowed</Label>
            <Select
              value={formData.settings.attemptsAllowed.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    attemptsAllowed: Number.parseInt(value),
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 attempt</SelectItem>
                <SelectItem value="2">2 attempts</SelectItem>
                <SelectItem value="3">3 attempts</SelectItem>
                <SelectItem value="-1">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-grading"
                checked={formData.settings.autoGrading}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, autoGrading: checked },
                  }))
                }
              />
              <Label htmlFor="auto-grading">Enable automatic grading</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-answers"
                checked={formData.settings.showAnswers}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, showAnswers: checked },
                  }))
                }
              />
              <Label htmlFor="show-answers">
                Show correct answers after completion
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Question Type</Label>
            <RadioGroup
              value={currentQuestion.type}
              onValueChange={(value) =>
                setCurrentQuestion((prev) => ({
                  ...prev,
                  type: value as "multiple-choice" | "true-false",
                  options:
                    value === "multiple-choice" ? ["", "", "", ""] : undefined,
                  correctAnswer: 0,
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                <Label htmlFor="multiple-choice">Multiple Choice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true-false" id="true-false" />
                <Label htmlFor="true-false">True/False</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              placeholder="Enter your question here..."
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
            />
          </div>

          {currentQuestion.type === "multiple-choice" && (
            <div className="space-y-2">
              <Label>Answer Options</Label>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    checked={currentQuestion.correctAnswer === index}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          correctAnswer: index,
                        }));
                      }
                    }}
                  />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(currentQuestion.options || [])];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        options: newOptions,
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === "true-false" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <RadioGroup
                value={currentQuestion.correctAnswer?.toString()}
                onValueChange={(value) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    correctAnswer: value === "true",
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false">False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>Explanation (Optional)</Label>
            <Textarea
              placeholder="Explain why this is the correct answer..."
              value={currentQuestion.explanation}
              onChange={(e) =>
                setCurrentQuestion((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
            />
          </div>

          <Button
            type="button"
            onClick={addQuestion}
            variant="outline"
            className="w-full bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      {formData.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Questions ({formData.questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <Badge variant="secondary">{question.type}</Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {question.question}
                    </p>
                    {question.type === "multiple-choice" &&
                      question.options && (
                        <div className="text-xs text-muted-foreground">
                          Correct:{" "}
                          {question.options[question.correctAnswer as number]}
                        </div>
                      )}
                    {question.type === "true-false" && (
                      <div className="text-xs text-muted-foreground">
                        Correct: {question.correctAnswer ? "True" : "False"}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 bg-transparent"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <DialogFooter>
        <Button
          type="submit"
          className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
          disabled={formData.questions.length === 0}
        >
          Add Quiz
        </Button>
      </DialogFooter>
    </form>
  );
}
function CouponForm({
  onSubmit,
}: {
  onSubmit: (data: Omit<Coupon, "id" | "used">) => void;
}) {
const [formData, setFormData] = useState<Omit<Coupon, "id" | "used">>({
  code: "",
  discount_type: "percentage",
  amount: 0,
  usage_limit: 100,
  valid_until: "", // key sesuai interface
});




  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("📤 Submitted:", formData);
  onSubmit(formData); // Sudah cocok dengan Omit<Coupon, "id" | "used">
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coupon-code">Coupon Code</Label>
          <Input
            id="coupon-code"
            placeholder="e.g., SAVE20"
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                code: e.target.value.toUpperCase(),
              }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount-type">Discount Type</Label>
          <Select
            value={formData.discount_type}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                type: value as Coupon["discount_type"],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount-value">
            {formData.discount_type === "percentage"
              ? "Discount Percentage"
              : "Discount Amount (Rp)"}
          </Label>
          <Input
            id="discount-value"
            type="number"
            placeholder={formData.discount_type === "percentage" ? "20" : "10000"}
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                discount: Number.parseFloat(e.target.value) || 0,
              }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usage-limit">Usage Limit</Label>
          <Input
            id="usage-limit"
            type="number"
            placeholder="100"
            value={formData.usage_limit}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                usageLimit: Number.parseInt(e.target.value) || 0,
              }))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valid-until">Valid Until</Label>
        <Input
          type="date"
          id="valid-until"
          value={formData.valid_until}
          onChange={(e) => {
            const dateValue = e.target.value;
            console.log("📅 Selected date (raw):", dateValue);
            setFormData((prev) => ({
              ...prev,
              validUntil: dateValue,
            }));
          }}
          required
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
        >
          Create Coupon
        </Button>
      </DialogFooter>
    </form>
  );
}




function addQuiz(
  moduleId: string,
  arg1: {
    title: string;
    order: number;
    passing_grade: number;
    time_limit: number;
    max_attempts: number;
  }
) {
  throw new Error("Function not implemented.");
}

// function mergeChunks(
//   fileId: string,
//   totalChunks: number
// ): string | PromiseLike<string> {
//   throw new Error("Function not implemented.");
// }

function mergeChunks(
  fileId: string,
  totalChunks: number,
  ext: string,
  courseId: string,
  moduleId: string
): string | PromiseLike<string> {
  throw new Error("Function not implemented.");
}

