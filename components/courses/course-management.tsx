"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Plus, Trash2 } from "lucide-react"
import { fetchData } from "@/lib/api"

type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
}

const courseLevels = [
  { id: 1, name: "Beginner", description: "For those new to the subject", color: "green" },
  { id: 2, name: "Intermediate", description: "For those with some experience", color: "yellow" },
  { id: 3, name: "Advanced", description: "For experienced practitioners", color: "red" },
  { id: 4, name: "Expert", description: "For industry professionals", color: "purple" },
]

export function CourseManagement() {
  const [selectedTab, setSelectedTab] = useState("categories")
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isCreateLevelOpen, setIsCreateLevelOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const getCategories = async (page = 1) => {
    try {
      const res = await fetchData(`/course/category?page=${page}&per_page=10`)
      setCategories(res.data || [])
      setLastPage(res.meta.last_page || 1)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    getCategories(currentPage)
  }, [currentPage])

  const nextPage = () => {
    if (currentPage < lastPage) setCurrentPage(prev => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-midnight-blue-800">Course Management</h1>
      <p className="text-muted-foreground">Manage course categories and levels</p>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
        </TabsList>

        {/* === CATEGORY TAB === */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Course Categories</h3>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>Add a new course category to organize your courses</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input id="categoryName" placeholder="Enter category name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea id="categoryDescription" placeholder="Enter category description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>Cancel</Button>
                  <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">Create Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline"><Edit className="w-3 h-3" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <CardDescription>{category.description || "-"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{category.created_at}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" disabled={currentPage === 1} onClick={prevPage}>Previous</Button>
            <span className="text-muted-foreground">Page {currentPage} of {lastPage}</span>
            <Button variant="outline" disabled={currentPage === lastPage} onClick={nextPage}>Next</Button>
          </div>
        </TabsContent>

        {/* === LEVELS TAB === */}
        <TabsContent value="levels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Course Levels</h3>
            <Dialog open={isCreateLevelOpen} onOpenChange={setIsCreateLevelOpen}>
              <DialogTrigger asChild>
                <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Level
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Level</DialogTitle>
                  <DialogDescription>Add a new course difficulty level</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="levelName">Level Name</Label>
                    <Input id="levelName" placeholder="Enter level name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="levelDescription">Description</Label>
                    <Textarea id="levelDescription" placeholder="Enter level description" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="levelColor">Color</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateLevelOpen(false)}>Cancel</Button>
                  <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">Create Level</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseLevels.map((level) => (
              <Card key={level.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${level.color}-500`} />
                      {level.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline"><Edit className="w-3 h-3" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
