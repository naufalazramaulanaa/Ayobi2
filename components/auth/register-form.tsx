"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { fetchData } from "@/lib/api";

const BASE_URL = "https://api.ayobilearning.com/api";
const API_KEY =
  "j5przhP5sjTF7PyFXBAFiM685ajXJnwUmpxvQPsmVG4xXyiYH2NoIrQYTwynBsK3";

interface RegisterFormProps {
  onRegister: (
    email: string,
    role: "admin" | "instructor" | "student" | "reviewer"
  ) => void;
  onBackToLanding?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onRegister,
  onBackToLanding,
  onSwitchToLogin,
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy!");
      return;
    }

    // const payload = new URLSearchParams()
    // payload.append("email", formData.email)
    // payload.append("password", formData.password)
    // payload.append("fullname", formData.fullname)
    // payload.append("tnc_acceptance", "true")

    try {
      const result = await fetchData("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          tnc_acceptance: true,
        },
      });
      // const res = await fetch(`${BASE_URL}/register`, {
      //   method: "POST",
      //   headers: {
      //     "x-api-key": API_KEY,
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body: payload.toString(),
      // })

      const data = result.data;
      console.log(result);

      if (result.status == false) {
        console.log('asda')
        // router.push('/login')
      }

      if (data.email_verified_at == null) {
        setShowOtpModal(true);
      } 

    } catch (err: any) {
      // alert("Registration error: " + err.message)
      console.log(err);
    }
  };

  const handleOtpVerify = async () => {
    try {
      const payload = new URLSearchParams();
      payload.append("code", otpCode);

      const res = await fetch(`${BASE_URL}/otp/verify`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || "OTP verification failed"
        );

      alert("✅ OTP verified successfully!");
      setShowOtpModal(false);
      router.push("/login");
    } catch (err: any) {
      alert("OTP error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-blue-50 to-midnight-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold text-center text-midnight-blue-800">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join EduLMS and start your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={formData.fullname}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", Boolean(checked))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-midnight-blue-800 underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-midnight-blue-800 underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900"
            >
              <User className="mr-2 h-4 w-4" /> Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSwitchToLogin}
            >
              Sign in
            </Button>
          </p>
          {onBackToLanding && (
            <Button
              variant="ghost"
              onClick={onBackToLanding}
              className="w-full"
            >
              ← Back to Home
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-midnight-blue-800">
              Verify OTP
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter the code sent to your email"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleOtpVerify}
              className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
