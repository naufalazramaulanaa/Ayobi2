"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Copy,
  Mail,
  FileText,
  MessageSquare,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

interface Complaint {
  id: string
  title: string
  category: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Waiting" | "On Process" | "Success"
  date: Date
  description: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I enroll in a course?",
    answer:
      "To enroll in a course, simply browse our course catalog, select the course you want, and click 'Enroll Now'. You'll be guided through the payment process.",
    category: "General",
  },
  {
    id: 2,
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your course, you can request a full refund within 30 days of purchase.",
    category: "Payment",
  },
  {
    id: 3,
    question: "How do I access my certificates?",
    answer:
      "Once you complete a course, your certificate will be automatically generated and available in your 'Certificates' section in your dashboard.",
    category: "Certificates",
  },
  {
    id: 4,
    question: "Can I download course videos for offline viewing?",
    answer:
      "Yes, our mobile app allows you to download course videos for offline viewing. This feature is available for all enrolled courses.",
    category: "Technical",
  },
  {
    id: 5,
    question: "How do I reset my password?",
    answer:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you instructions to reset your password.",
    category: "Account",
  },
  {
    id: 6,
    question: "Are there any prerequisites for courses?",
    answer:
      "Prerequisites vary by course. Check the course description for specific requirements. Most beginner courses have no prerequisites.",
    category: "General",
  },
]

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [generatedTicket, setGeneratedTicket] = useState("")
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "TKT-2024-001",
      title: "Payment not processed",
      category: "Payment",
      priority: "High",
      status: "On Process",
      date: new Date("2024-01-15"),
      description: "My payment was deducted but course access not granted",
    },
    {
      id: "TKT-2024-002",
      title: "Video not loading",
      category: "Technical",
      priority: "Medium",
      status: "Success",
      date: new Date("2024-01-10"),
      description: "Course videos are not loading properly",
    },
  ])

  // Form state
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  })

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generateTicketNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `TKT-${year}-${random}`
  }

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault()

    const ticketNumber = generateTicketNumber()
    const newComplaint: Complaint = {
      id: ticketNumber,
      title: complaintForm.title,
      category: complaintForm.category,
      priority: complaintForm.priority as "Low" | "Medium" | "High" | "Urgent",
      status: "Waiting",
      date: new Date(),
      description: complaintForm.description,
    }

    setComplaints((prev) => [newComplaint, ...prev])
    setGeneratedTicket(ticketNumber)
    setShowSuccessDialog(true)

    // Reset form
    setComplaintForm({
      title: "",
      category: "",
      priority: "",
      description: "",
    })

    // Simulate email notification
    toast({
      title: "Email Sent",
      description: "Confirmation email has been sent to your registered email address.",
    })
  }

  const copyTicketNumber = () => {
    navigator.clipboard.writeText(generatedTicket)
    toast({
      title: "Copied!",
      description: "Ticket number copied to clipboard.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Clock className="w-4 h-4" />
      case "On Process":
        return <AlertCircle className="w-4 h-4" />
      case "Success":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800"
      case "On Process":
        return "bg-blue-100 text-blue-800"
      case "Success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-midnight-blue-800 mb-4">Help Center</h1>
        <p className="text-gray-600 text-lg">Find answers to common questions or submit a support request</p>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="submit" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Submit Complaint</span>
          </TabsTrigger>
          <TabsTrigger value="track" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Track Status</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{faq.category}</Badge>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedFAQ === faq.id && (
                    <CardContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Submit Complaint Tab */}
        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Complaint</CardTitle>
              <CardDescription>Describe your issue and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div>
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={complaintForm.category}
                      onValueChange={(value) => setComplaintForm((prev) => ({ ...prev, category: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Payment">Payment</SelectItem>
                        <SelectItem value="Course">Course Content</SelectItem>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={complaintForm.priority}
                      onValueChange={(value) => setComplaintForm((prev) => ({ ...prev, priority: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-midnight-blue-600 hover:bg-midnight-blue-700">
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Track Status Tab */}
        <TabsContent value="track" className="space-y-6">
          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="font-mono text-xs">
                            {complaint.id}
                          </Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                        </div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>
                          Category: {complaint.category} • Submitted: {complaint.date.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(complaint.status)} flex items-center space-x-1`}>
                          {getStatusIcon(complaint.status)}
                          <span>{complaint.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{complaint.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>Updates will be sent to your registered email address</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Complaints Found</h3>
                <p className="text-gray-500 mb-4">You haven't submitted any complaints yet.</p>
                <Button onClick={() => document.querySelector('[value="submit"]')?.click()} variant="outline">
                  Submit Your First Complaint
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span>Complaint Submitted Successfully!</span>
            </DialogTitle>
            <DialogDescription>Your complaint has been received and assigned a ticket number.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Your Ticket Number:</Label>
              <div className="flex items-center justify-between mt-2">
                <code className="text-lg font-mono bg-white px-3 py-2 rounded border">{generatedTicket}</code>
                <Button variant="outline" size="sm" onClick={copyTicketNumber} className="ml-2">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Confirmation email sent to your registered address</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>We'll respond within 24 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Use this ticket number to track your complaint status</span>
              </div>
            </div>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-midnight-blue-600 hover:bg-midnight-blue-700"
            >
              Got it, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
