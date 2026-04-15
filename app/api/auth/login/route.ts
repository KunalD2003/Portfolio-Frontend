import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const SESSION_COOKIE_NAME = "admin_session"
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production"

function generateSessionToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${random}-${SESSION_SECRET.substring(0, 8)}`
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const sessionToken = generateSessionToken()
      const cookieStore = await cookies()

      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
