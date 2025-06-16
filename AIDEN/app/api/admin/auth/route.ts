import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Lihtne admin parool - tootmises kasuta turvalisemaid meetodeid
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      const cookieStore = await cookies()

      // Loo lihtne sessiooni token
      const sessionToken = Buffer.from(`admin-${Date.now()}`).toString("base64")

      cookieStore.set("admin-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 tundi
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Vale parool" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")

    return NextResponse.json({ authenticated: !!session })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin-session")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}
