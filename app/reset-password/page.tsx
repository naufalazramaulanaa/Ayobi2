"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const BASE_URL = "https://api.ayobilearning.com/api"
const API_KEY = "j5przhP5sjTF7PyFXBAFiM685ajXJnwUmpxvQPsmVG4xXyiYH2NoIrQYTwynBsK3"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      setStatus("error")
      return
    }

    const formData = new URLSearchParams()
    formData.append("email", email)
    formData.append("token", token)
    formData.append("password", password)
    formData.append("password_confirmation", confirmPassword)

    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error("Reset error:", data)
        throw new Error(data.message || "Reset failed")
      }

      setMessage("Password reset successful.")
      setStatus("success")
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (err: any) {
      setMessage(err.message)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-blue-50 to-midnight-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-midnight-blue-800">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900"
              disabled={status === "success"}
            >
              Reset Password
            </Button>
            {message && (
              <p className={`text-sm mt-2 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            ← Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
