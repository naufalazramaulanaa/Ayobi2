"use client"

import { X, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-midnight-blue-600" />
            <h2 className="text-lg font-semibold text-midnight-blue-800">Shopping Cart</h2>
            {items.length > 0 && (
              <span className="bg-midnight-blue-100 text-midnight-blue-800 text-sm px-2 py-1 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-4">Add some courses to get started!</p>
              <Button onClick={onClose} className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-midnight-blue-800 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">by {item.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-midnight-blue-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs p-0 h-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-midnight-blue-800">Total:</span>
              <span className="text-xl font-bold text-midnight-blue-800">${total.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Button onClick={handleCheckout} className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900">
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full text-red-500 border-red-200 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
