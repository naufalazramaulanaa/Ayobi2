"use client";

import type React from "react";
import Swal from "sweetalert2";


import { useEffect, useState, useRef } from "react";
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

// const updateLesson = async (lessonId: string, payload: any) => {
//   const formData = new FormData();
//   Object.entries(payload).forEach(([key, value]) => {
//     formData.append(key, value as string);
//   });
//   formData.append('_method', 'PUT');

//   return await fetchData(`/instructor/courses/modules/lessons/${lessonId}`, {
//     method: 'POST', // <-- wajib ditambahkan
//     body: formData,
//   });
// };

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
	valid_until: string;
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

	const [courseId, setCourseId] = useState<string | null>(null);
	const [pricingType, setPricingType] = useState<string>("");
	const [pricingOptions, setPricingOptions] = useState<
		{ label: string; value: string }[]
	>([]);

	const [coupon, setCoupon] = useState({
		id: "",
		code: "",
		discount_type: "percentage",
		amount: 0,
		usage_limit: 100,
		valid_until: "",
	});

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

	useEffect(() => {
		if (courseId) {
			fetchCoupon();
		}
	}, [courseId]);

	const handleCouponSubmit = async () => {
		setLoading(true);
		try {
			const today = new Date().toISOString().split("T")[0];

			if (!coupon.valid_until || coupon.valid_until < today) {
				alert(
					`❌ Expiration date must be today or later.\nSent: ${coupon.valid_until}\nToday: ${today}`
				);
				setLoading(false);
				return;
			}

			const formData = new FormData();
			formData.append("course_id", courseId!);
			formData.append("code", coupon.code);
			formData.append("discount_type", coupon.discount_type);
			formData.append("amount", String(Number(coupon.amount)));
			formData.append(
				"usage_limit",
				String(parseInt(coupon.usage_limit.toString(), 10))
			);
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

	const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
	const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
	const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
	const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
	const [moduleSaveStatus, setModuleSaveStatus] = useState<string>("");
	const [contentSaveStatus, setContentSaveStatus] = useState<string>("");

	const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
	const [editingModule, setEditingModule] = useState<Module>({
		id: "",
		title: "",
		description: "",
		order: 0,
		contents: [],
	});

	const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
	const [editingLesson, setEditingLesson] = useState<{
		moduleIndex: number;
		contentIndex: number;
	} | null>(null);

	const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);
	const [editingQuiz, setEditingQuiz] = useState<{
		moduleIndex: number;
		contentIndex: number;
	} | null>(null);

	const [selectedModuleIdForContent, setSelectedModuleIdForContent] =
		useState<string>("");

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

	const [saveStatus, setSaveStatus] = useState<{ global?: string }>({});
	const [pendingChanges, setPendingChanges] = useState<{ [key: string]: any }>({});
	const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

	const savePendingChanges = async () => {
		let changesToSave = {};
		setPendingChanges(currentPending => {
			changesToSave = currentPending;
			return {}; 
		});
	
		if (Object.keys(changesToSave).length === 0) return;
	
		console.log("[savePendingChanges] Saving batch:", changesToSave);
	
		const endpoint = courseId ? `/instructor/courses/${courseId}` : `/instructor/courses/initiate`;
		const isUpdate = Boolean(courseId);
	
		let body;
		const hasFile = Object.values(changesToSave).some(v => v instanceof File);
	
		if (hasFile) {
			body = new FormData();
			for (const key in changesToSave) {
				const value = changesToSave[key];
				if (Array.isArray(value)) {
					value.forEach(item => body.append(`${key}[]`, item));
				} else {
					body.append(key, value);
				}
			}
			if (isUpdate) body.append("_method", "PUT");
		} else {
			body = { ...changesToSave };
			if (isUpdate) body._method = "PUT";
		}
	
		try {
			setSaveStatus({ global: "Saving..." });
			const response = await fetchData(endpoint, { method: "POST", body });
	
			if (!courseId && (response.data?.id || response.id)) {
				setCourseId(response.data?.id || response.id);
			}
			if (response.data?.thumbnail) {
				setCourse(prev => ({ ...prev, thumbnail: response.data.thumbnail }));
			}
			
			setSaveStatus({ global: "✅ All changes saved" });
		} catch (err) {
			console.error("[savePendingChanges] Error saving batch:", err);
			setSaveStatus({ global: "❌ Save failed" });
			setPendingChanges(prev => ({ ...changesToSave, ...prev }));
		} finally {
			setTimeout(() => setSaveStatus({}), 3000);
		}
	};

	useEffect(() => {
		if (Object.keys(pendingChanges).length === 0) {
			return;
		}

		if (autoSaveTimerRef.current) {
			clearTimeout(autoSaveTimerRef.current);
		}

		autoSaveTimerRef.current = setTimeout(() => {
			savePendingChanges();
		}, 3000);

		return () => {
			if (autoSaveTimerRef.current) {
				clearTimeout(autoSaveTimerRef.current);
			}
		};
	}, [pendingChanges, courseId]);

	const handleChangeAndDebounce = (field: string, value: any) => {
		setCourse(prev => ({ ...prev, [field]: value }));
		setPendingChanges(prev => ({ ...prev, [field]: value }));
	};
	
	const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const previewUrl = URL.createObjectURL(file);
		setCourse((prev) => ({ ...prev, thumbnail: previewUrl }));
		setPendingChanges(prev => ({ ...prev, thumbnail: file }));
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
					thumbnail: res.data.thumbnail || null,
					video: res.data?.video || "",
				}));
			}
		} catch (err) {
			console.error("Auto-initiate failed:", err);
		}
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
		formData.append("description", moduleData.description || "");
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

			setModuleSaveStatus("✅ Module saved successfully");
		} catch (err) {
			console.error("❌ Failed to save module:", err);
			setModuleSaveStatus("❌ Failed to save module");
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
		formData.append("video_id", lessonData.video_id || "");
		if (lessonData.image) formData.append("image", lessonData.image);

		try {
			const res = await fetchData("/instructor/courses/modules/lessons/store", {
				method: "POST",
				body: formData,
			});
			console.log("✅ Lesson created:", res);
			return res;
		} catch (error) {
			console.error("❌ Failed to add lesson:", error);
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
			console.error("❌ Module update failed:", error);
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
		formData.append("_method", "PUT");

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
			console.error("❌ Failed to update lesson:", err);
			throw err;
		}
	};

