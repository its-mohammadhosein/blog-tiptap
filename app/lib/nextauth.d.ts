import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    userId: number;
    role: "admin" | "writer" | "pending";
  }
  interface User extends DefaultUser {
    role: "admin" | "writer" | "pending";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number;
    role: "admin" | "writer" | "pending";
  }
}
