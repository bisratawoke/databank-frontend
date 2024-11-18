/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error",
    // verifyRequest: "/auth/verify-request",
    // newUser: "/auth/new-user",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req: any) {
        console.log("=========== in authorizations baby ============");
        console.log(credentials);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/portal-users/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.username,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const response = await res.json();

        console.log("========in here baby ===========");
        console.log(response.user);
        console.log(response);

        if (res.ok && response.user && response.access_token) {
          return {
            ...response.user,
            accessToken: response.access_token,
            refreshToken: "",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
