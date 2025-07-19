"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, DollarSign, TrendingUp, TrendingDown, BookOpen, CreditCard } from "lucide-react"

export function RevenueReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const revenueData = {
    totalRevenue: 125420,
    monthlyGrowth: 12.5,
    totalTransactions: 1847,
    averageOrderValue: 67.89,
    topCourses: [
      { name: "Complete React Developer Course", revenue: 15420, sales: 234 },
      { name: "Advanced JavaScript Mastery", revenue: 12890, sales: 198 },
      { name: "Python for Data Science", revenue: 11250, sales: 167 },
      { name: "UI/UX Design Fundamentals", revenue: 9870, sales: 145 },
    ],
    monthlyRevenue: [
      { month: "Jan", revenue: 8500, transactions: 125 },
      { month: "Feb", revenue: 9200, transactions: 142 },
      { month: "Mar", revenue: 11800, transactions: 178 },
      { month: "Apr", revenue: 10500, transactions: 156 },
      { month: "May", revenue: 12400, transactions: 189 },
      { month: "Jun", revenue: 15420, transactions: 234 },
    ],
    paymentMethods: [
      { method: "Credit Card", percentage: 65, amount: 81523 },
      { method: "PayPal", percentage: 25, amount: 31355 },
      { method: "Bank Transfer", percentage: 10, amount: 12542 },
    ],
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight-blue-800">Revenue Reports</h1>
          <p className="text-midnight-blue-600">Track and analyze platform revenue performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />+{revenueData.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.averageOrderValue}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15 new this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Top Courses</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
              <CardDescription>Revenue and transaction trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-midnight-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-midnight-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{month.month} 2024</p>
                        <p className="text-sm text-muted-foreground">{month.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${month.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
              <CardDescription>Courses generating the highest revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.topCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-midnight-blue-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${course.revenue.toLocaleString()}</p>
                      <Badge variant="secondary">Top Performer</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
              <CardDescription>Breakdown of payment methods used by students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.paymentMethods.map((method) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{method.method}</span>
                      <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-midnight-blue-600 h-2 rounded-full"
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">${method.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends & Insights</CardTitle>
              <CardDescription>Key insights and growth patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Growth Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>Monthly Growth Rate</span>
                      <Badge className="bg-green-100 text-green-800">+12.5%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span>Customer Retention</span>
                      <Badge className="bg-blue-100 text-blue-800">87%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span>Course Completion Rate</span>
                      <Badge className="bg-purple-100 text-purple-800">73%</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Insights</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 border-l-4 border-green-500 bg-green-50">
                      <p className="font-medium text-green-800">Peak Sales Period</p>
                      <p className="text-green-700">June showed 23% increase in course enrollments</p>
                    </div>
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <p className="font-medium text-blue-800">Popular Category</p>
                      <p className="text-blue-700">Web Development courses generate 40% of total revenue</p>
                    </div>
                    <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                      <p className="font-medium text-purple-800">Growth Opportunity</p>
                      <p className="text-purple-700">Mobile app courses show potential for expansion</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
