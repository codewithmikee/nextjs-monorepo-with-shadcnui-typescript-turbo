// Extend NextAuth types with your ILoginUser
import { UserRole } from "@repo/types/enums/backend-enums";
import { ILoginUser } from "@repo/types/login-type";
import "next-auth";


declare module 'next-auth' {
  interface User extends ILoginUser {}

  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    role: UserRole;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
    user: User;
  }
}
