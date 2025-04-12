// import { authOptions } from "./providers/credentials";
import NextAuth from "next-auth";
import { authOptions } from "./auth.config";

// Export handlers for NextAuth API route
const handlers = NextAuth(authOptions);
export { handlers };
