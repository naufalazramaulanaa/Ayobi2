"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Course } from "@/hooks/use-cart"

interface CartButtonProps {
  course: Course
  isInCart?: boolean
  onAddToCart?: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CartButton({
  course,
  isInCart = false,
  onAddToCart,
  variant = "outline",
  size = "sm",
  className,
}: CartButtonProps) {
  const handleClick = () => {
    if (!isInCart && onAddToCart) {
      onAddToCart()
    }
  }

  return (
    <Button
      variant={isInCart ? "secondary" : variant}
      size={size}
      onClick={handleClick}
      disabled={isInCart}
      className={cn("flex items-center gap-2", isInCart && "cursor-not-allowed opacity-75", className)}
    >
      {isInCart ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-xs">In Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span className="text-xs">Add to Cart</span>
        </>
      )}
    </Button>
  )
}
