

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? "defaultClientId",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "defaultClientSecret",
    }),
    
  ],
};

export default NextAuth(authOptions);
