import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import VK from "next-auth/providers/vk";
import Yandex from "next-auth/providers/yandex";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/utils";

const providers: any[] = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Пароль", type: "password" },
    },
    async authorize(credentials) {
      const parsed = z
        .object({
          email: z.string().email(),
          password: z.string().min(8),
        })
        .safeParse(credentials);

      if (!parsed.success) return null;

      const user = await db.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });

      if (!user?.passwordHash || user.deletedAt) return null;
      const valid = verifyPassword(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    },
  }),
];

if (process.env.AUTH_VK_ID && process.env.AUTH_VK_SECRET) {
  providers.push(
    VK({
      clientId: process.env.AUTH_VK_ID,
      clientSecret: process.env.AUTH_VK_SECRET,
    }),
  );
}

if (process.env.AUTH_YANDEX_ID && process.env.AUTH_YANDEX_SECRET) {
  providers.push(
    Yandex({
      clientId: process.env.AUTH_YANDEX_ID,
      clientSecret: process.env.AUTH_YANDEX_SECRET,
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? token.role ?? "USER";
      }

      if (!token.role && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email && user.id) {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_REGISTERED",
            entityType: "User",
            entityId: user.id,
            details: { email: user.email },
          },
        });
      }
    },
  },
});
