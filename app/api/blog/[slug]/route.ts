import { Prisma } from "@/app/lib/Prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const {slug} =await params
  try {
    // Fetch post by slug from the database
    const post = await Prisma.post.findUnique({
      where: {
        slug: slug, // Matching the slug with the query parameter
      },
      include: {
        author: {
          select: {
            email: true, // Get the author's email
          },
        },
      },
    });

    // If no post is found, return a 404
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Return the post as JSON
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
