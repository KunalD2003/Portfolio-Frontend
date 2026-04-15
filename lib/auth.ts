"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api/v1"

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      return { success: false, error: payload.error || "Invalid username or password" }
    }
    return { success: true }
  } catch {
    return { success: false, error: "Unable to reach backend service" }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")
  try {
    await fetch(`${BACKEND_API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    })
  } catch {
    // Ignore network errors and still redirect to login.
  }
  redirect("/admin/login")
}

export async function getSession(): Promise<{ isAuthenticated: boolean }> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/auth/session`, {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    })
    if (!response.ok) {
      return { isAuthenticated: false }
    }
    const data = await response.json()
    return { isAuthenticated: !!data.isAuthenticated }
  } catch {
    return { isAuthenticated: false }
  }
}

export async function requireAuth(): Promise<void> {
  const session = await getSession()
  if (!session.isAuthenticated) {
    redirect("/admin/login")
  }
}
