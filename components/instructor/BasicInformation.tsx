"use client";

import type React from "react";
import { useCourseContext } from "./CourseContext";
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

import { handleCouponSubmit } from "./courseLogic";

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


export default function BasicInformation() {
  
  return (
    

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
                  <Input placeholder="Add new category" id="new-category" defaultValue="" />
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
                  <Input placeholder="Add new tag" id="new-tag" defaultValue="" />
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
  );
}
