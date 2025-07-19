"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Eye,
  Filter,
  FileText,
  FileSpreadsheet,
} from "lucide-react"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Transaction {
  id: string
  date: string
  courseName: string
  studentName: string
  amount: number
  commission: number
  netAmount: number
  status: "completed" | "pending" | "refunded"
  paymentMethod: string
}

interface WithdrawalRequest {
  id: string
  amount: number
  requestDate: string
  status: "pending" | "approved" | "rejected" | "completed"
  method: string
  accountInfo: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    courseName: "Complete React Developer Course",
    studentName: "Alice Johnson",
    amount: 99,
    commission: 9.9,
    netAmount: 89.1,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    date: "2024-01-14",
    courseName: "Advanced JavaScript Concepts",
    studentName: "Bob Smith",
    amount: 149,
    commission: 14.9,
    netAmount: 134.1,
    status: "completed",
    paymentMethod: "PayPal",
  },
  {
    id: "3",
    date: "2024-01-13",
    courseName: "UI/UX Design Fundamentals",
    studentName: "Carol Davis",
    amount: 79,
    commission: 7.9,
    netAmount: 71.1,
    status: "pending",
    paymentMethod: "Credit Card",
  },
  {
    id: "4",
    date: "2024-01-12",
    courseName: "Complete React Developer Course",
    studentName: "David Wilson",
    amount: 99,
    commission: 9.9,
    netAmount: 89.1,
    status: "refunded",
    paymentMethod: "Credit Card",
  },
]

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: "1",
    amount: 500,
    requestDate: "2024-01-10",
    status: "completed",
    method: "Bank Transfer",
    accountInfo: "****1234",
  },
  {
    id: "2",
    amount: 300,
    requestDate: "2024-01-05",
    status: "pending",
    method: "PayPal",
    accountInfo: "instructor@email.com",
  },
]

const monthlyData = [
  { month: "Jan", revenue: 1200, withdrawals: 800 },
  { month: "Feb", revenue: 1800, withdrawals: 1200 },
  { month: "Mar", revenue: 2200, withdrawals: 1500 },
  { month: "Apr", revenue: 1900, withdrawals: 1000 },
  { month: "May", revenue: 2800, withdrawals: 2000 },
  { month: "Jun", revenue: 3200, withdrawals: 2500 },
]

export function IncomeManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals)
  const [selectedPeriod, setSelectedPeriod] = useState("this-month")
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")

  const totalEarnings = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.netAmount, 0)

  const pendingEarnings = transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.netAmount, 0)

  const availableBalance =
    totalEarnings - withdrawals.filter((w) => w.status === "completed").reduce((sum, w) => sum + w.amount, 0)

  const thisMonthEarnings = transactions
    .filter((t) => t.status === "completed" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.netAmount, 0)

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      refunded: "bg-red-100 text-red-800",
      approved: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleWithdrawRequest = () => {
    const newWithdrawal: WithdrawalRequest = {
      id: Date.now().toString(),
      amount: Number.parseFloat(withdrawAmount),
      requestDate: new Date().toISOString().split("T")[0],
      status: "pending",
      method: withdrawMethod,
      accountInfo: withdrawMethod === "Bank Transfer" ? "****1234" : "instructor@email.com",
    }

    setWithdrawals([newWithdrawal, ...withdrawals])
    setIsWithdrawDialogOpen(false)
    setWithdrawAmount("")
    setWithdrawMethod("")
  }

  const handleExport = (format: string) => {
    // Implement your export logic here based on the format
    console.log(`Exporting as ${format}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">Income Management</h1>
          <p className="text-muted-foreground">Track your earnings and manage withdrawals</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                <Wallet className="w-4 h-4 mr-2" />
                Request Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Withdrawal</DialogTitle>
                <DialogDescription>Withdraw your available earnings to your preferred payment method</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Available balance: ${availableBalance.toFixed(2)}</p>
                </div>
                {/* Remove payment method selection from withdrawal dialog. */}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleWithdrawRequest}
                  disabled={!withdrawAmount || !withdrawMethod}
                  className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
                >
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-midnight-blue-800">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-blue-600">${availableBalance.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-purple-600">${thisMonthEarnings.toFixed(2)}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% vs last month
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">${pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Processing payments</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Your earnings over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Withdrawals</CardTitle>
            <CardDescription>Comparison of earnings and withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                withdrawals: {
                  label: "Withdrawals",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Bar dataKey="withdrawals" fill="var(--color-withdrawals)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>All your course sales and earnings</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="max-w-40 truncate">{transaction.courseName}</div>
                      </TableCell>
                      <TableCell>{transaction.studentName}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell className="text-red-600">-${transaction.commission}</TableCell>
                      <TableCell className="font-medium">${transaction.netAmount}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>Track your withdrawal requests and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="text-sm">{new Date(withdrawal.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">${withdrawal.amount}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell>{withdrawal.accountInfo}</TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
