// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Import MongoDB connection and User model
import connection from "../../../../(backend)/db/database_connection/mongodb_collections";
import User from "../../../../(backend)/db/models/user.model";

// Ensure MongoDB connection
await connection;

export const authOptions: NextAuthOptions = {
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
        const userProfile = profile as { name: string; email: string; picture: string };

        try {
          // Find or create the user in the database
          let user = await User.findOne({ email: userProfile.email });
          if (!user) {
            user = await User.create({
              name: userProfile.name,
              email: userProfile.email,
              image: userProfile.picture,
              isOAuth: true,
            });
          }

          // Add the user's ID to the token
          token.id = user._id.toString(); // Convert ObjectId to string
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
      // Attach user details, including the ID, to the session
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

// Next.js App Router requires named exports for HTTP methods
export { handler as GET, handler as POST };
