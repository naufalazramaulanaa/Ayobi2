"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Gift, Share2, Copy, Check, Trophy, Star, DollarSign, TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function StudentReferral() {
  const [copied, setCopied] = useState(false)
  const [referralCode] = useState("STUDENT2024")
  const [referralLink] = useState("https://edulms.com/register?ref=STUDENT2024")

  // Mock data
  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 480000,
    pendingEarnings: 120000,
    currentLevel: "Silver",
    nextLevel: "Gold",
    progressToNext: 67,
  }

  const recentReferrals = [
    { name: "John Doe", email: "john@example.com", status: "Active", earnings: 50000, date: "2024-01-15" },
    { name: "Jane Smith", email: "jane@example.com", status: "Active", earnings: 50000, date: "2024-01-12" },
    { name: "Mike Johnson", email: "mike@example.com", status: "Pending", earnings: 0, date: "2024-01-10" },
    { name: "Sarah Wilson", email: "sarah@example.com", status: "Active", earnings: 50000, date: "2024-01-08" },
  ]

  const levels = [
    { name: "Bronze", minReferrals: 0, commission: "10%", color: "bg-amber-600" },
    { name: "Silver", minReferrals: 5, commission: "15%", color: "bg-gray-400" },
    { name: "Gold", minReferrals: 15, commission: "20%", color: "bg-yellow-500" },
    { name: "Platinum", minReferrals: 30, commission: "25%", color: "bg-purple-500" },
  ]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const handleShare = (platform: string) => {
    const message = `Join EduLMS and get amazing courses! Use my referral code: ${referralCode}`
    const url = encodeURIComponent(referralLink)
    const text = encodeURIComponent(message)

    let shareUrl = ""
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">Earn money by referring friends to EduLMS</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-midnight-blue-800">{referralStats.totalReferrals}</p>
                </div>
                <Users className="w-8 h-8 text-midnight-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Referrals</p>
                  <p className="text-2xl font-bold text-green-600">{referralStats.activeReferrals}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(referralStats.totalEarnings)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-yellow-600">{referralStats.currentLevel}</p>
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="share">Share & Earn</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="levels">Levels</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress to {referralStats.nextLevel}</span>
                    <span className="text-sm text-gray-500">{referralStats.progressToNext}%</span>
                  </div>
                  <Progress value={referralStats.progressToNext} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {15 - referralStats.totalReferrals} more referrals needed to reach {referralStats.nextLevel} level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle>How Referral Program Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Share2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Share Your Link</h3>
                    <p className="text-sm text-gray-600">Share your unique referral link with friends and family</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Friends Sign Up</h3>
                    <p className="text-sm text-gray-600">Your friends register and purchase their first course</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Earn Commission</h3>
                    <p className="text-sm text-gray-600">Get 15% commission on every purchase they make</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReferrals.slice(0, 3).map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{referral.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{referral.name}</p>
                          <p className="text-sm text-gray-500">{referral.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{referral.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share" className="space-y-6">
            {/* Referral Code & Link */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Code & Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Referral Code</label>
                  <div className="flex space-x-2">
                    <Input value={referralCode} readOnly className="flex-1" />
                    <Button onClick={handleCopyCode} variant="outline">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Referral Link</label>
                  <div className="flex space-x-2">
                    <Input value={referralLink} readOnly className="flex-1" />
                    <Button onClick={handleCopyLink} variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Share on Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => handleShare("whatsapp")}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    WhatsApp
                  </Button>
                  <Button onClick={() => handleShare("telegram")} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Telegram
                  </Button>
                  <Button onClick={() => handleShare("twitter")} className="bg-sky-500 hover:bg-sky-600 text-white">
                    Twitter
                  </Button>
                  <Button onClick={() => handleShare("facebook")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReferrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{referral.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{referral.name}</p>
                          <p className="text-sm text-gray-500">{referral.email}</p>
                          <p className="text-xs text-gray-400">{referral.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {referral.earnings > 0 ? formatCurrency(referral.earnings) : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Levels & Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levels.map((level, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        level.name === referralStats.currentLevel ? "border-yellow-400 bg-yellow-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${level.color} rounded-full flex items-center justify-center`}>
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{level.name}</h3>
                            <p className="text-sm text-gray-600">
                              {level.minReferrals}+ referrals • {level.commission} commission
                            </p>
                          </div>
                        </div>
                        {level.name === referralStats.currentLevel && (
                          <Badge className="bg-yellow-500">Current Level</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
