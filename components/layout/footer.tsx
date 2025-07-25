"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      })  
      setEmail("")
    }
  }

  return (
    <footer className="bg-midnight-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-xl font-bold">EduLMS</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering learners worldwide with high-quality online education. Join thousands of students advancing
              their careers with expert-led courses.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@edulms.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/courses" className="hover:text-yellow-400 transition-colors">
                  Browse Courses
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/instructors" className="hover:text-yellow-400 transition-colors">
                  Become Instructor
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-yellow-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-yellow-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-yellow-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-yellow-400 transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/category/web-development" className="hover:text-yellow-400 transition-colors">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/category/mobile-development" className="hover:text-yellow-400 transition-colors">
                  Mobile Development
                </a>
              </li>
              <li>
                <a href="/category/data-science" className="hover:text-yellow-400 transition-colors">
                  Data Science
                </a>
              </li>
              <li>
                <a href="/category/ui-ux-design" className="hover:text-yellow-400 transition-colors">
                  UI/UX Design
                </a>
              </li>
              <li>
                <a href="/category/digital-marketing" className="hover:text-yellow-400 transition-colors">
                  Digital Marketing
                </a>
              </li>
              <li>
                <a href="/category/business" className="hover:text-yellow-400 transition-colors">
                  Business
                </a>
              </li>
              <li>
                <a href="/category/photography" className="hover:text-yellow-400 transition-colors">
                  Photography
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Connected</h4>
            <p className="text-sm text-gray-300">Subscribe to our newsletter for the latest courses and updates.</p>
            <form onSubmit={handleNewsletterSignup} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-midnight-blue-800 border-midnight-blue-700 text-white placeholder:text-gray-400"
                required
              />
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Subscribe
              </Button>
            </form>

            {/* Social Media Links */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Follow Us</p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-midnight-blue-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-midnight-blue-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-midnight-blue-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-midnight-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-midnight-blue-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-midnight-blue-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">© 2024 EduLMS. All rights reserved.</div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-yellow-400 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-yellow-400 transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="hover:text-yellow-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