// ganti fungsi updateQuiz kamu dengan ini
const updateQuiz = async (quizId: string, payload: any) => {
  const formData = new FormData();

  const {
    title,
    description,
    module_id,
    order,
    questions,
    settings = {},
  } = payload;

  // mapping settings -> field datar sesuai backend
  const {
    passing_grade,
    time_limit,
    max_attempts,
    show_correct_answers,
    automatically_graded,
  } = settings;

  if (title) formData.append("title", title);
  if (description != null) formData.append("description", String(description));
  if (module_id) formData.append("module_id", String(module_id));
  if (order) formData.append("order", String(order));

  // ✅ field wajib – JANGAN kirim sebagai settings JSON
  formData.append("passing_grade", String(passing_grade));
  formData.append("time_limit", String(time_limit));
  formData.append("max_attempts", String(max_attempts));
  formData.append("show_correct_answers", show_correct_answers ? "1" : "0");
  formData.append("automatically_graded", automatically_graded ? "1" : "0");

  if (questions) {
    formData.append("questions", JSON.stringify(questions));
  }

  formData.append("_method", "PUT");

  return await fetchData(`/instructor/courses/quizzes/${quizId}`, {
    method: "POST",
    body: formData,
  });
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
					.then(() => setModuleSaveStatus("✅ Module saved successfully"))
					.catch(() => setModuleSaveStatus("❌ Failed to save module"));
			}
		}, 3000);

		return () => clearTimeout(timeout);
	}, [course.modules, editedModuleIndex]);

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
					result?.message || result?.error || "Failed to delete module";
				throw new Error(fallbackMsg);
			}

			const updatedModules = course.modules.filter(
				(mod) => mod.id !== moduleId
			);
			setCourse((prev) => ({ ...prev, modules: updatedModules }));
			toast.success("✅ Module deleted successfully");
		} catch (error: any) {
			console.error("❌ Failed to delete module:", error);
			toast.error(`❌ ${error.message || "Failed to delete module"}`);
		}
	};

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
			toast.success("✅ Quiz deleted successfully");
		} catch (error) {
			console.error("❌ Failed to delete quiz:", error);
			toast.error("❌ Failed to delete quiz");
		}
	};

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

