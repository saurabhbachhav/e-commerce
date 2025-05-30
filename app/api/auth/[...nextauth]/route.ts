import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import connection from "../../../../(backend)/db/database_connection/mongodb_collections";
import User from "../../../../(backend)/db/models/user.model";

// Ensure DB connection
await connection;

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET || "",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const userProfile = profile as {
          name: string;
          email: string;
          picture: string;
        };

        try {
          let user = await User.findOne({ email: userProfile.email });
          if (!user) {
            user = await User.create({
              name: userProfile.name,
              email: userProfile.email,
              image: userProfile.picture,
              isOAuth: true,
            });
          }

          token.id = user._id.toString();
          token.name = userProfile.name;
          token.email = userProfile.email;
          token.picture = userProfile.picture;
        } catch (error) {
          console.error("Error during user creation or lookup:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// Export handler as GET and POST
export { handler as GET, handler as POST };
