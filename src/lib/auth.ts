import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { storeLinks: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // "MERCHANT" | "ADMIN"
          storeIds: user.storeLinks.map((l) => l.storeId),
        } as any;
      },
    }),
  ],
  callbacks: {
    // Copie les champs custom (role, storeIds) dans le token JWT...
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },
    // ...puis dans la session exposée côté client/serveur.
    async session({ session, token }) {
      session.user = Object.assign(session.user ?? {}, token);
      return session;
    },
  },
  pages: { signIn: "/login" },
};