const updateQuizInState = (quizData: any) => {
  setCourse((prev) => {
    const modules = [...prev.modules];
    const targetModule = modules.find(
      (mod) =>
        mod.id === quizData.module_id || // cocokkan dengan backend
        mod.id === quizData.moduleId // fallback ke camelCase jika ada
    );

    if (targetModule) {
      const contentIndex = targetModule.contents.findIndex((c) => c.id === quizData.id);
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





const addQuiz = async (
  moduleId: string,
  quizData: {
    title: string;
    order: number;
    settings?: {
      passingScore: number;
      timeLimit: number;
      attemptsAllowed: number;
      showAnswers: boolean;
      autoGrading: boolean;
    };
    questions?: {
      title: string;
      description?: string;
      explanation?: string;
      type: string;
      points: number;
      order: number;
      options?: Record<string, any>;
    }[];
  }
) => {
  const {
    title,
    order,
    settings = {
      passingScore: 80,
      timeLimit: 60,
      attemptsAllowed: 3,
      showAnswers: true,
      autoGrading: true,
    },
    questions = [],
  } = quizData;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("module_id", moduleId);
  formData.append("passing_grade", String(settings.passingScore));
  formData.append("time_limit", String(settings.timeLimit));
  formData.append("order", String(order));
  formData.append("max_attempts", String(settings.attemptsAllowed));
  formData.append("show_correct_answers", settings.showAnswers ? "1" : "0");
  formData.append("automatically_graded", settings.autoGrading ? "1" : "0");

  const quizResponse = await fetchData("/instructor/courses/quizzes", {
    method: "POST",
    body: formData,
  });

  const quizId = quizResponse.data?.id;

  if (!quizId) {
    throw new Error("Quiz ID not returned from backend");
  }

  // Kirim pertanyaan jika ada
 for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const qForm = new FormData();
  qForm.append("quiz_id", quizId);
  qForm.append("title", q.title);
  if (q.description) qForm.append("description", q.description);
  if (q.explanation) qForm.append("explanation", q.explanation);
  qForm.append("type", q.type || "true_false");
  qForm.append("points", `${parseInt(q.points?.toString() || "1")}`);
  qForm.append("order", `${parseInt(q.order?.toString() || (i + 1).toString())}`);
  if (q.options) qForm.append("options", JSON.stringify(q.options));

  await fetchData("/instructor/courses/questions", {
    method: "POST",
    body: qForm,
  });
}


  return quizResponse.data;
};



	const addContent = async (
		moduleId: string,
		contentData: Omit<Content, "id"> & { type: "lesson" | "quiz" }
	) => {
		if (!moduleId || moduleId.length < 10) {
			console.error("❌ Invalid Module ID:", moduleId);
			alert("Invalid Module ID. Please refresh the page.");
			return;
		}

		const newContent: Content = {
			...contentData,
			id: Date.now().toString(),
			order: getModuleContents(moduleId).length + 1,
		};

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
			console.log("📤 Sending to backend:", { moduleId, contentData });

			if (contentData.type === "lesson") {
				await addLesson(moduleId, {
					title: contentData.title,
					description: contentData.description || "",
					content: contentData.content || "",
					order: newContent.order,
					video_id: (contentData as any).video_id,
				});
			} else if (contentData.type === "quiz") {
 const newQuiz = await addQuiz(moduleId, {
  title: contentData.title,
  order: newContent.order,
  settings: contentData.settings,
  questions: contentData.data?.questions ?? [],
});

// ✅ Inject module_id kalau backend tidak mengembalikan
const quizWithModuleId = {
  ...newQuiz,
  module_id: newQuiz.module_id ?? moduleId,
  type: "quiz",
};

console.log("✅ Final quiz to update:", quizWithModuleId);

updateQuizInState(quizWithModuleId);


  updateQuizInState({
    ...newQuiz,
    type: "quiz", // pastikan ditandai
  });
}	

			console.log("✅ Content saved successfully");

			const updatedLessons = await getLessonsByModuleId(moduleId);

			setCourse((prev) => {
				const updatedModules = prev.modules.map((module) => {
					if (module.id === moduleId) {
						return {
							...module,
							contents: updatedLessons,
						};
					}
					return module;
				});

				return { ...prev, modules: updatedModules };
			});
		} catch (error: any) {
			console.error("❌ Failed to save content:", error);

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

			alert("❌ Failed to save content. Please check the module ID or your network.");
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

			const data = res?.data ?? res;

			if (!Array.isArray(data)) {
				console.error("❌ Response is not an array:", res);
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
			console.error("❌ Failed to fetch lesson data:", error);
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
					}, module.id)
						.then(() => setLessonSaveStatus("✅ Lesson saved successfully"))
						.catch(() => setLessonSaveStatus("❌ Failed to save lesson"));
				}
			}
		}, 3000);

		return () => clearTimeout(timeout);
	}, [course.modules, editedLessonIndex]);

	const [editedQuizIndex, setEditedQuizIndex] = useState<{
		moduleIndex: number;
		quizIndex: number;
	} | null>(null);

