"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, Smartphone, Palette, BarChart3, ChevronLeft } from "lucide-react"

// Define proper types for our data
interface Subcategory {
  name: string
  description: string
  courses: number
  level: string
  duration: string
  image: string
}

interface Category {
  id: string
  name: string
  icon: React.ElementType
  description: string
  courses: number
  color: string
  subcategories: Subcategory[]
}

const categories: Category[] = [
  {
    id: "web-development",
    name: "Web Development",
    icon: Globe,
    description: "Frontend and backend web technologies",
    courses: 145,
    color: "bg-blue-500",
    subcategories: [
      {
        name: "Frontend Development",
        description: "HTML, CSS, JavaScript, React, Vue.js",
        courses: 45,
        level: "Beginner to Advanced",
        duration: "3-6 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Backend Development",
        description: "Node.js, Python, PHP, Database Management",
        courses: 38,
        level: "Intermediate to Advanced",
        duration: "4-8 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Full Stack Development",
        description: "Complete web development stack",
        courses: 32,
        level: "Advanced",
        duration: "6-12 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Web Security",
        description: "Security best practices and implementation",
        courses: 18,
        level: "Advanced",
        duration: "2-4 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "DevOps & Deployment",
        description: "CI/CD, Docker, AWS, Cloud deployment",
        courses: 12,
        level: "Advanced",
        duration: "3-6 months",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    icon: Smartphone,
    description: "iOS, Android, and cross-platform development",
    courses: 89,
    color: "bg-green-500",
    subcategories: [
      {
        name: "iOS Development",
        description: "Swift, SwiftUI, Xcode, App Store",
        courses: 28,
        level: "Beginner to Advanced",
        duration: "4-8 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Android Development",
        description: "Kotlin, Java, Android Studio, Google Play",
        courses: 32,
        level: "Beginner to Advanced",
        duration: "4-8 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "React Native",
        description: "Cross-platform mobile development",
        courses: 18,
        level: "Intermediate",
        duration: "3-6 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Flutter",
        description: "Google's UI toolkit for mobile",
        courses: 11,
        level: "Intermediate",
        duration: "3-6 months",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    icon: Palette,
    description: "User interface and user experience design",
    courses: 67,
    color: "bg-purple-500",
    subcategories: [
      {
        name: "UI Design",
        description: "Visual design, typography, color theory",
        courses: 22,
        level: "Beginner to Advanced",
        duration: "2-4 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "UX Research",
        description: "User research, testing, personas",
        courses: 18,
        level: "Intermediate",
        duration: "3-5 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Design Tools",
        description: "Figma, Adobe XD, Sketch, Prototyping",
        courses: 15,
        level: "Beginner to Intermediate",
        duration: "1-3 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Design Systems",
        description: "Creating and maintaining design systems",
        courses: 12,
        level: "Advanced",
        duration: "2-4 months",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: BarChart3,
    description: "Data analysis, machine learning, and AI",
    courses: 54,
    color: "bg-orange-500",
    subcategories: [
      {
        name: "Data Analysis",
        description: "Python, R, SQL, Statistics",
        courses: 20,
        level: "Beginner to Advanced",
        duration: "3-6 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Machine Learning",
        description: "Algorithms, models, deep learning",
        courses: 18,
        level: "Intermediate to Advanced",
        duration: "4-8 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Data Visualization",
        description: "Tableau, Power BI, D3.js, matplotlib",
        courses: 10,
        level: "Beginner to Intermediate",
        duration: "2-4 months",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Big Data",
        description: "Hadoop, Spark, distributed computing",
        courses: 6,
        level: "Advanced",
        duration: "4-6 months",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
]

export function CourseCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAllSubcategories, setShowAllSubcategories] = useState(false)

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory)

  if (selectedCategory && selectedCategoryData) {
    const visibleSubcategories = showAllSubcategories
      ? selectedCategoryData.subcategories
      : selectedCategoryData.subcategories.slice(0, 3)

    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center mb-6 md:mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="mb-4 sm:mb-0 sm:mr-4 justify-start"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${selectedCategoryData.color} rounded-full flex items-center justify-center mr-3 md:mr-4`}
              >
                <selectedCategoryData.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-midnight-blue-900">{selectedCategoryData.name}</h2>
                <p className="text-sm md:text-base text-gray-600">{selectedCategoryData.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {visibleSubcategories.map((subcategory, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={subcategory.image || "/placeholder.svg"}
                    alt={subcategory.name}
                    className="w-full h-40 md:h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-midnight-blue-800 text-white">
                    {subcategory.courses} Courses
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-midnight-blue-800">{subcategory.name}</CardTitle>
                  <CardDescription className="text-sm md:text-base">{subcategory.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-600">Level:</span>
                      <Badge variant="outline">{subcategory.level}</Badge>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{subcategory.duration}</span>
                    </div>
                    <Button className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900 text-sm md:text-base">
                      Explore Courses
                      <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedCategoryData.subcategories.length > 3 && (
            <div className="text-center mt-6 md:mt-8">
              <Button variant="outline" onClick={() => setShowAllSubcategories(!showAllSubcategories)}>
                {showAllSubcategories
                  ? "Show Less"
                  : `Show All ${selectedCategoryData.subcategories.length} Subcategories`}
              </Button>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="courses" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight-blue-900 mb-3 md:mb-4">
            Explore Our Course Categories
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive selection of courses designed to help you master in-demand skills
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-midnight-blue-200 cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader className="text-center">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
                >
                  <category.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl text-midnight-blue-800">{category.name}</CardTitle>
                <CardDescription className="text-sm md:text-base">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge variant="outline" className="text-midnight-blue-600">
                      {category.courses} Courses Available
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-xs md:text-sm text-midnight-blue-800">Subcategories:</p>
                    {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                      <div key={subIndex} className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-gray-600">{sub.name}</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-midnight-blue-600" />
                      </div>
                    ))}
                    {category.subcategories.length > 3 && (
                      <p className="text-xs text-gray-500">+{category.subcategories.length - 3} more</p>
                    )}
                  </div>
                  <Button className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900 text-sm md:text-base">
                    Explore Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
