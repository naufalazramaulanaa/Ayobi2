// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Mail } from "lucide-react";

import { fetchData } from "@/lib/api";

const BASE_URL = "https://api.ayobilearning.com/api";
const API_KEY =
  "j5przhP5sjTF7PyFXBAFiM685ajXJnwUmpxvQPsmVG4xXyiYH2NoIrQYTwynBsK3";

interface LoginFormProps {
  onLogin: (
    email: string,
    role: "admin" | "instructor" | "student" | "reviewer"
  ) => void;
  onBackToLanding?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({
  onLogin,
  onBackToLanding,
  onSwitchToRegister,
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const form

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await fetchData("/login", {
        method: "POST",
        body: formData
      });

      const data = result.data;

      const rawRole = data?.user?.roles?.[0] || "student";
      const userRole = rawRole === "super-admin" ? "admin" : rawRole;

      // ✅ Simpan token dan user info
      document.cookie = `access_token=${data.token}; path=/; max-age=3600`;

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userRole", userRole);

      onLogin(email, userRole);
    } catch (err: any) {
      // alert("Login error: " + err.message);
      console.log(err);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const otpPayload = new URLSearchParams();
      otpPayload.append("code", otpCode);

      const res = await fetch(`${BASE_URL}/otp/verify`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: otpPayload.toString(),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || data.error || "OTP Verification failed"
        );

      alert("✅ OTP verified! Silakan login kembali.");
      setShowOtpModal(false);
      router.push("/login");
    } catch (err: any) {
      alert("❌ OTP Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-blue-50 to-midnight-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-midnight-blue-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your LMS account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
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
            <Button
              type="submit"
              className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900"
            >
              Sign In
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowOtpModal(true)}
          >
            Verify OTP
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Button variant="link" onClick={onSwitchToRegister}>
              Sign up
            </Button>
          </p>
          <Button variant="ghost" onClick={onBackToLanding}>
            ← Back to Home
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter OTP Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="otp">Code</Label>
            <Input
              id="otp"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="6-digit OTP"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleOtpSubmit}
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
