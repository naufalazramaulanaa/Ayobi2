"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Calendar, Users, Clock, Plus } from "lucide-react"

export default function LiveClassesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">Live Classes</h1>
          <p className="text-muted-foreground">Schedule and manage your live teaching sessions</p>
        </div>
        <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">React Fundamentals Q&A</CardTitle>
              <Badge className="bg-green-100 text-green-800">Live</Badge>
            </div>
            <CardDescription>Interactive session for React beginners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Today, 2:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Duration: 1 hour</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>45 participants</span>
            </div>
            <Button className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900">
              <Video className="w-4 h-4 mr-2" />
              Join Class
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">JavaScript Advanced Topics</CardTitle>
              <Badge variant="outline">Scheduled</Badge>
            </div>
            <CardDescription>Deep dive into advanced JavaScript concepts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Tomorrow, 3:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Duration: 1.5 hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>32 registered</span>
            </div>
            <Button variant="outline" className="w-full">
              <Video className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Video className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Schedule New Class</h3>
            <p className="text-sm text-muted-foreground mb-4">Create interactive live sessions for your students</p>
            <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
              <Plus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
