import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/users";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/rateLimiter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { blocked, remaining } = checkRateLimit(credentials.email);

        if (blocked) {
          throw new Error("Cuenta bloqueada. Intenta en 15 minutos.");
        }

        const user = findUserByEmail(credentials.email);
        if (!user) {
          recordFailedAttempt(credentials.email);
          throw new Error("Credenciales inválidas.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          const result = recordFailedAttempt(credentials.email);
          if (result.blocked) {
            throw new Error("Demasiados intentos. Cuenta bloqueada 15 minutos.");
          }
          throw new Error(
            `Credenciales inválidas. Intentos restantes: ${result.remaining}`
          );
        }

        clearAttempts(credentials.email);
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
