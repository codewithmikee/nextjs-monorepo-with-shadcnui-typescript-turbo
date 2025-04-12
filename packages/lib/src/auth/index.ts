import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth.config"

// Use it in server components
export async function auth() {
  return getServerSession(authOptions)
}

// Use it in API routes
export async function authApi(req: Request) {
  return getServerSession(authOptions)
}
