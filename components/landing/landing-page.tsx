"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Star,
  Users,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Globe,
  Smartphone,
  Palette,
  BarChart3,
  Code,
  Camera,
  Briefcase,
  Heart,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PartnerSlider } from "./partner-slider";
import { Footer } from "@/components/layout/footer";
import { LiveChatButton } from "@/components/live-chat-button";
import { useEffect } from "react";
import { fetchData } from "@/lib/api"; // pastikan ini benar

// Featured courses with subcategories
const featuredCourses = {
  "Best Course": [
    {
      id: "1",
      title: "Complete React Developer Course 2024",
      instructor: "John Doe",
      rating: 4.8,
      students: 15420,
      price: 89.99,
      originalPrice: 199.99,
      image: "/placeholder.svg?height=200&width=300",
      level: "Intermediate",
      duration: "40 hours",
      badge: "Bestseller",
      category: "Web Development",
    },
    {
      id: "2",
      title: "Advanced JavaScript Mastery",
      instructor: "Jane Smith",
      rating: 4.9,
      students: 8930,
      price: 79.99,
      originalPrice: 149.99,
      image: "/placeholder.svg?height=200&width=300",
      level: "Advanced",
      duration: "35 hours",
      badge: "Hot",
      category: "Web Development",
    },
    {
      id: "3",
      title: "iOS Development with Swift",
      instructor: "Emma Davis",
      rating: 4.8,
      students: 7650,
      price: 109.99,
      originalPrice: 249.99,
      image: "/placeholder.svg?height=200&width=300",
      level: "Intermediate",
      duration: "50 hours",
      badge: "Bestseller",
      category: "Mobile Development",
    },
  ],
  Certificated: [
    {
      id: "4",
      title: "Full Stack Web Development Certification",
      instructor: "Mike Johnson",
      rating: 4.7,
      students: 12340,
      price: 129.99,
      originalPrice: 299.99,
      image: "/placeholder.svg?height=200&width=300",
      level: "All Levels",
      duration: "60 hours",
      badge: "Certificate",
      category: "Web Development",
    },
    {
      id: "5",
      title: "Data Science Professional Certificate",
      instructor: "Sarah Wilson",
      rating: 4.6,
      students: 9870,
      price: 149.99,
      originalPrice: 349.99,
      image: "/placeholder.svg?height=200&width=300",
      level: "Advanced",
      duration: "80 hours",
      badge: "Certificate",
      category: "Data Science",
    },
    {
      id: "6",
      title: "UI/UX Design Certification Program",
      instructor: "Alex Brown",
      rating: 4.7,
      students: 6540,
      price: 119.99,
      originalPrice: 279.99,
      image: "/placeholder.svg?height=200&width=300",
      level: "Intermediate",
      duration: "45 hours",
      badge: "Certificate",
      category: "Design",
    },
  ],
  "Free Course": [
    {
      id: "7",
      title: "HTML & CSS Fundamentals",
      instructor: "Tom Wilson",
      rating: 4.5,
      students: 25670,
      price: 0,
      originalPrice: 0,
      image: "/placeholder.svg?height=200&width=300",
      level: "Beginner",
      duration: "15 hours",
      badge: "Free",
      category: "Web Development",
    },
    {
      id: "8",
      title: "Introduction to Python Programming",
      instructor: "Lisa Chen",
      rating: 4.4,
      students: 18920,
      price: 0,
      originalPrice: 0,
      image: "/placeholder.svg?height=200&width=300",
      level: "Beginner",
      duration: "20 hours",
      badge: "Free",
      category: "Programming",
    },
    {
      id: "9",
      title: "Digital Marketing Basics",
      instructor: "David Kim",
      rating: 4.3,
      students: 14560,
      price: 0,
      originalPrice: 0,
      image: "/placeholder.svg?height=200&width=300",
      level: "Beginner",
      duration: "12 hours",
      badge: "Free",
      category: "Marketing",
    },
  ],
};

