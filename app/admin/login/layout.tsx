import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If already authenticated, redirect to admin dashboard
  const session = await getSession()
  if (session.isAuthenticated) {
    redirect("/admin")
  }

  return <>{children}</>
}
