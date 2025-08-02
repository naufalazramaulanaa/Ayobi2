"use client";


import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useCourseContext } from "./CourseContext";
import { handleCouponSubmit } from "./courseLogic";

export default function CouponForm({ onClose }: { onClose?: () => void }) {
  const { courseData, setCourseData, triggerAutoSaveGlobal } = useCourseContext();

  const [coupon, setCoupon] = useState({
    code: "",
    discount_type: "percentage",
    amount: 0,
    usage_limit: 1,
    valid_until: "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!courseData?.id) {
      console.error("No course ID available.");
      return;
    }

    setLoading(true);
    try {
      const saved = await handleCouponSubmit(courseData.id, coupon);
      setCourseData((prev: any) => ({
        ...prev,
        coupons: [...(prev.coupons || []), saved],
      }));
      triggerAutoSaveGlobal();
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to submit coupon:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Coupon Code</Label>
        <Input
          value={coupon.code}
          onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
        />
      </div>

      <div>
        <Label>Discount Type</Label>
        <Select
          value={coupon.discount_type}
          onValueChange={(val) => setCoupon({ ...coupon, discount_type: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          value={coupon.amount}
          onChange={(e) => setCoupon({ ...coupon, amount: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label>Usage Limit</Label>
        <Input
          type="number"
          value={coupon.usage_limit}
          onChange={(e) => setCoupon({ ...coupon, usage_limit: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label>Valid Until</Label>
        <Input
          type="date"
          value={coupon.valid_until}
          onChange={(e) => setCoupon({ ...coupon, valid_until: e.target.value })}
        />
      </div>

      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Coupon"}
      </Button>
    </div>
  );
}
