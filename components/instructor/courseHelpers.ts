// 🧠 courseHelpers.ts
// Fungsi manipulasi lokal terhadap state courseData
// Cocok untuk update, reorder, dan filter konten modul/lesson/quiz

export function updateModuleInState(courseData: any, updatedModule: any) {
  const updatedModules = courseData.modules.map((mod: any) =>
    mod.id === updatedModule.id ? { ...mod, ...updatedModule } : mod
  );
  return { ...courseData, modules: updatedModules };
}

export function updateLessonInState(courseData: any, moduleId: string, updatedLesson: any) {
  const updatedModules = courseData.modules.map((mod: any) => {
    if (mod.id !== moduleId) return mod;
    const updatedLessons = mod.lessons.map((lesson: any) =>
      lesson.id === updatedLesson.id ? { ...lesson, ...updatedLesson } : lesson
    );
    return { ...mod, lessons: updatedLessons };
  });
  return { ...courseData, modules: updatedModules };
}

export function updateQuizInState(courseData: any, moduleId: string, updatedQuiz: any) {
  const updatedModules = courseData.modules.map((mod: any) => {
    if (mod.id !== moduleId) return mod;
    const updatedQuizzes = mod.quizzes.map((quiz: any) =>
      quiz.id === updatedQuiz.id ? { ...quiz, ...updatedQuiz } : quiz
    );
    return { ...mod, quizzes: updatedQuizzes };
  });
  return { ...courseData, modules: updatedModules };
}

export function getLessonsByModuleId(courseData: any, moduleId: string) {
  const module = courseData.modules.find((mod: any) => mod.id === moduleId);
  return module?.lessons || [];
}

export function reorderContents(module: any, updatedOrder: string[]) {
  const allContents = [...(module.lessons || []), ...(module.quizzes || [])];
  const reordered = updatedOrder
    .map((id) => allContents.find((item) => item.id === id))
    .filter(Boolean);
  return reordered;
}

export function getModuleContents(module: any) {
  const allContents = [...(module.lessons || []), ...(module.quizzes || [])];
  return allContents.sort((a, b) => a.order - b.order);
}
