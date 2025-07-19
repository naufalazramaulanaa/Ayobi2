"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, Settings, CreditCard, Wallet, Building2, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  methods: number
  transactions: number
  revenue: number
  status: "active" | "inactive"
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  category: string
  code: string
  fee: {
    type: "fixed" | "percentage"
    amount: number
  }
  transactions: number
  revenue: number
  status: "active" | "inactive"
}

const paymentCategories: PaymentCategory[] = [
  {
    id: "1",
    name: "Bank Transfer",
    description: "Traditional bank transfer methods for secure transactions",
    icon: Building2,
    methods: 3,
    transactions: 1250,
    revenue: 125000000,
    status: "active",
  },
  {
    id: "2",
    name: "E-Wallet",
    description: "Digital wallet payments for quick and easy transactions",
    icon: Wallet,
    methods: 3,
    transactions: 2100,
    revenue: 89500000,
    status: "active",
  },
  {
    id: "3",
    name: "Credit Card",
    description: "Credit and debit card payments",
    icon: CreditCard,
    methods: 0,
    transactions: 0,
    revenue: 0,
    status: "inactive",
  },
]

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "BCA Virtual Account",
    description: "Bank Central Asia virtual account payment",
    category: "Bank Transfer",
    code: "BCA_VA",
    fee: { type: "fixed", amount: 4000 },
    transactions: 450,
    revenue: 45000000,
    status: "active",
  },
  {
    id: "2",
    name: "Mandiri Virtual Account",
    description: "Bank Mandiri virtual account payment",
    category: "Bank Transfer",
    code: "MANDIRI_VA",
    fee: { type: "fixed", amount: 4000 },
    transactions: 380,
    revenue: 38000000,
    status: "active",
  },
  {
    id: "3",
    name: "BNI Virtual Account",
    description: "Bank Negara Indonesia virtual account payment",
    category: "Bank Transfer",
    code: "BNI_VA",
    fee: { type: "fixed", amount: 4000 },
    transactions: 420,
    revenue: 42000000,
    status: "active",
  },
  {
    id: "4",
    name: "GoPay",
    description: "GoPay digital wallet payment",
    category: "E-Wallet",
    code: "GOPAY",
    fee: { type: "percentage", amount: 2.5 },
    transactions: 750,
    revenue: 32000000,
    status: "active",
  },
  {
    id: "5",
    name: "OVO",
    description: "OVO digital wallet payment",
    category: "E-Wallet",
    code: "OVO",
    fee: { type: "percentage", amount: 2.5 },
    transactions: 680,
    revenue: 28500000,
    status: "active",
  },
  {
    id: "6",
    name: "DANA",
    description: "DANA digital wallet payment",
    category: "E-Wallet",
    code: "DANA",
    fee: { type: "percentage", amount: 2.5 },
    transactions: 670,
    revenue: 29000000,
    status: "active",
  },
]

export function PaymentGateway() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("categories")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  const filteredCategories = paymentCategories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || category.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredMethods = paymentMethods.filter((method) => {
    const matchesSearch =
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || method.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCategories = paymentCategories.length
  const activeCategories = paymentCategories.filter((c) => c.status === "active").length
  const totalMethods = paymentMethods.length
  const activeMethods = paymentMethods.filter((m) => m.status === "active").length
  const totalTransactions = paymentMethods.reduce((sum, method) => sum + method.transactions, 0)
  const totalRevenue = paymentMethods.reduce((sum, method) => sum + method.revenue, 0)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transaction</h1>
        <p className="text-muted-foreground">Manage payment categories and methods with comprehensive analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Categories</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activeCategories}/{totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">Active payment categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeMethods}/{totalMethods}
            </div>
            <p className="text-xs text-muted-foreground">Available payment methods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Transactions</CardTitle>
            <Smartphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatNumber(totalTransactions)}</div>
            <p className="text-xs text-muted-foreground">Total transactions processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Revenue</CardTitle>
            <Building2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total revenue generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories, methods, or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Categories
            <Badge variant="secondary">{filteredCategories.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Methods
            <Badge variant="secondary">{filteredMethods.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Payment Categories</h2>
              <p className="text-muted-foreground">Organize your payment methods into categories</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Methods</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {category.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.methods}</Badge>
                      </TableCell>
                      <TableCell>{formatNumber(category.transactions)}</TableCell>
                      <TableCell>{formatCurrency(category.revenue)}</TableCell>
                      <TableCell>
                        <Badge variant={category.status === "active" ? "default" : "secondary"}>
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit Category</DropdownMenuItem>
                            <DropdownMenuItem>View Methods</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Category</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Payment Methods</h2>
              <p className="text-muted-foreground">Configure individual payment methods and their settings</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Code</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMethods.map((method) => (
                  <TableRow key={method.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{method.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{method.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <code className="rounded bg-muted px-2 py-1 text-sm">{method.code}</code>
                    </TableCell>
                    <TableCell>
                      {method.fee.type === "fixed" ? formatCurrency(method.fee.amount) : `${method.fee.amount}%`}
                    </TableCell>
                    <TableCell>{formatNumber(method.transactions)}</TableCell>
                    <TableCell>{formatCurrency(method.revenue)}</TableCell>
                    <TableCell>
                      <Badge variant={method.status === "active" ? "default" : "secondary"}>{method.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit Method</DropdownMenuItem>
                          <DropdownMenuItem>Test Payment</DropdownMenuItem>
                          <DropdownMenuItem>View Transactions</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Method</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
