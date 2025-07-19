"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Star, Clock, Users, BookOpen, X, Filter, ShoppingCart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { fetchData } from "@/lib/api";


export function StudentBrowseCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [categoriesFromAPI, setCategoriesFromAPI] = useState<string[]>([]);
  const [courseTypesFromAPI, setCourseTypesFromAPI] = useState<string[]>(["Free Course", "Best Course", "Certificated"]);
  const categories = categoriesFromAPI;
  const courseTypes = courseTypesFromAPI;

const { addToCart, isInCart, items } = useCart();
  useEffect(() => {
  const orderData = {
    items,
    subtotal: items.reduce((sum: number, item: { price: number; quantity: number; }) => sum + item.price * item.quantity, 0),
    totalDiscount: 0,
    finalTotal: items.reduce((sum: number, item: { price: number; quantity: number; }) => sum + item.price * item.quantity, 0),
    appliedVouchers: {}
  };
  localStorage.setItem("eduLMS-order", JSON.stringify(orderData));
}, [items]);


  // Fetch courses and categories when the component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetchData("/course/category", { method: "GET" });
        const categoryNames = res.data?.map((cat: any) => cat.name) || [];
        setCategoriesFromAPI(categoryNames);
      } catch (err) {
        console.error("Failed to fetch filter data", err);
      }
    };

    const fetchCourses = async () => {
      setLoading(true);

      const formData = new FormData();
      selectedCategories.forEach((cat) => formData.append("categories[]", cat));
      formData.append("page", String(page));

      try {
        const data = await fetchData("/student/courses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
          body: formData,
        });

        if (data.success) {
          setCourses(data.data); // <-- Update with the correct data path
        } else {
          console.error("API error:", data.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
    fetchCourses();
  }, []);
  

  // Get search query from URL params
  useEffect(() => {
    try {
      const query = searchParams?.get("q");
      if (query) {
        setSearchTerm(query);
      }
    } catch (error) {
      console.warn("Error reading search params:", error);
    }
  }, [searchParams]);

  // Filter courses based on selected filters and search term
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchTerm === "" ||
      (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((c) =>
        course.category && course.category.toLowerCase().includes(c.toLowerCase())
      );

    const matchesCourseType =
      selectedCourseTypes.length === 0 ||
      selectedCourseTypes.some((type) =>
        course.type && course.type.toLowerCase().includes(type.toLowerCase())
      );

    return matchesSearch && matchesCategory && matchesCourseType;
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleCourseTypeChange = (courseType: string, checked: boolean) => {
    if (checked) {
      setSelectedCourseTypes([...selectedCourseTypes, courseType]);
    } else {
      setSelectedCourseTypes(selectedCourseTypes.filter((t) => t !== courseType));
    }
  };

  const removeFilter = (type: "category" | "courseType", value: string) => {
    if (type === "category") {
      setSelectedCategories(selectedCategories.filter((c) => c !== value));
    } else {
      setSelectedCourseTypes(selectedCourseTypes.filter((t) => t !== value));
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedCourseTypes([]);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/student/course-preview/${courseId}`);
  };

  const handleAddToCart = (course: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!course.isFree) {
      addToCart({
  id: course.id,
  title: course.title,
  instructor: course.instructor?.badge ?? "Unknown",
  price: parseFloat(course.price), // penting!
  originalPrice: parseFloat(course.price), // fallback ke harga asli
  image: course.thumbnail,
  duration: 1,
  quantity: 1, // default quantity
});

    }
  };

  const handleEnrollFree = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Enrolled in free course successfully!");
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `Rp ${(price / 1000).toFixed(0)}k`;
  };

  const getTotalActiveFilters = () => {
    return selectedCategories.length + selectedCourseTypes.length;
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Best Course":
        return "bg-orange-500 hover:bg-orange-600";
      case "Certificated":
        return "bg-blue-500 hover:bg-blue-600";
      case "Free Course":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category]);
                  } else {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category));
                  }
                }}
              />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Course Types */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Course Types</h3>
        <div className="space-y-2">
          {courseTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedCourseTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCourseTypes([...selectedCourseTypes, type]);
                  } else {
                    setSelectedCourseTypes(selectedCourseTypes.filter((t) => t !== type));
                  }
                }}
              />
              <label
                htmlFor={type}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 || selectedCourseTypes.length > 0) && (
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCategories([]);
            setSelectedCourseTypes([]);
          }}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-midnight-blue-600 to-midnight-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Browse Courses</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover thousands of courses from expert instructors
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden h-12 px-6">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategories.length > 0 || selectedCourseTypes.length > 0) && (
                  <Badge className="ml-2 bg-midnight-blue-600">
                    {selectedCategories.length + selectedCourseTypes.length}
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

          {/* Desktop Filter Button */}
          <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="hidden sm:flex h-12 px-6">
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {(selectedCategories.length > 0 || selectedCourseTypes.length > 0) && (
              <Badge className="ml-2 bg-midnight-blue-600">
                {selectedCategories.length + selectedCourseTypes.length}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          {isFilterOpen && (
            <div className="hidden sm:block w-80 flex-shrink-0">
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Filter Courses</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <FilterContent />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Course Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedCourseTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="px-3 py-1">
                    {category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 hover:bg-transparent"
                      onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedCourseTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="px-3 py-1">
                    {type}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 hover:bg-transparent"
                      onClick={() => setSelectedCourseTypes(selectedCourseTypes.filter((t) => t !== type))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-midnight-blue-200 flex flex-col"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />

                    <Badge className={`absolute top-3 left-3 text-white ${getBadgeColor(course.type ?? "")}`}>
                      {course.type ?? "Course"}
                    </Badge>

                    {course.isCertificated && (
                      <Badge className="absolute top-3 right-3 bg-purple-500 text-white">Certificate</Badge>
                    )}
                  </div>

                  <CardHeader className="flex-1">
                    <div className="space-y-2">
                      {course.categories?.length > 0 && (
                        <Badge variant="outline" className="text-xs w-fit">
                          {course.categories[0]?.category?.name ?? "Uncategorized"}
                        </Badge>
                      )}
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-midnight-blue-700 transition-colors">
                        {course.title}
                      </CardTitle>

                      <p className="text-sm text-gray-600 capitalize">
                        Instructor: {course.instructor?.badge ?? "Unknown"}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(course.release_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-midnight-blue-800">
                            {formatPrice(parseFloat(course.price))}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {course.level?.name ?? "Unknown level"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    {parseFloat(course.price) === 0 ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => handleEnrollFree(course.id, e)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Enroll Free
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${
                          isInCart(course.id)
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-midnight-blue-800 hover:bg-midnight-blue-900"
                        } text-white`}
                        onClick={(e) => handleAddToCart(course, e)}
                        disabled={isInCart(course.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isInCart(course.id) ? "In Cart" : "Add to Cart"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
