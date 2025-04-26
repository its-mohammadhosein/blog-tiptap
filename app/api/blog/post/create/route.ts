import { generateSlug } from "@/app/lib/generateSlug";
import { Prisma } from "@/app/lib/Prisma";
import { PostSchema, SlugSchema } from "@/app/lib/Zod";
import { NextResponse } from "next/server";
// import { generateSlug } from "@/lib/generateSlug";
// import { PostSchema, SlugSchema } from "@/lib/validators/postValidator";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = PostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, content, authorId, slug } = parsed.data;

    const Genslug = slug ? slug : generateSlug(title);
    const slugValidation = SlugSchema.safeParse(Genslug);

    if (!slugValidation.success) {
      return NextResponse.json(
        { error: slugValidation.error.message },
        { status: 400 }
      );
    }

    const post = await Prisma.post.create({
      data: {
        title,
        slug: slugValidation.data,
        content,
        authorId: Number(authorId),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown, status: number = 400) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Something went wrong" }, { status });
}
