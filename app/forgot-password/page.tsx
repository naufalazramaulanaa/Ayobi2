"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const BASE_URL = "https://api.ayobilearning.com/api"
const API_KEY = "j5przhP5sjTF7PyFXBAFiM685ajXJnwUmpxvQPsmVG4xXyiYH2NoIrQYTwynBsK3"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new URLSearchParams()
    formData.append("email", email)

    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to send reset link")

      setStatus("sent")
      setMessage("Reset password link sent. Please check your email.")
    } catch (err: any) {
      setStatus("error")
      setMessage("Failed to send reset email. " + err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-blue-50 to-midnight-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900">
              Send Reset Link
            </Button>
          </form>
          {status !== "idle" && (
            <p className={`text-sm mt-4 ${status === "sent" ? "text-green-600" : "text-red-600"}`}>{message}</p>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