useEffect(() => {
  const timeout = setTimeout(() => {
    if (editedQuizIndex !== null) {
      const { moduleIndex, quizIndex } = editedQuizIndex;
      const module = course.modules[moduleIndex];
      const quiz = module.contents[quizIndex];

      if (quiz && quiz.type === "quiz") {
        const s = quiz.settings || {};
        updateQuiz(quiz.id, {
          title: quiz.title,
          description: quiz.data?.description || "",
          module_id: module.id,
          order: quiz.order || quizIndex + 1,
          settings: {
            // ✅ pakai nama yang benar & pastikan ada nilainya
            passing_grade: s.passingScore ?? 80,
            time_limit: s.timeLimit ?? 60,
            max_attempts: (typeof s.attemptsAllowed === "number" ? s.attemptsAllowed : 1),
            show_correct_answers: !!s.showAnswers,
            automatically_graded: !!s.autoGrading,
          },
        })
          .then(() => setQuizSaveStatus("✅ Quiz saved successfully"))
          .catch(() => setQuizSaveStatus("❌ Failed to save quiz"));
      }
    }
  }, 3000);

  return () => clearTimeout(timeout);
}, [course.modules, editedQuizIndex]);


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
						.then(() => setQuizSaveStatus("✅ Quiz saved successfully"))
						.catch(() => setQuizSaveStatus("❌ Failed to save quiz"));
				}
			}
		}, 3000);

		return () => clearTimeout(timeout);
	}, [course.modules, editedQuizIndex]);

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

		return (result ?? []).map((content, index) => ({
			...content,
			order: index + 1,
		}));
	};

	const addCategory = (category: string) => {
		if (!course.categories.includes(category)) {
			const updated = [...course.categories, category];
			handleChangeAndDebounce("categories", updated);
		}
	};

	const removeCategory = (category: string) => {
		const updated = course.categories.filter((c) => c !== category);
		handleChangeAndDebounce("categories", updated);
	};

	const addTag = (tag: string) => {
		if (!course.tags.includes(tag)) {
			const updated = [...course.tags, tag];
			handleChangeAndDebounce("tags", updated);
		}
	};

	const removeTag = (tag: string) => {
		const updated = course.tags.filter((t) => t !== tag);
		handleChangeAndDebounce("tags", updated);
	};

	const generateDescription = async () => {
		const aiDescriptions = [
			`Master ${course.title} with hands-on projects and real-world examples. This comprehensive course covers everything from basics to advanced concepts, perfect for ${course.level} learners.`,
			`Learn ${course.title} through practical exercises and industry best practices. Build your skills with step-by-step guidance and expert instruction.`,
			`Comprehensive ${course.title} course designed for ${course.level} students. Gain practical experience and build portfolio-worthy projects.`,
		];

		const randomDescription =
			aiDescriptions[Math.floor(Math.random() * (aiDescriptions ?? []).length)];
		handleChangeAndDebounce("description", randomDescription);
	};

	const setDescription = (value: string) => {
		handleChangeAndDebounce("description", value);
	};

