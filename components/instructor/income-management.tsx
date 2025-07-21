"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowUpRight } from "lucide-react";
import { fetchData } from "@/lib/api";

export function IncomeManagement() {
  const [summary, setSummary] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const dummyTransactions = [
    {
      id: 1,
      date: "2024-07-01",
      course: "React Fundamentals",
      student: "Jane Doe",
      amount: 100,
      commission: 10,
      net: 90,
      status: "completed",
    },
    {
      id: 2,
      date: "2024-07-02",
      course: "Vue Basics",
      student: "John Smith",
      amount: 150,
      commission: 15,
      net: 135,
      status: "pending",
    },
  ];

  const dummyWithdrawals = [
    {
      id: 1,
      date: "2024-07-03",
      amount: 500,
      method: "Bank",
      account: "****1234",
      status: "completed",
    },
  ];

  useEffect(() => {
    const loadIncomeData = async () => {
      try {
        const response = await fetchData("/instructor/income-management");
        setSummary(response.data.summaries);
        setStats(response.data.statistics);
      } catch (error) {
        console.error("Failed to load income data", error);
      }
    };
    loadIncomeData();
  }, []);

  const totalEarnings = summary?.income?.total || 0;
  const thisMonthEarnings = summary?.income?.this_month || 0;
  const lastMonthEarnings = summary?.income?.last_month || 0;
  const growthRate = summary?.income?.growth_rate || 0;
  const pendingEarnings = summary?.balance?.total_pending || 0;
  const availableBalance = summary?.balance?.balance || 0;
  const minWithdrawal = summary?.balance?.minimum_withdrawal_amount || 0;
  const withdrawalStatus = summary?.balance?.withdrawal_status || "not_eligible";

  const monthlyData =
    stats?.revenue_vs_withdrawal?.labels?.map((month: string, idx: number) => ({
      month,
      revenue: stats.revenue_vs_withdrawal.datasets[0].data[idx],
      withdrawals: stats.revenue_vs_withdrawal.datasets[1].data[idx],
    })) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold text-midnight-blue-800">${totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +{growthRate}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-blue-600">${availableBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Min. Withdrawal: ${minWithdrawal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-purple-600">${thisMonthEarnings.toFixed(2)}</p>
            <p className="text-xs text-purple-600 mt-1">Last Month: ${lastMonthEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-orange-600">${pendingEarnings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Status: {withdrawalStatus}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ revenue: { label: "Revenue", color: "#3b82f6" } }}
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
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#3b82f6" },
                withdrawals: { label: "Withdrawals", color: "#f97316" },
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
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
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
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.course}</TableCell>
                      <TableCell>{tx.student}</TableCell>
                      <TableCell>${tx.amount}</TableCell>
                      <TableCell className="text-red-600">-${tx.commission}</TableCell>
                      <TableCell className="font-semibold">${tx.net}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyWithdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>{w.date}</TableCell>
                      <TableCell>${w.amount}</TableCell>
                      <TableCell>{w.method}</TableCell>
                      <TableCell>{w.account}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{w.status}</Badge>
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
  );
}