// Popular categories with navigation
const popularCategories = [
  {
    id: "web-development",
    name: "Web Development",
    icon: Globe,
    description: "Frontend and backend web technologies",
    courses: 145,
    color: "bg-blue-500",
    href: "/courses?category=web-development",
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    icon: Smartphone,
    description: "iOS, Android, and cross-platform development",
    courses: 89,
    color: "bg-green-500",
    href: "/courses?category=mobile-development",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    icon: Palette,
    description: "User interface and user experience design",
    courses: 67,
    color: "bg-purple-500",
    href: "/courses?category=ui-ux-design",
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: BarChart3,
    description: "Data analysis, machine learning, and AI",
    courses: 54,
    color: "bg-orange-500",
    href: "/courses?category=data-science",
  },
  {
    id: "programming",
    name: "Programming",
    icon: Code,
    description: "Various programming languages and frameworks",
    courses: 123,
    color: "bg-red-500",
    href: "/courses?category=programming",
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    description: "Digital photography and photo editing",
    courses: 45,
    color: "bg-pink-500",
    href: "/courses?category=photography",
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    description: "Business skills and entrepreneurship",
    courses: 78,
    color: "bg-indigo-500",
    href: "/courses?category=business",
  },
  {
    id: "health-fitness",
    name: "Health & Fitness",
    icon: Heart,
    description: "Health, wellness, and fitness training",
    courses: 32,
    color: "bg-teal-500",
    href: "/courses?category=health-fitness",
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    company: "Google",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "EduLMS completely transformed my career. The courses are practical, well-structured, and taught by industry experts. I landed my dream job at Google just 6 months after completing the React course!",
    rating: 5,
    course: "Complete React Developer Course",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Microsoft",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "The Data Science certification program exceeded my expectations. The hands-on projects and real-world applications helped me transition from marketing to data science seamlessly.",
    rating: 5,
    course: "Data Science Professional Certificate",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Apple",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "As a working mother, the flexible learning schedule was perfect for me. The UI/UX course content was comprehensive and the community support was incredible. Now I'm designing for Apple!",
    rating: 5,
    course: "UI/UX Design Certification",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "Netflix",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "The instructors are phenomenal and the course materials are always up-to-date. I've taken 3 courses here and each one has directly contributed to my career advancement.",
    rating: 5,
    course: "Full Stack Web Development",
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Mobile App Developer",
    company: "Uber",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "From zero coding experience to building my own apps - EduLMS made it possible. The step-by-step approach and mentor support were game-changers for my learning journey.",
    rating: 5,
    course: "iOS Development with Swift",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Digital Marketing Manager",
    company: "Shopify",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "The practical projects and real case studies in the digital marketing course helped me understand the concepts deeply. I got promoted within 3 months of completing the course!",
    rating: 5,
    course: "Digital Marketing Mastery",
  },
];

interface CourseCardProps {
  course: any;
}

