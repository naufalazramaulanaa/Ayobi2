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


export default function PricingAndCoupon() {
  return (
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
  );
}
