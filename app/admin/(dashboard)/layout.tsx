import { AdminLayout } from "@/components/admin/admin-layout"
import { requireAuth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect all dashboard routes
  await requireAuth()

  return <AdminLayout>{children}</AdminLayout>
}
