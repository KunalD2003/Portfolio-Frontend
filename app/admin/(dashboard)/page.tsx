 "use client"

import * as React from "react"
import { FolderKanban, Sparkles, Briefcase, Mail, Eye, Clock } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { AdminPageLoader } from "@/components/admin/admin-page-loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"
import type { Message } from "@/lib/types"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<{
    stats: {
      projects: number
      skills: number
      experience: number
      messages: number
      unreadMessages: number
    }
    recentMessages: Message[]
    recentActivity: Array<{
      id: number
      type: "message" | "project" | "skill"
      title: string
      description: string
      time: string
    }>
  } | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    apiFetch<{ data: NonNullable<typeof dashboard> }>("/admin/dashboard")
      .then((response) => setDashboard(response.data))
      .catch(() => setDashboard(null))
      .finally(() => setIsLoading(false))
  }, [])

  const recentActivity = dashboard?.recentActivity || []
  const recentMessages = dashboard?.recentMessages || []

  if (isLoading) {
    return (
      <AdminPageLoader
        title="Loading dashboard"
        description="Preparing your portfolio overview..."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={dashboard?.stats.projects ?? 0}
          icon={FolderKanban}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Skills"
          value={dashboard?.stats.skills ?? 0}
          icon={Sparkles}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Experience"
          value={dashboard?.stats.experience ?? 0}
          description="Years of work history"
          icon={Briefcase}
        />
        <StatsCard
          title="Messages"
          value={dashboard?.stats.messages ?? 0}
          description={`${dashboard?.stats.unreadMessages ?? 0} unread`}
          icon={Mail}
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Portfolio Views"
          value="2,847"
          description="Total views this month"
          icon={Eye}
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Avg. Session Duration"
          value="3m 24s"
          description="Time spent on your portfolio"
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Activity & Messages Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-accent/10">
                    {activity.type === "message" && (
                      <Mail className="h-4 w-4 text-accent" />
                    )}
                    {activity.type === "project" && (
                      <FolderKanban className="h-4 w-4 text-accent" />
                    )}
                    {activity.type === "skill" && (
                      <Sparkles className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">
                      {message.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {message.name}
                      </p>
                      {message.unread && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {message.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
