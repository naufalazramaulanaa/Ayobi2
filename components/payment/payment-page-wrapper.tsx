"use client"

import { useEffect, useState } from "react"
import { PaymentPage } from "./payment-page"

interface OrderItem {
  id: string | number
  title: string
  instructor: string
  price: number
  finalPrice?: number
  voucher?: any
  image?: string
}

interface OrderData {
  items: OrderItem[]
  subtotal: number
  totalDiscount: number
  finalTotal: number
  appliedVouchers: any
}

export function PaymentPageWrapper() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        const savedOrder = localStorage.getItem("eduLMS-order")
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder)
          setOrderData(parsedOrder)
        } else {
          // Default empty order if no data found
          setOrderData({
            items: [],
            subtotal: 0,
            totalDiscount: 0,
            finalTotal: 0,
            appliedVouchers: {},
          })
        }
      } catch (error) {
        console.error("Error loading order data:", error)
        // Set default empty order on error
        setOrderData({
          items: [],
          subtotal: 0,
          totalDiscount: 0,
          finalTotal: 0,
          appliedVouchers: {},
        })
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-midnight-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!orderData || orderData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Order Found</h2>
          <p className="text-gray-600 mb-6">
            It looks like you don't have any items to pay for. Please add some courses to your cart first.
          </p>
          <a
            href="/student/browse-courses"
            className="inline-flex items-center px-4 py-2 bg-midnight-blue-600 text-white rounded-lg hover:bg-midnight-blue-700 transition-colors"
          >
            Browse Courses
          </a>
        </div>
      </div>
    )
  }

  return <PaymentPage orderData={orderData} />
}
