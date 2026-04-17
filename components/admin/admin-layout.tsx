"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AdminPageLoader } from "./admin-page-loader"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = React.useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true)
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  React.useEffect(() => {
    let active = true

    apiFetch<{ isAuthenticated: boolean }>("/auth/session")
      .then((session) => {
        if (!active) return
        if (session.isAuthenticated) {
          setIsAuthorized(true)
          return
        }
        router.replace("/admin/login")
      })
      .catch(() => {
        if (!active) return
        router.replace("/admin/login")
      })
      .finally(() => {
        if (active) {
          setIsCheckingAuth(false)
        }
      })

    return () => {
      active = false
    }
  }, [router])

  if (isCheckingAuth) {
    return (
      <AdminPageLoader
        title="Checking session"
        description="Verifying your admin access..."
      />
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Header collapsed={collapsed} />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          collapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
