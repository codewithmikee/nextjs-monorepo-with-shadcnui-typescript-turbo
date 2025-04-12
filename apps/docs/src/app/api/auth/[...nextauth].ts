import { authOptions } from "@repo/lib/auth/auth.config";
import NextAuth from "next-auth";

export default NextAuth(authOptions);
