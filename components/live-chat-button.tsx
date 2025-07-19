"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Minimize2, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Position {
  x: number
  y: number
}

export function LiveChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! 👋 I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState<Position>({ x: 0, y: 0 })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Hide chat button only on specific dashboard and payment pages
  const shouldHideChat =
    pathname?.includes("/student/dashboard") ||
    pathname?.includes("/instructor/dashboard") ||
    pathname?.includes("/admin/dashboard") ||
    pathname?.includes("/reviewer/dashboard") ||
    pathname?.includes("/payment") ||
    pathname?.includes("/checkout")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Reset position when chat opens
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  // Handle mouse down on header (start dragging)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && (e.target.closest("button") || e.target.closest("input"))) {
      return // Don't drag if clicking on buttons or inputs
    }

    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialPosition(position)

    // Prevent text selection
    e.preventDefault()
  }

  // Handle mouse move (dragging)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      const newX = initialPosition.x + deltaX
      const newY = initialPosition.y + deltaY

      // Get window dimensions
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const chatWidth = 384 // max-w-96 = 384px
      const chatHeight = isMinimized ? 64 : 500

      // Constrain to window bounds
      const constrainedX = Math.max(-(windowWidth / 2 - chatWidth / 2), Math.min(windowWidth / 2 - chatWidth / 2, newX))
      const constrainedY = Math.max(
        -(windowHeight / 2 - chatHeight / 2),
        Math.min(windowHeight / 2 - chatHeight / 2, newY),
      )

      setPosition({ x: constrainedX, y: constrainedY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, dragStart, initialPosition, isMinimized])

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement && (e.target.closest("button") || e.target.closest("input"))) {
      return
    }

    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setInitialPosition(position)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y

    const newX = initialPosition.x + deltaX
    const newY = initialPosition.y + deltaY

    // Get window dimensions
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const chatWidth = Math.min(windowWidth * 0.9, 384)
    const chatHeight = isMinimized ? 64 : Math.min(windowHeight * 0.8, 500)

    // Constrain to window bounds
    const constrainedX = Math.max(-(windowWidth / 2 - chatWidth / 2), Math.min(windowWidth / 2 - chatWidth / 2, newX))
    const constrainedY = Math.max(
      -(windowHeight / 2 - chatHeight / 2),
      Math.min(windowHeight / 2 - chatHeight / 2, newY),
    )

    setPosition({ x: constrainedX, y: constrainedY })
    e.preventDefault()
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thanks for your message! I'm here to help you with any questions about our courses.",
        "That's a great question! Let me help you find the information you need.",
        "I'd be happy to assist you with that. What specific topic are you interested in?",
        "Great! I can help you explore our course catalog and find the perfect fit for your learning goals.",
        "I understand you're looking for more information. Feel free to ask me anything about our platform!",
        "Excellent question! Our courses are designed by industry experts to give you practical, real-world skills.",
        "I'm here to help! Would you like me to recommend some courses based on your interests?",
        "That's wonderful! Learning new skills is always a great investment. How can I assist you today?",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Don't render if should hide
  if (shouldHideChat) {
    return null
  }

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => !isDragging && setIsOpen(false)} />}

      {/* Chat Button - Removed animate-pulse */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-midnight-blue-600 to-midnight-blue-700 hover:from-midnight-blue-700 hover:to-midnight-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Draggable Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed top-1/2 left-1/2 z-50 animate-in fade-in-0 zoom-in-95 duration-300"
          style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <Card
            className={`w-[90vw] max-w-96 shadow-2xl border-0 ${isMinimized ? "h-16" : "h-[500px] max-h-[80vh]"} transition-all duration-300 ${isDragging ? "shadow-3xl scale-105" : ""}`}
          >
            {/* Draggable Header */}
            <CardHeader
              className={`bg-gradient-to-r from-midnight-blue-600 to-midnight-blue-700 text-white rounded-t-lg p-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"} select-none`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-yellow-500 text-black">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      EduLMS Assistant
                      <Move className="w-3 h-3 opacity-60" />
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-200">Online • Drag to move</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-midnight-blue-800 h-8 w-8"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-midnight-blue-800 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Chat Content */}
            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-full">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[80%]`}>
                          {message.sender === "bot" && (
                            <Avatar className="w-6 h-6 mt-1">
                              <AvatarFallback className="bg-midnight-blue-100 text-midnight-blue-600">
                                <Bot className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`p-3 rounded-2xl text-sm ${
                              message.sender === "user"
                                ? "bg-midnight-blue-600 text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-800 rounded-bl-sm"
                            }`}
                          >
                            <p>{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "user" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {message.sender === "user" && (
                            <Avatar className="w-6 h-6 mt-1">
                              <AvatarFallback className="bg-yellow-500 text-black">
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="bg-midnight-blue-100 text-midnight-blue-600">
                              <Bot className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border-gray-200 focus:border-midnight-blue-400"
                      disabled={isTyping}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-midnight-blue-600 hover:bg-midnight-blue-700"
                      disabled={isTyping || !newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Powered by AI • Available 24/7</p>
                </form>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
