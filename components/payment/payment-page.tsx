"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Building2, QrCode, Shield, CheckCircle, ArrowLeft, Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

interface PaymentPageProps {
  orderData: OrderData
}

const bankOptions = [
  { value: "bri", label: "Bank BRI", code: "002" },
  { value: "bni", label: "Bank BNI", code: "009" },
  { value: "mandiri", label: "Bank Mandiri", code: "008" },
  { value: "bca", label: "Bank BCA", code: "014" },
]

export function PaymentPage({ orderData }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [virtualAccount, setVirtualAccount] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const router = useRouter()

  // Safe access to orderData with defaults
  const items = orderData?.items || []
  const subtotal = orderData?.subtotal || 0
  const totalDiscount = orderData?.totalDiscount || 0
  const finalTotal = orderData?.finalTotal || 0

  const tax = subtotal * 0.1
  const total = finalTotal + tax

  const generateVirtualAccount = () => {
    const selectedBankData = bankOptions.find((bank) => bank.value === selectedBank)
    if (selectedBankData) {
      const randomNumber = Math.floor(Math.random() * 1000000000000)
        .toString()
        .padStart(12, "0")
      return `${selectedBankData.code}${randomNumber}`
    }
    return ""
  }

  const copyVirtualAccount = () => {
    navigator.clipboard.writeText(virtualAccount)
    toast({
      title: "Copied!",
      description: "Virtual Account number copied to clipboard.",
    })
  }

  const handlePayment = async () => {
    if (paymentMethod === "bank-transfer" && !selectedBank) {
      toast({
        title: "Error",
        description: "Please select a bank first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Generate Virtual Account for bank transfer
    if (paymentMethod === "bank-transfer") {
      const va = generateVirtualAccount()
      setVirtualAccount(va)
    }

    // Show payment dialog
    setShowPaymentDialog(true)
    setIsProcessing(false)
  }

  const handlePaymentConfirm = () => {
    setShowPaymentDialog(false)

    // Show success notification
    toast({
      title: "Payment Successful! 🎉",
      description: "Your courses have been added to your library. Redirecting to dashboard...",
      duration: 3000,
    })

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/student/dashboard")
    }, 2000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Show empty state if no items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Items to Pay</h2>
          <p className="text-gray-600 mb-6">
            Your cart is empty. Please add some courses before proceeding to payment.
          </p>
          <Button onClick={() => router.push("/student/browse-courses")}>Browse Courses</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-midnight-blue-800">Complete Your Purchase</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Secure checkout powered by industry-standard encryption
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Shield className="w-5 h-5" />
                  <span>Select Payment Method</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Choose your preferred payment method. All transactions are secure and encrypted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* Credit Card */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                        </div>
                      </Label>
                    </div>

                    {/* Bank Transfer with Dropdown */}
                    <div className="border rounded-lg">
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <Building2 className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-sm text-gray-500">Transfer via Virtual Account</div>
                          </div>
                        </Label>
                      </div>

                      {/* Bank Selection Dropdown - Shows when bank transfer is selected */}
                      {paymentMethod === "bank-transfer" && (
                        <div className="px-4 pb-4 border-t bg-gray-50">
                          <Label htmlFor="bank-select" className="block text-sm font-medium mb-2">
                            Select Bank
                          </Label>
                          <Select value={selectedBank} onValueChange={setSelectedBank}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              {bankOptions.map((bank) => (
                                <SelectItem key={bank.value} value={bank.value}>
                                  {bank.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* QRIS Only */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="qris" id="qris" />
                      <Label htmlFor="qris" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <QrCode className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">QRIS</div>
                          <div className="text-sm text-gray-500">Scan QR code to pay</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Credit Card Form */}
            {paymentMethod === "credit-card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Information</CardTitle>
                  <CardDescription>Enter your card details below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{items.length} course(s) selected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course List */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full sm:w-16 h-32 sm:h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-midnight-blue-800 line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">by {item.instructor}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.voucher ? (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</p>
                            <p className="text-sm sm:text-base font-bold text-green-600">
                              {formatPrice(item.finalPrice || item.price)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm sm:text-base font-bold text-midnight-blue-800">
                            {formatPrice(item.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} courses):</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-midnight-blue-800">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!paymentMethod || isProcessing}
                  className="w-full bg-midnight-blue-600 hover:bg-midnight-blue-700"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Payment - {formatPrice(total)}</span>
                    </div>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-4">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{paymentMethod === "bank-transfer" ? "Virtual Account" : "QRIS Payment"}</DialogTitle>
              <DialogDescription>
                {paymentMethod === "bank-transfer"
                  ? "Use this Virtual Account number to complete your payment"
                  : "Scan the QR code below to complete your payment"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {paymentMethod === "bank-transfer" ? (
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Virtual Account Number</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="text-lg font-mono bg-white px-3 py-2 rounded border">{virtualAccount}</code>
                      <Button variant="ghost" size="sm" onClick={copyVirtualAccount}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">Bank: {bankOptions.find((b) => b.value === selectedBank)?.label}</p>
                    <p className="font-medium">Amount: {formatPrice(total)}</p>
                    <p className="text-xs text-yellow-600 mt-2">⚠️ Transfer the exact amount to activate your courses</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border">
                    <div className="w-48 h-48 bg-white border-2 border-dashed border-purple-300 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-purple-400" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">Amount: {formatPrice(total)}</p>
                    <p className="text-xs mt-2">Scan with any QRIS-enabled app</p>
                    <p className="text-xs text-yellow-600">⚠️ Payment will be processed automatically</p>
                  </div>
                </div>
              )}

              <Button onClick={handlePaymentConfirm} className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                OK, I've Completed the Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
