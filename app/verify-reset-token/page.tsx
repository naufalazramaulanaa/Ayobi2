"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

const BASE_URL = "https://api.ayobilearning.com/api"
const API_KEY = "j5przhP5sjTF7PyFXBAFiM685ajXJnwUmpxvQPsmVG4xXyiYH2NoIrQYTwynBsK3"

export default function VerifyResetTokenPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">("checking")

  useEffect(() => {
    const verify = async () => {
      if (!email || !token) {
        setStatus("invalid")
        return
      }

      try {
        const res = await fetch(`${BASE_URL}/reset-password/${email}/verify-reset-password-token`, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
          },
        })

        if (!res.ok) throw new Error("Invalid token")
        setStatus("valid")

        // redirect to reset password page
        setTimeout(() => {
          router.push(`/reset-password?email=${email}&token=${token}`)
        }, 1000)
      } catch {
        setStatus("invalid")
      }
    }

    verify()
  }, [email, token, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "checking" && <p>Checking token...</p>}
      {status === "valid" && <p>Valid token. Redirecting...</p>}
      {status === "invalid" && <p className="text-red-600">Invalid or expired token.</p>}
    </div>
  )
}
