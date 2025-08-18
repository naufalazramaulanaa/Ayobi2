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
  is_visible: boolean;
  is_published: boolean;
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


export default function CourseStructure() {
  return (
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
  );
}
