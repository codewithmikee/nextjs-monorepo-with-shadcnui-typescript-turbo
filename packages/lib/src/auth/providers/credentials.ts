import { ILoginUser } from "@repo/types/login-type";
import CredentialsProvider from "next-auth/providers/credentials";

export const credentialsProvider = CredentialsProvider({
  name: "credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const user: ILoginUser = await res.json();
    return user || null;
  },
});
