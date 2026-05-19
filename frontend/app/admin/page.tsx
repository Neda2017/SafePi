"use client"

import { useState, useEffect } from "react"
import { Shield, Database, AlertTriangle, CheckCircle2, XCircle, Clock, MessageSquare, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PendingReport {
  id: string
  url: string
  type: string
  description: string
  reporterEmail: string
  timestamp: string
  status: "pending" | "approved" | "rejected"
}

interface Feedback {
  id: string
  name: string
  email: string
  rating: number
  feedback: string
  timestamp: string
  approved: boolean
}

export default function AdminPage() {
  const [reports, setReports] = useState<PendingReport[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [mainTab, setMainTab] = useState<"reports" | "feedback">("reports")
  const [selectedTab, setSelectedTab] = useState<"pending" | "approved" | "rejected">("pending")

  useEffect(() => {
    const saved = localStorage.getItem("communityReports")
    if (saved) {
      const allReports = JSON.parse(saved)
      setReports(allReports.map((r: any) => ({ ...r, status: r.status || "pending" })))
    }

    const savedFeedback = localStorage.getItem("userFeedback")
    if (savedFeedback) {
      setFeedbacks(JSON.parse(savedFeedback))
    }
  }, [])

  const handleApprove = (id: string) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    setReports(updated)
    localStorage.setItem("communityReports", JSON.stringify(updated))
  }

  const handleReject = (id: string) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    setReports(updated)
    localStorage.setItem("communityReports", JSON.stringify(updated))
  }

  const handleApproveFeedback = (id: string) => {
    const updated = feedbacks.map((f) => (f.id === id ? { ...f, approved: true } : f))
    setFeedbacks(updated)
    localStorage.setItem("userFeedback", JSON.stringify(updated))
  }

  const handleDeleteFeedback = (id: string) => {
    const updated = feedbacks.filter((f) => f.id !== id)
    setFeedbacks(updated)
    localStorage.setItem("userFeedback", JSON.stringify(updated))
  }

  const filteredReports = reports.filter((r) => r.status === selectedTab)

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    approved: reports.filter((r) => r.status === "approved").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Safeπ Admin</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage reports and user feedback</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setMainTab("reports")}
            variant={mainTab === "reports" ? "default" : "outline"}
            size="lg"
            className="flex-1"
          >
            <Database className="w-4 h-4 mr-2" />
            Community Reports
          </Button>
          <Button
            onClick={() => setMainTab("feedback")}
            variant={mainTab === "feedback" ? "default" : "outline"}
            size="lg"
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            User Feedback ({feedbacks.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </Card>
        </div>

        {mainTab === "feedback" ? (
          <Card className="p-6">
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No user feedback yet</p>
                </div>
              ) : (
                feedbacks.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg bg-muted/20 border border-border space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= item.rating ? "fill-warning text-warning" : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          {item.approved && <Badge variant="outline" className="text-success border-success">Approved</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.feedback}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{item.email}</span>
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!item.approved && (
                          <Button
                            onClick={() => handleApproveFeedback(item.id)}
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success/10"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteFeedback(item.id)}
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setSelectedTab("pending")}
                variant={selectedTab === "pending" ? "default" : "outline"}
                className="flex-1"
              >
                Pending ({stats.pending})
              </Button>
              <Button
                onClick={() => setSelectedTab("approved")}
                variant={selectedTab === "approved" ? "default" : "outline"}
                className="flex-1"
              >
                Approved ({stats.approved})
              </Button>
              <Button
                onClick={() => setSelectedTab("rejected")}
                variant={selectedTab === "rejected" ? "default" : "outline"}
                className="flex-1"
              >
                Rejected ({stats.rejected})
              </Button>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No {selectedTab} reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-4 rounded-lg bg-muted/20 border border-border space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <span className="text-xs text-muted-foreground">{report.timestamp}</span>
                        </div>
                        <p className="font-semibold text-foreground mb-1">{report.url}</p>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <p className="text-xs text-muted-foreground">Reported by: {report.reporterEmail}</p>
                      </div>
                      {selectedTab === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(report.id)}
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success/10"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(report.id)}
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
