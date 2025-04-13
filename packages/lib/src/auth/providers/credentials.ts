import { authServerSideApi } from "../../api-client/api-clients";
import { ILoginUser } from "@repo/types/login-type";
import CredentialsProvider from "next-auth/providers/credentials";

export const credentialsProvider = CredentialsProvider({
  name: "credentials",
  credentials: {
    userName: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.userName || !credentials?.password) {
      throw new Error("Please enter both username and password");
    }

    try {
      const response = await authServerSideApi.post<ILoginUser>('login', {
        userName: credentials.userName,
        password: credentials.password,
      });


      console.log("Response on Credientials", response)

      if (!response.data) {
        throw new Error(response.error?.message || "Invalid credentials");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Something went wrong");
    }
  },
});
