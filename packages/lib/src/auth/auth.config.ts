import NextAuth, { type NextAuthOptions } from "next-auth";
import { credentialsProvider } from "./providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [credentialsProvider],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...token.user,
        userName: token.userName, // Include userName
        email: token.email,
        role: token.role,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpires: token.accessTokenExpires
      };
      return session;
    }
  },
};

export default NextAuth(authOptions);
