// app/api/post/[slug]/route.ts
import { Prisma } from '@/app/lib/Prisma';
import { NextRequest } from 'next/server';
// import { prisma } from '@/lib/prisma'; // adjust if necessary

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return Response.json({ error: 'Post slug is required.' }, { status: 400 });
  }

  let data;
  try {
    data = await req.json();
  } catch (error) {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { title, content, slug: newSlug, authorId } = data;

  if (!title || !content || !newSlug || !authorId) {
    return Response.json({ error: 'Title, content, new slug, and authorId are required.' }, { status: 400 });
  }

  try {
    const updatedPost = await Prisma.post.update({
      where: { slug }, // find post by old slug
      data: {
        title,
        content,
        slug: newSlug,  // allow updating the slug
        authorId,
      },
    });

    return Response.json(updatedPost);
  } catch (error: any) {
    console.error(error);

    if (error.code === 'P2025') {
      // Post not found
      return Response.json({ error: 'Post not found.' }, { status: 404 });
    }

    if (error.code === 'P2002') {
      // Prisma unique constraint failed (new slug already exists)
      return Response.json({ error: 'Slug already exists. Please choose another.' }, { status: 409 });
    }

    return Response.json({ error: error.message || 'Something went wrong.' }, { status: 500 });
  }
}
