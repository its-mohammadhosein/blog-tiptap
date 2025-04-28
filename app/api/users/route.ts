import { Prisma } from "@/app/lib/Prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await Prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt:true,
      _count: { select: { posts: true } },
    },
  });
  if (users) {
    return NextResponse.json({ result: users });
  }
  return NextResponse.json({ message: "no User found" });
}
