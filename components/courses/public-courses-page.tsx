"use client"

// import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Star, Clock, Users, BookOpen, X, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchData } from "@/lib/api"


export function PublicCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()
   // Tambahkan state ini di sini:
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  

  // const categories = [
  //   "Web Development",
  //   "Mobile Development",
  //   "AI & Machine Learning",
  //   "Data Science",
  //   "UI/UX Design",
  //   "DevOps",
  // ]
    
  const [categoriesFromAPI, setCategoriesFromAPI] = useState<string[]>([])
  const [courseTypesFromAPI, setCourseTypesFromAPI] = useState<string[]>(["Free Course", "Best Course", "Certificated"])
  const categories = categoriesFromAPI
  const courseTypes = courseTypesFromAPI


  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetchData("/course/category", { method: "GET" })
        const categoryNames = res.data?.map((cat: any) => cat.name) || []
        setCategoriesFromAPI(categoryNames)
      } catch (err) {
        console.error("Failed to fetch filter data", err)
      }
    }

    fetchFilters()
  }, [])


  // const courseTypes = ["Free Course", "Best Course", "Certificated"]

  // const courses = [
  //   {
  //     id: 1,
  //     title: "Complete Web Development Bootcamp",
  //     instructor: "John Smith",
  //     category: "Web Development",
  //     type: "Best Course",
  //     level: "Beginner",
  //     rating: 4.8,
  //     students: 12500,
  //     duration: "40 hours",
  //     price: 299000,
  //     originalPrice: 499000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  //   {
  //     id: 2,
  //     title: "React Native Mobile App Development",
  //     instructor: "Sarah Johnson",
  //     category: "Mobile Development",
  //     type: "Certificated",
  //     level: "Intermediate",
  //     rating: 4.9,
  //     students: 8200,
  //     duration: "35 hours",
  //     price: 399000,
  //     originalPrice: 599000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Build cross-platform mobile apps with React Native and JavaScript.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  //   {
  //     id: 3,
  //     title: "UI/UX Design Masterclass",
  //     instructor: "Mike Chen",
  //     category: "UI/UX Design",
  //     type: "Best Course",
  //     level: "Beginner",
  //     rating: 4.7,
  //     students: 15600,
  //     duration: "30 hours",
  //     price: 249000,
  //     originalPrice: 399000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Master the principles of user interface and user experience design.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  //   {
  //     id: 4,
  //     title: "Data Science with Python",
  //     instructor: "Dr. Emily Davis",
  //     category: "Data Science",
  //     type: "Certificated",
  //     level: "Intermediate",
  //     rating: 4.8,
  //     students: 9800,
  //     duration: "45 hours",
  //     price: 449000,
  //     originalPrice: 699000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Learn data analysis, machine learning, and visualization with Python.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  //   {
  //     id: 5,
  //     title: "Introduction to Programming",
  //     instructor: "Alex Rodriguez",
  //     category: "Web Development",
  //     type: "Free Course",
  //     level: "Beginner",
  //     rating: 4.6,
  //     students: 11200,
  //     duration: "25 hours",
  //     price: 0,
  //     originalPrice: 199000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Learn programming basics with this free introductory course.",
  //     isFree: true,
  //     isCertificated: false,
  //   },
  //   {
  //     id: 6,
  //     title: "Machine Learning Fundamentals",
  //     instructor: "Dr. Lisa Thompson",
  //     category: "AI & Machine Learning",
  //     type: "Best Course",
  //     level: "Intermediate",
  //     rating: 4.9,
  //     students: 7500,
  //     duration: "50 hours",
  //     price: 549000,
  //     originalPrice: 799000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Master machine learning algorithms and techniques.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  //   {
  //     id: 7,
  //     title: "DevOps with Docker & Kubernetes",
  //     instructor: "David Wilson",
  //     category: "DevOps",
  //     type: "Certificated",
  //     level: "Advanced",
  //     rating: 4.8,
  //     students: 6800,
  //     duration: "45 hours",
  //     price: 479000,
  //     originalPrice: 699000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Learn containerization and orchestration with Docker and Kubernetes.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  //   {
  //     id: 8,
  //     title: "Free HTML & CSS Course",
  //     instructor: "Anna Kim",
  //     category: "Web Development",
  //     type: "Free Course",
  //     level: "Beginner",
  //     rating: 4.5,
  //     students: 15400,
  //     duration: "20 hours",
  //     price: 0,
  //     originalPrice: 149000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Learn web development basics with HTML and CSS for free.",
  //     isFree: true,
  //     isCertificated: false,
  //   },
  //   {
  //     id: 9,
  //     title: "Mobile UI Design Principles",
  //     instructor: "Carlos Martinez",
  //     category: "UI/UX Design",
  //     type: "Free Course",
  //     level: "Beginner",
  //     rating: 4.4,
  //     students: 9200,
  //     duration: "15 hours",
  //     price: 0,
  //     originalPrice: 199000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Learn mobile design principles and best practices for free.",
  //     isFree: true,
  //     isCertificated: false,
  //   },
  //   {
  //     id: 10,
  //     title: "Advanced Data Analytics",
  //     instructor: "Dr. Emma Brown",
  //     category: "Data Science",
  //     type: "Best Course",
  //     level: "Advanced",
  //     rating: 4.9,
  //     students: 4600,
  //     duration: "60 hours",
  //     price: 649000,
  //     originalPrice: 899000,
  //     language: "English",
  //     image: "/placeholder.svg?height=200&width=300",
  //     description: "Master advanced data analytics techniques and tools.",
  //     isFree: false,
  //     isCertificated: true,
  //   },
  // ]

  // Filter courses based on selected filters and search term
