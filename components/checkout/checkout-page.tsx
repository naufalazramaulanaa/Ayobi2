"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Tag, Lock, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"

interface ItemVoucher {
  [itemId: string]: {
    code: string
    discount: number
    isApplied: boolean
  }
}

export function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [itemVouchers, setItemVouchers] = useState<ItemVoucher>({})
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const handleApplyVoucher = (itemId: string, voucherCode: string) => {
    let discount = 0
    let isValid = false

    // Simulate voucher validation
    if (voucherCode.toLowerCase() === "save10") {
      discount = 0.1 // 10%
      isValid = true
    } else if (voucherCode.toLowerCase() === "welcome20") {
      discount = 0.2 // 20%
      isValid = true
    } else if (voucherCode.toLowerCase() === "student15") {
      discount = 0.15 // 15%
      isValid = true
    }

    if (isValid) {
      setItemVouchers((prev) => ({
        ...prev,
        [itemId]: {
          code: voucherCode,
          discount,
          isApplied: true,
        },
      }))
      toast({
        title: "Voucher applied!",
        description: `${discount * 100}% discount applied to this course`,
        variant: "default",
      })
    } else {
      toast({
        title: "Invalid voucher code",
        description: "Please check your voucher code and try again",
        variant: "destructive",
      })
    }
  }

  const handleRemoveVoucher = (itemId: string) => {
    setItemVouchers((prev) => {
      const updated = { ...prev }
      delete updated[itemId]
      return updated
    })
    toast({
      title: "Voucher removed",
      description: "Discount has been removed from this course",
      variant: "default",
    })
  }

  const calculateItemPrice = (item: any) => {
    const voucher = itemVouchers[item.id]
    if (voucher?.isApplied) {
      return item.price * (1 - voucher.discount)
    }
    return item.price
  }

  const calculateTotalDiscount = () => {
    const itemDiscount = items.reduce((totalDiscount, item) => {
      const voucher = itemVouchers[item.id]
      if (voucher?.isApplied) {
        return totalDiscount + item.price * voucher.discount
      }
      return totalDiscount
    }, 0)

    let promoDiscount = 0
    if (appliedPromo) {
      promoDiscount = total * (appliedPromo.discount / 100)
    }

    return itemDiscount + promoDiscount
  }

  const finalTotal = items.reduce((sum, item) => sum + calculateItemPrice(item), 0)
  const totalDiscount = calculateTotalDiscount()

  const handleProceedToPayment = async () => {
    setIsLoading(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store order info in localStorage for payment page
    localStorage.setItem(
      "eduLMS-order",
      JSON.stringify({
        items: items.map((item) => ({
          ...item,
          finalPrice: calculateItemPrice(item),
          voucher: itemVouchers[item.id] || null,
        })),
        subtotal: total,
        totalDiscount,
        finalTotal,
        appliedVouchers: itemVouchers,
      }),
    )

    router.push("/payment")
    setIsLoading(false)
  }

  const handleApplyPromoCode = () => {
    setIsApplyingPromo(true)
    setTimeout(() => {
      if (promoCode.toLowerCase() === "summer20") {
        setAppliedPromo({ code: "SUMMER20", discount: 20 })
        toast({
          title: "Promo code applied!",
          description: "20% discount applied to your order",
          variant: "default",
        })
      } else {
        toast({
          title: "Invalid promo code",
          description: "Please check your promo code and try again",
          variant: "destructive",
        })
        setAppliedPromo(null)
      }
      setIsApplyingPromo(false)
    }, 500)
  }

  const handleRemovePromoCode = () => {
    setAppliedPromo(null)
    setPromoCode("")
    toast({
      title: "Promo code removed",
      description: "Discount has been removed from your order",
      variant: "default",
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some courses to your cart before checkout</p>
            <Button onClick={() => router.push("/student/browse-courses")}>Browse Courses</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-midnight-blue-800">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Order Items ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => {
                  const voucher = itemVouchers[item.id]
                  const originalPrice = item.price
                  const finalPrice = calculateItemPrice(item)
                  const hasDiscount = voucher?.isApplied

                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      {/* Course Info - Perbaiki layout */}
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full sm:w-20 h-32 sm:h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-midnight-blue-800 mb-1 text-sm sm:text-base line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">by {item.instructor}</p>
                          <div className="flex items-center space-x-2 text-xs sm:text-sm">
                            <span className="text-gray-500 truncate">{item.duration}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500 truncate">{item.level}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 w-full sm:w-auto">
                          {hasDiscount ? (
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-400 line-through">
                                ${originalPrice.toFixed(2)}
                              </p>
                              <p className="text-base sm:text-lg font-bold text-green-600">${finalPrice.toFixed(2)}</p>
                              <p className="text-xs text-green-600">{voucher.discount * 100}% off</p>
                            </div>
                          ) : (
                            <p className="text-base sm:text-lg font-bold text-midnight-blue-800">
                              ${originalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Voucher Section - Responsive */}
                      <div className="border-t border-gray-100 pt-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Apply Voucher Code</Label>
                        {!hasDiscount ? (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Input
                              placeholder="Enter voucher code"
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  const target = e.target as HTMLInputElement
                                  handleApplyVoucher(item.id, target.value)
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={(e) => {
                                const input = e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement
                                if (input?.value) {
                                  handleApplyVoucher(item.id, input.value)
                                }
                              }}
                            >
                              <Percent className="w-4 h-4 mr-1" />
                              Apply
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <Percent className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm font-medium text-green-800 truncate">
                                {voucher.code.toUpperCase()} - {voucher.discount * 100}% OFF
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVoucher(item.id)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Try: SAVE10, WELCOME20, or STUDENT15</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Summary - Mobile responsive */}
                <div className="space-y-2">
                  {items.map((item) => {
                    const finalPrice = calculateItemPrice(item)
                    const hasDiscount = itemVouchers[item.id]?.isApplied

                    return (
                      <div key={item.id} className="flex justify-between items-start text-sm gap-2">
                        <span className="truncate flex-1 mr-2 leading-tight">{item.title}</span>
                        <div className="text-right flex-shrink-0">
                          {hasDiscount ? (
                            <div className="space-y-1">
                              <div className="text-gray-400 line-through text-xs">${item.price}</div>
                              <div className="text-green-600 font-semibold">${finalPrice.toFixed(2)}</div>
                            </div>
                          ) : (
                            <span className="font-semibold">${item.price}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add after the items summary and before totals */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Promo Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyPromoCode}
                      disabled={!promoCode || isApplyingPromo}
                    >
                      {isApplyingPromo ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                      <span className="text-sm text-green-800">
                        {appliedPromo.code} - {appliedPromo.discount}% OFF
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleRemovePromoCode}>
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Total Discount:</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-midnight-blue-800">
                      ${(finalTotal - (appliedPromo ? total * (appliedPromo.discount / 100) : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={isLoading}
                  className="w-full bg-midnight-blue-600 hover:bg-midnight-blue-700"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">Secure checkout • SSL encrypted</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