const handleDelete = async (
  type: "module" | "lesson" | "quiz" | "question" | "coupon",
  id: string
) => {
  const endpointMap = {
    module: `/instructor/courses/modules/${id}`,
    lesson: `/instructor/courses/modules/lessons/${id}`,
    quiz: `/instructor/courses/quizzes/${id}`, // ✅ perbaikan path quiz
    question: `/instructor/courses/quizzes/questions/${id}`,
    coupon: `/instructor/coupons/${id}`,
  };

  const result = await Swal.fire({
    title: "Are you sure?",
    text: `This will permanently delete the ${type}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await fetchData(endpointMap[type], {
        method: "DELETE",
      });

      Swal.fire("Deleted!", `${type} has been deleted.`, "success");

      // TODO: Refresh state here if needed
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        `Failed to delete ${type}.`;

      Swal.fire("Error!", message, "error");
    }
  }
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
						<span className="text-sm text-gray-500">{saveStatus.global}</span>
					)}
					<Button>Save Draft</Button>
					<Button>Preview Course</Button>
				</div>
			</div>

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
										value={course.title ?? ""}
										onChange={(e) => handleChangeAndDebounce("title", e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="level">Difficulty Level</Label>
									<Select
										value={course.level}
										onValueChange={(value) => handleChangeAndDebounce("level", value)}
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
								</div>
							</div>

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
								<div className="flex gap-2">
									<Input
										placeholder="Add new category"
										id="new-category"
										defaultValue=""
									/>
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
								<div className="flex gap-2">
									<Input
										placeholder="Add new tag"
										id="new-tag"
										defaultValue=""
									/>
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
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="flex items-center space-x-2">
									<Switch
										id="free-preview"
										checked={course.freePreview}
										onCheckedChange={(checked) => handleChangeAndDebounce("freePreview", checked)}
									/>
									<Label htmlFor="free-preview">Enable free preview</Label>
								</div>
								<div className="flex items-center gap-2">
									<Switch
										checked={course.is_visible}
										onCheckedChange={(val) => handleChangeAndDebounce("is_visible", val)}
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
											handleChangeAndDebounce("certificate", newCert);
										}}
									/>
									<Label htmlFor="enable-certificate">
										Enable certificate generation
									</Label>
								</div>
							</div>

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
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

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
														onClick={() => handleDelete("module", module.id)}
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
																__html: module.description || "",
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
																		}
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
  onSubmit={async (data) => {
    await addContent(module.id, data);
    setIsQuizDialogOpen(false); // Tutup dialog setelah submit berhasil
  }}
  onClose={() => setIsQuizDialogOpen(false)} // Optional jaga-jaga
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
																			courseId={courseId!}
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
																						.content || "",
																				video_id:
																					(course.modules[
																						editingLesson.moduleIndex
																					].contents[editingLesson.contentIndex] as any)
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
																					}, moduleId);

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
																					alert("❌ Failed to update lesson.");
																					console.error(err);
																				}
																			}}
																			onClose={() => setIsEditLessonOpen(false)}
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
																						?.description || "",
																			}}
																			onSubmit={async (updatedData) => {
  try {
    const quizId =
      course.modules[editingQuiz.moduleIndex].contents[editingQuiz.contentIndex].id;

    const moduleId = course.modules[editingQuiz.moduleIndex].id;

    // ✅ Safe destructure settings
  const {
  passing_grade = 60,
  time_limit = 30,
  max_attempts = 1,
  show_correct_answers = true,
  automatically_graded = true,
} = updatedData.settings || {};

const fullPayload = {
  ...updatedData,
  module_id: moduleId,
  order: editingQuiz.contentIndex + 1,
  settings: {
    passing_grade,
    time_limit,
    max_attempts,
    show_correct_answers,
    automatically_graded,
  },
};



    await updateQuiz(quizId, fullPayload);

    const updatedModules = [...course.modules];
    updatedModules[editingQuiz.moduleIndex].contents[editingQuiz.contentIndex] = {
      ...updatedModules[editingQuiz.moduleIndex].contents[editingQuiz.contentIndex],
      ...updatedData,
      type: "quiz",
    };

    setCourse((prev) => ({
      ...prev,
      modules: updatedModules,
    }));

    toast.success("✅ Quiz updated successfully!");
    setIsEditQuizOpen(false);
  } catch (error) {
    console.error("❌ Failed to update quiz:", error);
    toast.error("Gagal memperbarui quiz. Silakan coba lagi.");
  }
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
																															setEditingLesson({
																																moduleIndex,
																																contentIndex,
																															});
																															setIsEditLessonOpen(
																																true
																															);
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
																															});
																															setIsEditQuizOpen(
																																true
																															);
																														}}
																													>
																														<Edit className="w-4 h-4" />
																													</Button>
																												)}

																												<div>
																													<span className="text-sm font-medium">
																														{content.title}
																													</span>
																													<Badge variant="secondary" className="text-xs ml-2 capitalize">
																													{content.type === "quiz" ? "Quiz" : "Lesson"}
																													</Badge>

																												</div>
																											</div>
																											<div className="flex items-center gap-1">
																												<Button
  size="sm"
  variant="outline"
  className="text-red-600 bg-transparent"
  onClick={() => handleDelete(content.type, content.id)}
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
											value={course.price ?? 0}
											onChange={(e) => {
												const val = Number.parseFloat(e.target.value) || 0;
												handleChangeAndDebounce("price", val);
											}}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="pricing-type">Pricing Type</Label>
									<Select
										value={pricingType}
										onValueChange={(val) => {
											setPricingType(val);
											handleChangeAndDebounce("type", val);
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
										{course.coupons.map((c) => (
											<div
												key={c.id}
												className="flex items-center justify-between p-3 border rounded-lg"
											>
												<div>
													<div className="flex items-center gap-2">
														<Badge variant="outline">{c.code}</Badge>
														<span className="text-sm font-medium">
															{c.discount_type === "percentage"
																? `${c.amount}% off`
																: `Rp${c.amount} off`}
														</span>
													</div>
													<p className="text-xs text-muted-foreground">
														Valid until {c.valid_until}
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

function ModuleForm({
	onSubmit,
	module,
}: {
	onSubmit: (data: Omit<Module, "id" | "order" | "contents">) => void;
	module?: Module;
}) {
	const [formData, setFormData] = useState({
		title: module?.title || "",
		description: module?.description || "",
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
		videos: [] as File[],
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
			type: "lesson" as const,
			content: formData.content,
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
	onClose,
	quiz
}: {
	onSubmit: (data: Omit<Content, "id" | "order">) => void;
	onClose?: () => void;
	quiz?: { title: string, description: string }
}) {
	const [formData, setFormData] = useState({
		title: quiz?.title || "",
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
		if (onClose) onClose();
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
								value={(currentQuestion.correctAnswer || false).toString()}
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
	coupon,
	setCoupon,
	loading
}: {
	onSubmit: () => void;
	coupon: Coupon;
	setCoupon: React.Dispatch<React.SetStateAction<Coupon>>;
	loading: boolean
}) {

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("📤 Submitted:", coupon);
		onSubmit();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="coupon-code">Coupon Code</Label>
					<Input
						id="coupon-code"
						placeholder="e.g., SAVE20"
						value={coupon.code}
						onChange={(e) =>
							setCoupon((prev) => ({
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
						value={coupon.discount_type}
						onValueChange={(value) =>
							setCoupon((prev) => ({
								...prev,
								discount_type: value as Coupon["discount_type"],
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
						{coupon.discount_type === "percentage"
							? "Discount Percentage"
							: "Discount Amount (Rp)"}
					</Label>
					<Input
						id="discount-value"
						type="number"
						placeholder={
							coupon.discount_type === "percentage" ? "20" : "10000"
						}
						value={coupon.amount}
						onChange={(e) =>
							setCoupon((prev) => ({
								...prev,
								amount: Number.parseFloat(e.target.value) || 0,
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
						value={coupon.usage_limit ?? 0}
						onChange={(e) =>
							setCoupon((prev) => ({
								...prev,
								usage_limit: Number.parseInt(e.target.value) || 0,
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
					value={coupon.valid_until ?? ""}
					onChange={(e) => {
						const dateValue = e.target.value;
						console.log("📅 Selected date (raw):", dateValue);
						setCoupon((prev) => ({
							...prev,
							valid_until: dateValue,
						}));
					}}
					required
				/>
			</div>

			<DialogFooter>
				<Button
					type="submit"
					className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
					disabled={loading}
				>
					{loading ? "Saving..." : "Create Coupon"}
				</Button>
			</DialogFooter>
		</form>
	);
}

// function addQuiz(
// 	moduleId: string,
// 	arg1: {
// 		title: string;
// 		order: number;
// 		passing_grade: number;
// 		time_limit: number;
// 		max_attempts: number;
// 	}
// ) {
// 	throw new Error("Function not implemented.");
// }	
