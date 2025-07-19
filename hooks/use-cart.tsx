"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Course {
  id: string | number
  title: string
  instructor: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  students?: number
  duration: string
  level: string
  category?: string
}

interface CartItem extends Course {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Course }
  | { type: "REMOVE_ITEM"; payload: string | number }
  | { type: "UPDATE_QUANTITY"; payload: { id: string | number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addItem: (course: Course) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  items: CartItem[]
  total: number
  itemCount: number
  isInCart: (id: string | number) => boolean
  addToCart: (course: Course) => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id.toString() === action.payload.id.toString())

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id.toString() === action.payload.id.toString() ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id.toString() !== action.payload.toString()),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id.toString() === action.payload.id.toString() ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      }

    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  })

  // Calculate total whenever items change
  const total = calculateTotal(state.items)
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items])

  const addItem = (course: Course) => {
    dispatch({ type: "ADD_ITEM", payload: course })
  }

  const addToCart = (course: Course) => {
    dispatch({ type: "ADD_ITEM", payload: course })
  }

  const removeItem = (id: string | number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const isInCart = (id: string | number): boolean => {
    return state.items.some((item) => item.id.toString() === id.toString())
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        items: state.items,
        total,
        itemCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
