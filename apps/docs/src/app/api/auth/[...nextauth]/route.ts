// src/app/api/auth/[...nextauth]/route.ts
// import { handlers } from "@repo/lib/auth";
import { handlers } from "@repo/lib/auth/config";
import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@repo/lib/auth/auth.config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
