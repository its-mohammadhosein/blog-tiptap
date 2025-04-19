// app/api/posts/route.ts
import { Prisma } from "@/app/lib/Prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await Prisma.post.findMany({
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("[POSTS_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
