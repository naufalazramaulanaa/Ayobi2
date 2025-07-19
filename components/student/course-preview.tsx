"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  Download,
  Heart,
  Share2,
  ArrowLeft,
  Lock,
  CheckCircle,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"

interface CoursePreviewProps {
  courseId: string
}

// Mock course data
const courseData = {
  id: "1",
  title: "Complete React Developer Course",
  instructor: {
    name: "John Doe",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Senior Full Stack Developer with 8+ years experience",
    rating: 4.9,
    students: 25000,
    courses: 12,
    experience: "8+ years in web development, worked at Google and Microsoft",
  },
  price: 89.99,
  originalPrice: 199.99,
  rating: 4.8,
  students: 15420,
  duration: "40 hours",
  level: "Intermediate",
  language: "English",
  lastUpdated: "January 2024",
  image: "/placeholder.svg?height=300&width=500",
  description:
    "Master React development from basics to advanced concepts. Build real-world projects and become job-ready.",
  whatYouWillLearn: [
    "Build modern React applications from scratch",
    "Master React Hooks and Context API",
    "Implement state management with Redux",
    "Create responsive and interactive UIs",
    "Deploy applications to production",
  ],
  requirements: [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "Familiarity with ES6+ features",
    "A computer with internet connection",
  ],
  curriculum: [
    {
      id: 1,
      title: "React Fundamentals",
      lessons: 12,
      duration: "3 hours",
      isPreview: true,
      contents: [
        { title: "Introduction to React", duration: "15 min", isPreview: true },
        { title: "Setting up Development Environment", duration: "20 min", isPreview: true },
        { title: "Your First React Component", duration: "25 min", isPreview: false },
      ],
    },
    {
      id: 2,
      title: "Components and JSX",
      lessons: 8,
      duration: "2.5 hours",
      isPreview: false,
      contents: [
        { title: "Understanding JSX", duration: "18 min", isPreview: false },
        { title: "Props and State", duration: "22 min", isPreview: false },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "Excellent course! Very comprehensive and well-structured.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      user: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment: "Great content, but could use more practical examples.",
      date: "1 month ago",
    },
  ],
  certificate: true,
  hasPreview: true,
}

export function CoursePreview({ courseId }: CoursePreviewProps) {
  const router = useRouter()
  const { addToCart, isInCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activePreview, setActivePreview] = useState<string | null>(null)

  const course = courseData // In real app, fetch by courseId

  const handleAddToCart = () => {
    addToCart({
      id: course.id,
      title: course.title,
      instructor: course.instructor.name,
      price: course.price,
      originalPrice: course.originalPrice,
      image: course.image,
      rating: course.rating,
      students: course.students,
      duration: course.duration,
      level: course.level,
    })
    toast({
      title: "Added to cart!",
      description: "Course has been added to your cart",
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Course removed from your wishlist" : "Course added to your wishlist",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Course link has been copied to clipboard",
    })
  }

  const handlePreviewLesson = (lessonTitle: string) => {
    setActivePreview(lessonTitle)
    // In real app, open video player modal
    toast({
      title: "Preview started",
      description: `Playing: ${lessonTitle}`,
    })
  }

  const courseInCart = isInCart(course.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-midnight-blue-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-midnight-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-midnight-blue-100 mb-4">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold mr-1">{course.rating}</span>
                  <span className="text-midnight-blue-200">({course.students.toLocaleString()} students)</span>
                </div>
                <Badge variant="secondary">{course.level}</Badge>
                <div className="flex items-center text-midnight-blue-200">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center text-midnight-blue-200">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students.toLocaleString()} students
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={course.instructor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {course.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Created by {course.instructor.name}</p>
                  <p className="text-sm text-midnight-blue-200">Last updated {course.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <div className="relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {course.hasPreview && (
                    <Button
                      size="lg"
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 hover:bg-white/30"
                      onClick={() => handlePreviewLesson("Course Preview")}
                    >
                      <Play className="w-6 h-6 text-white" />
                    </Button>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-2xl font-bold">${course.price}</span>
                      <span className="text-lg text-muted-foreground line-through">${course.originalPrice}</span>
                    </div>
                    <Badge className="bg-red-500">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-midnight-blue-600 hover:bg-midnight-blue-700"
                      onClick={handleAddToCart}
                      disabled={courseInCart}
                    >
                      {courseInCart ? "In Cart" : "Add to Cart"}
                    </Button>

                    <Button variant="outline" className="w-full" onClick={() => router.push("/checkout")}>
                      Buy Now
                    </Button>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleWishlist}>
                        <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                        Wishlist
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Full lifetime access
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Access on mobile and TV
                    </div>
                    {course.certificate && (
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-green-500 mr-2" />
                        Certificate of completion
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                {course.curriculum.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {section.lessons} lessons • {section.duration}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {section.contents.map((content, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              {content.isPreview ? (
                                <Play className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm">{content.title}</span>
                              {content.isPreview && (
                                <Badge variant="outline" className="text-xs">
                                  Preview
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">{content.duration}</span>
                              {content.isPreview && (
                                <Button size="sm" variant="ghost" onClick={() => handlePreviewLesson(content.title)}>
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={course.instructor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {course.instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{course.instructor.name}</h3>
                        <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-semibold">{course.instructor.rating}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Instructor Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{course.instructor.students.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Students</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{course.instructor.courses}</p>
                            <p className="text-xs text-muted-foreground">Courses</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{course.instructor.experience.split(" ")[0]}</p>
                            <p className="text-xs text-muted-foreground">Years Experience</p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm">{course.instructor.experience}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">{review.user}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Course Features */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Downloadable resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Full lifetime access</span>
                </div>
                {course.certificate && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Certificate of completion</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