const filteredCourses = courses.filter((course) => {
  const matchesSearch =
    searchTerm === "" ||
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.bio?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.categories?.some((cat: any) =>
      cat.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const categoryNames = course.categories?.map((cat: any) => cat.category.name) || []
  const matchesCategory =
    selectedCategories.length === 0 ||
    selectedCategories.some((c) => categoryNames.includes(c))

  const matchesCourseType = true // Placeholder: backend belum support "type"

  return matchesSearch && matchesCategory && matchesCourseType
})


  const handleCourseClick = (courseId: number) => {
    router.push(`/student/course-preview/${courseId}`)
  }

 const formatPrice = (price: any) => {
  const parsed = parseFloat(price)
  if (!parsed || parsed === 0) return "Free"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parsed)
}


  // Added function to format student count consistently
  const formatStudentCount = (count: number) => {
    return new Intl.NumberFormat("id-ID").format(count); // Ensure consistent formatting
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleCourseTypeChange = (courseType: string, checked: boolean) => {
    if (checked) {
      setSelectedCourseTypes([...selectedCourseTypes, courseType])
    } else {
      setSelectedCourseTypes(selectedCourseTypes.filter((t) => t !== courseType))
    }
  }

  const removeFilter = (type: "category" | "courseType", value: string) => {
    if (type === "category") {
      setSelectedCategories(selectedCategories.filter((c) => c !== value))
    } else {
      setSelectedCourseTypes(selectedCourseTypes.filter((t) => t !== value))
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedCourseTypes([])
  }

  const getTotalActiveFilters = () => {
    return selectedCategories.length + selectedCourseTypes.length
  }
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetchData("/course?per_page=10", {
        method: "POST",
      })
      setCourses(response.data || [])
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchCourses()
}, [])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-midnight-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Courses</h1>
            <p className="text-xl text-midnight-blue-200 mb-8 max-w-2xl mx-auto">
              Learn new skills from industry experts and advance your career with our comprehensive online courses.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 relative">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {getTotalActiveFilters() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5">
                      {getTotalActiveFilters()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>Filter Courses</span>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Types */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Course Types</h3>
                    <div className="space-y-3">
                      {courseTypes.map((courseType) => (
                        <div key={courseType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`courseType-${courseType}`}
                            checked={selectedCourseTypes.includes(courseType)}
                            onCheckedChange={(checked) => handleCourseTypeChange(courseType, checked as boolean)}
                          />
                          <label
                            htmlFor={`courseType-${courseType}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {courseType}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8 pt-4 border-t">
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900"
                  >
                    Apply Filters ({filteredCourses.length} courses)
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Tags */}
          {getTotalActiveFilters() > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1 bg-midnight-blue-100 text-midnight-blue-800 hover:bg-midnight-blue-200"
                  >
                    {category}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeFilter("category", category)}
                    />
                  </Badge>
                ))}
                {selectedCourseTypes.map((courseType) => (
                  <Badge
                    key={courseType}
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    {courseType}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeFilter("courseType", courseType)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} Found
          </h2>
          <p className="text-gray-600">
            {getTotalActiveFilters() > 0
              ? `Filtered results based on your selection`
              : `Choose from our wide selection of courses to start your learning journey`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
           <Card
  key={course.id}
  className="hover:shadow-lg transition-shadow cursor-pointer"
  onClick={() => router.push("/login")}  // arahkan ke /login saat diklik
>
  <CardHeader className="p-0">
    <div className="relative">
      <img
        src={course.thumbnail || "/placeholder.svg"}
        alt={course.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <Badge className="absolute top-2 left-2 bg-midnight-blue-800">
        {course.categories?.[0]?.category?.name || "Uncategorized"}
      </Badge>
      <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
        {course.level?.name || "Unknown"}
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="p-4">
    <CardTitle className="text-lg mb-2 line-clamp-2">{course.title}</CardTitle>
    <p className="text-sm text-gray-600 mb-2">
      by {course.instructor?.bio?.fullname || "Unknown Instructor"}
    </p>
    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{course.description}</p>
  </CardContent>

  <CardFooter className="p-4 pt-0">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <span
          className={`text-2xl font-bold ${parseFloat(course.price) === 0 ? "text-green-600" : "text-midnight-blue-800"}`}
        >
          {formatPrice(course.price)}
        </span>
      </div>
      <Button size="sm" className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
        <BookOpen className="w-4 h-4 mr-1" />
        {parseFloat(course.price) === 0 ? "Start Free" : "Preview"}
      </Button>
    </div>
  </CardFooter>
</Card>


          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              {getTotalActiveFilters() > 0
                ? "Try removing some filters or search for different terms."
                : "Try adjusting your search criteria or browse all courses."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}