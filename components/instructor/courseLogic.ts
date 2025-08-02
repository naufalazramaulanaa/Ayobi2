// 🔧 Logic untuk CourseCreator Modules, Lessons, Quizzes, Coupons
// Semua fungsi di sini bisa diimpor di komponen terkait
// Gunakan sesuai kebutuhan di CourseStructure, PricingAndCoupon, dst.

import axios from "axios";

export async function addModule(courseId: string, moduleData: any) {
  try {
    const response = await axios.post(`/instructor/courses/${courseId}/modules/store`, moduleData);
    return response.data;
  } catch (error) {
    console.error("Failed to add module:", error);
    throw error;
  }
}

export async function addLesson(moduleId: string, lessonData: any) {
  try {
    const response = await axios.post(`/instructor/courses/modules/${moduleId}/lessons/store`, lessonData);
    return response.data;
  } catch (error) {
    console.error("Failed to add lesson:", error);
    throw error;
  }
}

export async function addQuiz(moduleId: string, quizData: any) {
  try {
    const response = await axios.post(`/instructor/courses/modules/${moduleId}/quizzes/store`, quizData);
    return response.data;
  } catch (error) {
    console.error("Failed to add quiz:", error);
    throw error;
  }
}

export async function fetchCoupon(courseId: string) {
  try {
    const response = await axios.get(`/instructor/courses/${courseId}/coupons`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch coupon:", error);
    return [];
  }
}

export async function handleCouponSubmit(courseId: string, couponData: any) {
  try {
    const response = await axios.post(`/instructor/courses/${courseId}/coupons/store`, couponData);
    return response.data;
  } catch (error) {
    console.error("Failed to submit coupon:", error);
    throw error;
  }
}

// 🧩 Tambahkan fungsi lain seperti update/delete module/lesson/quiz jika diperlukan



export async function updateModule(moduleId: string, moduleData: any) {
  try {
    const formData = new FormData();
    Object.entries(moduleData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetchData(`/instructor/courses/modules/${moduleId}`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to update module:", error);
    throw error;
  }
}