function CourseCard({ course }: CourseCardProps) {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Bestseller":
        return "bg-orange-500";
      case "Hot":
        return "bg-red-500";
      case "Certificate":
        return "bg-blue-500";
      case "Free":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-midnight-blue-200 p-4">
      <div className="relative">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge
          className={`absolute top-3 left-3 ${getBadgeColor(
            course.badge
          )} text-white`}
        >
          {course.badge}
        </Badge>
        <Button
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>
      <CardHeader>
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs w-fit">
            {course.category}
          </Badge>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-midnight-blue-700 transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm">
            {course.instructor}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm ml-1 font-medium">
                  {course.rating}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                <span>{(course.students / 1000).toFixed(0)}k</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {course.duration}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              {course.price === 0 ? (
                <span className="font-bold text-green-600 text-lg">Free</span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">${course.price}</span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Button className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900">
              {course.price === 0 ? "Enroll Free" : "Enroll Now"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LandingPage() {
  const [activeTab, setActiveTab] = useState("Best Course");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [featuredCoursesFromAPI, setFeaturedCoursesFromAPI] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await fetchData("/course?per_page=6", { method: "POST" });
        setFeaturedCoursesFromAPI(res.data);
      } catch (error) {
        console.error("Failed to fetch featured courses", error);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);
  const filteredByTab = {
    "Best Course": featuredCoursesFromAPI.filter(
      (course) =>
        course.approval_status === "pending" &&
        parseFloat(course.price) > 0 &&
        course.is_visible
    ),
    Certificated: featuredCoursesFromAPI.filter(
      (course) => course.is_published && parseFloat(course.price) > 0
    ),
    "Free Course": featuredCoursesFromAPI.filter(
      (course) => parseFloat(course.price) === 0
    ),
  };

  const handleCategoryClick = (href: string) => {
    window.location.href = href;
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight-blue-900 via-midnight-blue-800 to-midnight-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                  🎉 New courses every week
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Learn Skills That
                  <span className="text-yellow-400 block">Matter Today</span>
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Join thousands of students learning from industry experts.
                  Build your career with our comprehensive online courses.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">50K+</div>
                  <div className="text-sm text-gray-300">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-sm text-gray-300">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">100+</div>
                  <div className="text-sm text-gray-300">Instructors</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/placeholder.svg?height=600&width=500"
                  alt="Students learning online"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Slider */}
      <PartnerSlider />

      {/* Popular Categories */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight-blue-900 mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover courses in the most in-demand skills and advance your
              career
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-midnight-blue-200 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleCategoryClick(category.href)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-midnight-blue-800 group-hover:text-midnight-blue-600">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <Badge
                      variant="outline"
                      className="text-midnight-blue-600 border-midnight-blue-200"
                    >
                      {category.courses} Courses Available
                    </Badge>
                    <Button className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900 group-hover:bg-midnight-blue-700">
                      Explore Courses
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-midnight-blue-200 text-midnight-blue-800 hover:bg-midnight-blue-50"
              onClick={() => handleCategoryClick("/courses")}
            >
              View All Categories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight-blue-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked courses from our expert instructors to help you achieve
              your goals
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="Best Course">Best Course</TabsTrigger>
                <TabsTrigger value="Certificated">Certificated</TabsTrigger>
                <TabsTrigger value="Free Course">Free Course</TabsTrigger>
              </TabsList>
            </div>

            {["Best Course", "Certificated", "Free Course"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loading ? (
                    <p>Loading...</p>
                  ) : filteredByTab[tab].length > 0 ? (
                    filteredByTab[tab].map((course) => (
                      <CourseCard
                        key={course.id}
                        course={{
                          id: course.id,
                          title: course.title,
                          instructor:
                            course.instructor?.bio?.fullname ||
                            "Unknown Instructor",
                          rating: 4.8,
                          students: 10000,
                          price: parseFloat(course.price),
                          originalPrice: parseFloat(course.price) * 1.5,
                          image: course.thumbnail ?? "/placeholder.svg",
                          level: course.level?.name ?? "Unknown",
                          duration: "40 hours",
                          badge:
                            parseFloat(course.price) === 0
                              ? "Free"
                              : course.approval_status === "pending"
                              ? "Hot"
                              : "Certificate",
                          category:
                            course.categories?.[0]?.category?.name ?? "General",
                        }}
                      />
                    ))
                  ) : (
                    <p>No courses found for {tab}</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
              onClick={() => handleCategoryClick("/courses")}
            >
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight-blue-900 mb-4">
              Why Choose EduLMS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the best learning experience with industry-leading
              features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals with years of real-world experience",
              },
              {
                icon: Award,
                title: "Certificates",
                description:
                  "Earn recognized certificates upon course completion to boost your career",
              },
              {
                icon: Clock,
                title: "Flexible Learning",
                description:
                  "Study at your own pace with lifetime access to course materials",
              },
              {
                icon: Users,
                title: "Community Support",
                description:
                  "Join a community of learners and get help when you need it",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description:
                  "Advance your career with in-demand skills and practical projects",
              },
              {
                icon: CheckCircle,
                title: "Quality Content",
                description:
                  "High-quality video content with practical exercises and assignments",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-midnight-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-midnight-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-midnight-blue-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Slider */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight-blue-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful graduates who transformed their
              careers with EduLMS
            </p>
          </div>

          {/* Testimonial Slider */}
          <div className="relative">
            <div className="overflow-hidden" ref={testimonialRef}>
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <Card className="max-w-4xl mx-auto relative hover:shadow-xl transition-all duration-300 border-2 hover:border-midnight-blue-200">
                      <CardHeader>
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-midnight-blue-600 rounded-full flex items-center justify-center">
                          <Quote className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-midnight-blue-100 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-xl text-midnight-blue-800 mb-2">
                              {testimonial.name}
                            </CardTitle>
                            <CardDescription className="text-base mb-3">
                              {testimonial.role} at {testimonial.company}
                            </CardDescription>
                            <div className="flex items-center justify-center sm:justify-start mb-4">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <Badge
                              variant="outline"
                              className="text-sm text-midnight-blue-600 border-midnight-blue-200"
                            >
                              {testimonial.course}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed text-lg italic text-center sm:text-left">
                          "{testimonial.content}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl z-10"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl z-10"
              onClick={nextTestimonial}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial
                      ? "bg-midnight-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-midnight-blue-200 text-midnight-blue-800 hover:bg-midnight-blue-50"
            >
              Read More Success Stories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Live Chat Button */}
      <LiveChatButton />
    </div>
  );
}
